import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { resetPassword } from '@/src/lib/firebase/auth';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email) {
      setError('Enter your email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <View className="w-20 h-20 bg-success-50 rounded-full items-center justify-center mb-4">
          <Ionicons name="mail" size={40} color="#22C55E" />
        </View>
        <Text className="text-xl font-bold text-dark-900 mb-2">Check your email</Text>
        <Text className="text-dark-400 text-center mb-6">
          We sent a password reset link to {email}
        </Text>
        <Button title="Back to Sign In" onPress={() => router.back()} variant="outline" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white justify-center px-6">
      <Text className="text-2xl font-bold text-dark-900 mb-2">Reset Password</Text>
      <Text className="text-dark-400 mb-6">Enter your email to receive a reset link</Text>

      {error ? (
        <View className="bg-danger-50 p-3 rounded-xl mb-4">
          <Text className="text-danger-600 text-center">{error}</Text>
        </View>
      ) : null}

      <Input
        label="Email"
        placeholder="your@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        icon="mail-outline"
      />

      <Button title="Send Reset Link" onPress={handleReset} loading={loading} fullWidth size="lg" />

      <View className="mt-4">
        <Button title="Back" onPress={() => router.back()} variant="ghost" fullWidth />
      </View>
    </SafeAreaView>
  );
}
