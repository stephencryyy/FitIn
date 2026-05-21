import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { signUpWithEmail } from '@/src/lib/firebase/auth';
import { createUserDoc } from '@/src/lib/firebase/firestore';
import { useT } from '@/src/hooks/useT';

export default function SignUp() {
  const router = useRouter();
  const t = useT();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError(t('auth.fillAllFields'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.passwordsDontMatch'));
      return;
    }
    if (password.length < 6) {
      setError(t('auth.passwordMinLength'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = await signUpWithEmail(email, password, name);
      await createUserDoc(user.uid, {
        email,
        displayName: name,
        username: null,
        photoURL: null,
        role: 'user',
        onboardingComplete: false,
        isPublic: true,
        profile: {
          heightCm: 0,
          weightKg: 0,
          dateOfBirth: '',
          gender: 'prefer_not_to_say',
          fitnessGoal: 'general_fitness',
          experienceLevel: 'beginner',
          dietaryPreferences: [],
          activityLevel: 'moderate',
        },
        stats: {
          totalWorkouts: 0,
          totalVolume: 0,
          currentStreak: 0,
          longestStreak: 0,
        },
        settings: {
          unitSystem: 'metric',
          notifications: true,
          healthSyncEnabled: false,
        },
      });
    } catch (err: any) {
      setError(err.message || t('auth.signUpFailed'));
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
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-primary-500 rounded-2xl items-center justify-center mb-4">
              <Ionicons name="fitness" size={32} color="#fff" />
            </View>
            <Text className="text-2xl font-bold text-dark-900">{t('auth.createAccount')}</Text>
            <Text className="text-dark-400 mt-1">{t('auth.startJourney')}</Text>
          </View>

          {error ? (
            <View className="bg-danger-50 p-3 rounded-xl mb-4">
              <Text className="text-danger-600 text-center">{error}</Text>
            </View>
          ) : null}

          <Input
            label={t('auth.name')}
            placeholder={t('auth.name')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            icon="person-outline"
          />

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
            placeholder={t('auth.passwordMinLength')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />

          <Input
            label={t('auth.confirmPassword')}
            placeholder={t('auth.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />

          <View className="mt-2">
            <Button
              title={t('auth.createAccount')}
              onPress={handleSignUp}
              loading={loading}
              fullWidth
              size="lg"
            />
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-dark-400">{t('auth.hasAccount')} </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary-500 font-semibold">{t('auth.signIn')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
