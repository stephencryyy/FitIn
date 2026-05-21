import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useT } from '@/src/hooks/useT';

interface RestTimerProps {
  seconds: number;
  onSkip: () => void;
  onFinish: () => void;
  onAddTime: (delta: number) => void;
}

export function RestTimer({ seconds, onSkip, onFinish, onAddTime }: RestTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const initialRef = useRef(seconds);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const t = useT();

  useEffect(() => {
    initialRef.current = seconds;
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      onFinish();
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    Animated.timing(progressAnim, {
      toValue: remaining / initialRef.current,
      duration: 900,
      useNativeDriver: false,
    }).start();

    return () => clearInterval(interval);
  }, [remaining]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <View className="absolute bottom-0 left-0 right-0 pb-24">
      <LinearGradient
        colors={['#16263d', '#243e67', '#2c5387']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="mx-4 p-5 rounded-3xl"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.2,
          shadowRadius: 24,
          elevation: 20,
        }}
      >
        <Text className="text-xs font-extrabold uppercase tracking-wider text-accent-300">
          {t('workouts.restTimer')}
        </Text>
        <Text
          className="text-[42px] font-extrabold text-white mt-1"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {display}
        </Text>
        <Text className="text-sm font-semibold text-white/60 mt-1 mb-4">
          {remaining > 30 ? t('workouts.rest') : t('workouts.rest')}
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => onAddTime(-15)}
            className="flex-1 bg-dark-100 py-3 rounded-xl items-center"
          >
            <Text className="font-extrabold text-dark-900">-15s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSkip}
            className="flex-1 bg-dark-100 py-3 rounded-xl items-center"
          >
            <Text className="font-extrabold text-dark-900">{t('workouts.skipRest')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onAddTime(15)}
            className="flex-1 bg-dark-100 py-3 rounded-xl items-center"
          >
            <Text className="font-extrabold text-dark-900">+15s</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
