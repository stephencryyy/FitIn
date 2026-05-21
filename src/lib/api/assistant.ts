import { httpsCallable } from 'firebase/functions';
import { functions } from '@/src/lib/firebase/config';

interface ChatMessageHistory {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
  remaining: number;
}

const assistantChatFn = httpsCallable<
  { message: string; chatId?: string; history?: ChatMessageHistory[] },
  ChatResponse
>(functions, 'assistantChat');

export async function sendAssistantMessage(
  message: string,
  history: ChatMessageHistory[] = [],
  chatId?: string,
): Promise<ChatResponse> {
  const result = await assistantChatFn({ message, history, chatId });
  return result.data;
}
