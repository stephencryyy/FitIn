import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { useSettingsStore } from '@/src/store/settingsStore';
import { useAuth } from '@/src/providers/AuthProvider';
import { updateUserDoc } from '@/src/lib/firebase/firestore';
import { useT } from '@/src/hooks/useT';
import { SUPPORTED_LOCALES, SupportedLocale } from '@/src/i18n';

export default function Settings() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const {
    locale,
    setLocale,
    unitSystem,
    setUnitSystem,
    restTimerDefault,
    setRestTimerDefault,
    darkMode,
    setDarkMode,
  } = useSettingsStore();
  const t = useT();

  const [langModalOpen, setLangModalOpen] = useState(false);

  const notifications = profile?.settings?.notifications ?? true;
  const healthSync = profile?.settings?.healthSyncEnabled ?? false;

  const toggleNotifications = async () => {
    if (!user || !profile) return;
    try {
      await updateUserDoc(user.uid, {
        settings: { ...profile.settings, notifications: !notifications },
      });
      await refreshProfile();
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('profile.failedToSave'));
    }
  };

  const toggleHealthSync = () => {
    Alert.alert(t('settings.healthSync'), t('settings.healthSyncAlert'));
  };

  const currentLocale = SUPPORTED_LOCALES.find((l) => l.code === locale) ?? SUPPORTED_LOCALES[0];

  return (
    <SafeAreaView className="flex-1 bg-dark-50 dark:bg-dark-900">
      <View className="flex-row items-center px-5 py-3 bg-white dark:bg-dark-800 border-b border-dark-100 dark:border-dark-700">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={darkMode ? '#E2E8F0' : '#334155'} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-dark-900 dark:text-white ml-3">
          {t('settings.title')}
        </Text>
      </View>

      <ScrollView contentContainerClassName="p-5 pb-24">
        <Text className="text-sm font-semibold text-dark-500 dark:text-dark-300 uppercase mb-2">
          {t('settings.preferences')}
        </Text>
        <Card className="mb-5">
          {/* Language */}
          <TouchableOpacity
            onPress={() => setLangModalOpen(true)}
            className="flex-row items-center py-3 border-b border-dark-100"
          >
            <Ionicons name="language-outline" size={22} color="#64748B" />
            <View className="flex-1 ml-3">
              <Text className="font-semibold text-dark-900">{t('settings.language')}</Text>
              <Text className="text-xs text-dark-400 mt-0.5">{t('settings.languageDesc')}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="mr-1 text-lg">{currentLocale.flag}</Text>
              <Text className="text-sm font-semibold text-dark-700">{currentLocale.name}</Text>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>

          {/* Units */}
          <View className="flex-row items-center py-3 border-b border-dark-100">
            <Ionicons name="scale-outline" size={22} color="#64748B" />
            <View className="flex-1 ml-3">
              <Text className="font-semibold text-dark-900">{t('settings.units')}</Text>
              <Text className="text-xs text-dark-400 mt-0.5">{t('settings.unitsDesc')}</Text>
            </View>
            <View className="flex-row bg-dark-100 rounded-lg p-1">
              <TouchableOpacity
                onPress={() => setUnitSystem('metric')}
                className={`px-3 py-1 rounded-md ${unitSystem === 'metric' ? 'bg-white' : ''}`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    unitSystem === 'metric' ? 'text-dark-900' : 'text-dark-500'
                  }`}
                >
                  kg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUnitSystem('imperial')}
                className={`px-3 py-1 rounded-md ${unitSystem === 'imperial' ? 'bg-white' : ''}`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    unitSystem === 'imperial' ? 'text-dark-900' : 'text-dark-500'
                  }`}
                >
                  lb
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dark Mode */}
          <TouchableOpacity
            onPress={() => setDarkMode(!darkMode)}
            className="flex-row items-center py-3 border-b border-dark-100 dark:border-dark-700"
            accessibilityRole="switch"
            accessibilityState={{ checked: darkMode }}
          >
            <Ionicons
              name={darkMode ? 'moon' : 'moon-outline'}
              size={22}
              color={darkMode ? '#A0ABFF' : '#64748B'}
            />
            <View className="flex-1 ml-3">
              <Text className="font-semibold text-dark-900 dark:text-white">
                {t('settings.darkMode')}
              </Text>
              <Text className="text-xs text-dark-400 dark:text-dark-300 mt-0.5">
                {t('settings.darkModeDesc')}
              </Text>
            </View>
            <View
              className={`w-12 h-7 rounded-full p-1 ${
                darkMode ? 'bg-primary-500' : 'bg-dark-200'
              }`}
            >
              <View className={`w-5 h-5 bg-white rounded-full ${darkMode ? 'ml-auto' : ''}`} />
            </View>
          </TouchableOpacity>

          {/* Rest Timer */}
          <View className="flex-row items-center py-3">
            <Ionicons name="timer-outline" size={22} color="#64748B" />
            <View className="flex-1 ml-3">
              <Text className="font-semibold text-dark-900">{t('settings.restTimer')}</Text>
              <Text className="text-xs text-dark-400 mt-0.5">{t('settings.restTimerDesc')}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => setRestTimerDefault(Math.max(30, restTimerDefault - 15))}
                className="w-7 h-7 bg-dark-100 rounded-full items-center justify-center"
              >
                <Text className="text-dark-600 font-bold">−</Text>
              </TouchableOpacity>
              <Text className="font-semibold text-dark-900 w-12 text-center">
                {restTimerDefault}s
              </Text>
              <TouchableOpacity
                onPress={() => setRestTimerDefault(Math.min(300, restTimerDefault + 15))}
                className="w-7 h-7 bg-dark-100 rounded-full items-center justify-center"
              >
                <Text className="text-dark-600 font-bold">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        <Text className="text-sm font-semibold text-dark-500 uppercase mb-2">
          {t('settings.notifications')}
        </Text>
        <Card className="mb-5">
          <TouchableOpacity onPress={toggleNotifications} className="flex-row items-center py-3">
            <Ionicons name="notifications-outline" size={22} color="#64748B" />
            <View className="flex-1 ml-3">
              <Text className="font-semibold text-dark-900">
                {t('settings.pushNotifications')}
              </Text>
              <Text className="text-xs text-dark-400 mt-0.5">
                {t('settings.pushNotificationsDesc')}
              </Text>
            </View>
            <View
              className={`w-12 h-7 rounded-full p-1 ${
                notifications ? 'bg-primary-500' : 'bg-dark-200'
              }`}
            >
              <View className={`w-5 h-5 bg-white rounded-full ${notifications ? 'ml-auto' : ''}`} />
            </View>
          </TouchableOpacity>
        </Card>

        <Text className="text-sm font-semibold text-dark-500 uppercase mb-2">
          {t('settings.integrations')}
        </Text>
        <Card className="mb-5">
          <TouchableOpacity onPress={toggleHealthSync} className="flex-row items-center py-3">
            <Ionicons name="heart-outline" size={22} color="#64748B" />
            <View className="flex-1 ml-3">
              <Text className="font-semibold text-dark-900">{t('settings.healthSync')}</Text>
              <Text className="text-xs text-dark-400 mt-0.5">{t('settings.healthSyncDesc')}</Text>
            </View>
            <View
              className={`w-12 h-7 rounded-full p-1 ${
                healthSync ? 'bg-primary-500' : 'bg-dark-200'
              }`}
            >
              <View className={`w-5 h-5 bg-white rounded-full ${healthSync ? 'ml-auto' : ''}`} />
            </View>
          </TouchableOpacity>
        </Card>

        <Text className="text-sm font-semibold text-dark-500 uppercase mb-2">
          {t('settings.about')}
        </Text>
        <Card>
          <View className="py-2">
            <Text className="text-dark-500 text-sm">FitIn</Text>
            <Text className="text-dark-400 text-xs mt-0.5">{t('settings.version')} 1.0.0</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Language picker modal */}
      <Modal
        visible={langModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setLangModalOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setLangModalOpen(false)}
        >
          <TouchableOpacity activeOpacity={1} className="bg-white rounded-t-3xl pb-8 pt-4">
            <View className="w-12 h-1 bg-dark-200 rounded-full self-center mb-4" />
            <Text className="text-lg font-bold text-dark-900 text-center mb-4">
              {t('settings.language')}
            </Text>
            {SUPPORTED_LOCALES.map((l) => {
              const isSelected = l.code === locale;
              return (
                <TouchableOpacity
                  key={l.code}
                  onPress={() => {
                    setLocale(l.code as SupportedLocale);
                    setLangModalOpen(false);
                  }}
                  className={`flex-row items-center px-5 py-4 ${
                    isSelected ? 'bg-primary-50' : ''
                  }`}
                >
                  <Text className="text-2xl mr-3">{l.flag}</Text>
                  <Text
                    className={`flex-1 text-base font-semibold ${
                      isSelected ? 'text-primary-600' : 'text-dark-900'
                    }`}
                  >
                    {l.name}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={22} color="#3B82F6" />}
                </TouchableOpacity>
              );
            })}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
