import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { sendAssistantMessage } from '@/src/lib/api/assistant';
import { useAuth } from '@/src/providers/AuthProvider';
import { getLatestAssistantChat } from '@/src/lib/firebase/firestore';
import { useT } from '@/src/hooks/useT';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistantScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useT();

  const [chatId, setChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  // Load latest chat history on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user) {
        setLoadingHistory(false);
        return;
      }
      try {
        const latest = await getLatestAssistantChat(user.uid);
        if (cancelled) return;
        if (latest && Array.isArray(latest.messages)) {
          setChatId(latest.id);
          setMessages(
            latest.messages.map((m: any) => ({
              role: m.role as 'user' | 'assistant',
              content: m.content as string,
            })),
          );
          setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
        }
      } catch (err) {
        // Silent fail — backend may not be deployed yet
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const SUGGESTIONS = [
    t('assistant.suggestion1'),
    t('assistant.suggestion2'),
    t('assistant.suggestion3'),
    t('assistant.suggestion4'),
  ];

  const handleNewChat = () => {
    setChatId(null);
    setMessages([]);
    setError('');
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || message).trim();
    if (!text || sending) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage('');
    setError('');
    setSending(true);

    try {
      const response = await sendAssistantMessage(text, messages, chatId || undefined);
      setMessages([...updatedMessages, { role: 'assistant', content: response.message }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err: any) {
      const code = err?.code || '';
      const msg = code.includes('resource-exhausted')
        ? t('assistant.rateLimitError')
        : err?.message || t('assistant.failedToGet');
      setError(msg);
      setMessages(messages);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-dark-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#122033" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Ionicons name="sparkles" size={20} color="#ff6b3d" />
          <Text className="text-lg font-extrabold text-dark-900 ml-2">
            {t('assistant.title')}
          </Text>
        </View>
        {messages.length > 0 ? (
          <TouchableOpacity onPress={handleNewChat} className="px-2">
            <Ionicons name="create-outline" size={22} color="#ff6b3d" />
          </TouchableOpacity>
        ) : (
          <View className="w-6" />
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          ref={scrollRef}
          contentContainerClassName="flex-grow px-5 py-6"
          showsVerticalScrollIndicator={false}
        >
          {loadingHistory ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#ff6b3d" />
            </View>
          ) : messages.length === 0 ? (
            <>
              <View className="items-center mb-8">
                <View className="w-16 h-16 bg-primary-50 rounded-full items-center justify-center mb-4">
                  <Ionicons name="sparkles" size={32} color="#ff6b3d" />
                </View>
                <Text className="text-lg font-extrabold text-dark-900 mb-2">
                  {t('assistant.howCanIHelp')}
                </Text>
                <Text className="text-sm font-semibold text-dark-400 text-center">
                  {t('assistant.accessDesc')}
                </Text>
              </View>

              <View className="gap-3">
                {SUGGESTIONS.map((s) => (
                  <Card key={s} onPress={() => handleSend(s)}>
                    <Text className="text-dark-700 font-semibold">{s}</Text>
                  </Card>
                ))}
              </View>
            </>
          ) : (
            <View className="gap-3">
              {messages.map((msg, i) => (
                <View
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary-500 self-end'
                      : 'bg-dark-100 self-start'
                  }`}
                >
                  <Text
                    className={msg.role === 'user' ? 'text-white' : 'text-dark-900'}
                  >
                    {msg.content}
                  </Text>
                </View>
              ))}
              {sending && (
                <View className="bg-dark-100 rounded-2xl px-4 py-3 self-start">
                  <ActivityIndicator size="small" color="#ff6b3d" />
                </View>
              )}
            </View>
          )}

          {error ? (
            <View className="bg-danger-50 p-3 rounded-xl mt-4">
              <Text className="text-danger-600 text-center font-semibold">{error}</Text>
            </View>
          ) : null}
        </ScrollView>

        <View className="px-5 pb-4 pt-2 border-t border-dark-200">
          <View className="flex-row items-center bg-dark-50 rounded-xl px-4 border border-dark-200">
            <TextInput
              className="flex-1 py-3 text-base text-dark-900"
              placeholder={t('assistant.askAnything')}
              placeholderTextColor="#94A3B8"
              value={message}
              onChangeText={setMessage}
              multiline
              editable={!sending}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={!message.trim() || sending}
              className={`ml-2 w-9 h-9 rounded-full items-center justify-center ${
                message.trim() && !sending ? 'bg-primary-500' : 'bg-dark-200'
              }`}
            >
              <Ionicons name="arrow-up" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
