import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import Anthropic from '@anthropic-ai/sdk';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import { buildUserContext } from './context';
import { checkRateLimit } from './rateLimiter';

const anthropicKey = defineSecret('ANTHROPIC_API_KEY');

// Rough char budget for the rolling chat history sent to Claude.
// ~4 chars/token → 24k chars ≈ 6k tokens, leaving room for system + user msg.
const HISTORY_CHAR_BUDGET = 24_000;
const HISTORY_MAX_MESSAGES = 20;

const SYSTEM_PROMPT = `You are FitIn AI, a knowledgeable and supportive fitness coach integrated into a fitness tracking app. You have access to the user's profile, recent workouts, and nutrition data.

Your role:
- Provide personalized fitness advice based on the user's data
- Help create workout plans tailored to their goals and experience
- Suggest nutrition strategies aligned with their dietary preferences
- Answer fitness and health questions with evidence-based information
- Be encouraging and motivational, but honest about realistic expectations

Guidelines:
- Keep responses concise and actionable (under 300 words unless detail is requested)
- Use the user's actual data in your advice
- Recommend consulting medical professionals for injuries or health concerns
- Never recommend dangerous practices, extreme diets, or supplements without caveats
- Format responses with markdown when helpful (bullets, headers)`;

type ChatRole = 'user' | 'assistant';

interface ChatMessageInput {
  role: ChatRole;
  content: string;
}

interface ChatRequest {
  message: string;
  chatId?: string;
  history?: ChatMessageInput[];
}

function isChatMessage(value: unknown): value is ChatMessageInput {
  if (!value || typeof value !== 'object') return false;
  const m = value as Partial<ChatMessageInput>;
  return (
    (m.role === 'user' || m.role === 'assistant') &&
    typeof m.content === 'string' &&
    m.content.length > 0 &&
    m.content.length <= 4000
  );
}

function validateRequest(data: unknown): ChatRequest {
  if (!data || typeof data !== 'object') {
    throw new HttpsError('invalid-argument', 'Invalid payload');
  }
  const { message, chatId, history } = data as Partial<ChatRequest>;

  if (typeof message !== 'string' || message.trim().length === 0 || message.length > 2000) {
    throw new HttpsError('invalid-argument', 'Message must be a non-empty string up to 2000 chars');
  }
  if (chatId !== undefined && (typeof chatId !== 'string' || chatId.length > 128)) {
    throw new HttpsError('invalid-argument', 'Invalid chatId');
  }
  let cleanHistory: ChatMessageInput[] = [];
  if (history !== undefined) {
    if (!Array.isArray(history)) {
      throw new HttpsError('invalid-argument', 'history must be an array');
    }
    cleanHistory = history.filter(isChatMessage);
  }
  return { message, chatId, history: cleanHistory };
}

function trimHistory(history: ChatMessageInput[]): ChatMessageInput[] {
  // Keep most recent messages within HISTORY_CHAR_BUDGET and HISTORY_MAX_MESSAGES.
  const recent = history.slice(-HISTORY_MAX_MESSAGES);
  const out: ChatMessageInput[] = [];
  let chars = 0;
  for (let i = recent.length - 1; i >= 0; i--) {
    const msg = recent[i];
    if (chars + msg.content.length > HISTORY_CHAR_BUDGET) break;
    out.unshift(msg);
    chars += msg.content.length;
  }
  return out;
}

export const assistantChat = onCall(
  { secrets: [anthropicKey], maxInstances: 10 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }

    const userId = request.auth.uid;
    const { message, chatId, history = [] } = validateRequest(request.data);

    const { allowed, remaining } = await checkRateLimit(userId);
    if (!allowed) {
      throw new HttpsError('resource-exhausted', 'Rate limit exceeded. Try again later.');
    }

    try {
      const userContext = await buildUserContext(userId);
      const fullSystemPrompt = `${SYSTEM_PROMPT}\n\nUser's current data:\n${userContext}`;

      const anthropic = new Anthropic({ apiKey: anthropicKey.value() });

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: fullSystemPrompt,
        messages: [
          ...trimHistory(history),
          { role: 'user', content: message },
        ],
      });

      const textBlock = response.content.find((b) => b.type === 'text');
      const assistantMessage = textBlock && textBlock.type === 'text' ? textBlock.text : '';

      const db = admin.firestore();
      const chatRef = db
        .collection('users')
        .doc(userId)
        .collection('assistantChats')
        .doc(chatId || `chat_${Date.now()}`);

      await chatRef.set(
        {
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          messages: admin.firestore.FieldValue.arrayUnion(
            { role: 'user', content: message, createdAt: admin.firestore.Timestamp.now() },
            { role: 'assistant', content: assistantMessage, createdAt: admin.firestore.Timestamp.now() },
          ),
        },
        { merge: true },
      );

      return {
        message: assistantMessage,
        remaining,
      };
    } catch (err: unknown) {
      if (err instanceof HttpsError) throw err;
      const errMessage = err instanceof Error ? err.message : String(err);
      logger.error('assistantChat failed', { userId, error: errMessage });
      throw new HttpsError('internal', 'Assistant error');
    }
  },
);
