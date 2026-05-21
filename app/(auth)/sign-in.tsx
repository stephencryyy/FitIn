import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { signInWithEmail } from '@/src/lib/firebase/auth';
import { useT } from '@/src/hooks/useT';

export default function SignIn() {
  const router = useRouter();
  const t = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError(t('auth.fillAllFields'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || t('auth.signInFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-10">
            <View className="w-16 h-16 bg-primary-500 rounded-2xl items-center justify-center mb-4">
              <Ionicons name="fitness" size={32} color="#fff" />
            </View>
            <Text className="text-3xl font-bold text-dark-900">FitIn</Text>
            <Text className="text-dark-400 mt-1">{t('auth.yourFitness')}</Text>
          </View>

          {error ? (
            <View className="bg-danger-50 p-3 rounded-xl mb-4">
              <Text className="text-danger-600 text-center">{error}</Text>
            </View>
          ) : null}

          <Input
            label={t('auth.email')}
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />

          <Input
            label={t('auth.password')}
            placeholder="••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            className="self-end mb-6"
          >
            <Text className="text-primary-500 text-sm">{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>

          <Button
            title={t('auth.signIn')}
            onPress={handleSignIn}
            loading={loading}
            fullWidth
            size="lg"
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-dark-400">{t('auth.noAccount')} </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <Text className="text-primary-500 font-semibold">{t('auth.signUp')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
