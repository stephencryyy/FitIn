import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/src/components/ui/Input';
import { DateInput } from '@/src/components/ui/DateInput';
import { UsernameInput } from '@/src/components/ui/UsernameInput';
import { Button } from '@/src/components/ui/Button';
import { Gender } from '@/src/types/user';
import { useAuth } from '@/src/providers/AuthProvider';
import { useT } from '@/src/hooks/useT';

export default function PersonalInfo() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useT();

  const [username, setUsername] = useState('');
  const [usernameValid, setUsernameValid] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');

  const genders: { value: Gender; label: string }[] = [
    { value: 'male', label: t('onboarding.male') },
    { value: 'female', label: t('onboarding.female') },
    { value: 'other', label: t('onboarding.other') },
  ];

  const canContinue = usernameValid && height && weight && birthDate.length === 10 && gender;

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/fitness-goals',
      params: { username, height, weight, birthDate, gender },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-6 py-8 flex-grow"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-2xl font-bold text-dark-900 mb-2">{t('onboarding.aboutYou')}</Text>
          <Text className="text-dark-400 mb-6">{t('onboarding.basicInfo')}</Text>

          <UsernameInput
            label={t('onboarding.username')}
            value={username}
            onChangeText={setUsername}
            onValidityChange={setUsernameValid}
            currentUserId={user?.uid}
          />

          <View className="mb-6">
            <Text className="text-sm font-medium text-dark-700 mb-3">{t('onboarding.gender')}</Text>
            <View className="flex-row gap-3">
              {genders.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  onPress={() => setGender(g.value)}
                  className={`flex-1 py-4 rounded-xl border-2 items-center ${
                    gender === g.value ? 'border-primary-500 bg-primary-50' : 'border-dark-200'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      gender === g.value ? 'text-primary-600' : 'text-dark-500'
                    }`}
                  >
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label={t('onboarding.height')}
            placeholder="175"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />

          <Input
            label={t('onboarding.weight')}
            placeholder="70"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />

          <DateInput
            label={t('onboarding.dateOfBirth')}
            value={birthDate}
            onChangeText={setBirthDate}
          />

          <View className="flex-1 min-h-[20px]" />

          <View className="mt-6">
            <Button
              title={t('common.continue')}
              onPress={handleNext}
              disabled={!canContinue}
              fullWidth
              size="lg"
            />
            <View className="flex-row justify-center mt-4 gap-1.5">
              <View className="w-8 h-1.5 rounded-full bg-primary-500" />
              <View className="w-8 h-1.5 rounded-full bg-primary-500" />
              <View className="w-8 h-1.5 rounded-full bg-dark-200" />
              <View className="w-8 h-1.5 rounded-full bg-dark-200" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
