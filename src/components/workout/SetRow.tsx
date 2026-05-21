import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseCategory, ExerciseSet } from '@/src/types/workout';
import { useT } from '@/src/hooks/useT';

interface SetRowProps {
  set: ExerciseSet;
  category: ExerciseCategory;
  onUpdate: (data: Partial<ExerciseSet>) => void;
  onComplete: () => void;
}

/**
 * Renders a set row adapted to the exercise category:
 * - strength: KG | REPS
 * - bodyweight: +KG (optional) | REPS
 * - cardio: MIN | SEC (duration as separate fields)
 * - flexibility: MIN | SEC (duration as separate fields)
 */
export function SetRow({ set, category, onUpdate, onComplete }: SetRowProps) {
  const t = useT();

  // Duration helpers: store as total seconds, edit as min + sec
  const durationMin = set.durationSeconds != null ? Math.floor(set.durationSeconds / 60) : null;
  const durationSec = set.durationSeconds != null ? set.durationSeconds % 60 : null;

  const updateDuration = (min: string, sec: string) => {
    const m = min === '' ? 0 : parseInt(min, 10) || 0;
    const s = sec === '' ? 0 : parseInt(sec, 10) || 0;
    // If both are empty/zero and user cleared both, set to null
    if (min === '' && sec === '') {
      onUpdate({ durationSeconds: null });
    } else {
      onUpdate({ durationSeconds: Math.max(0, m * 60 + s) });
    }
  };

  const renderInputs = () => {
    // Cardio (treadmill, cycling, rowing etc.) — TIME + DISTANCE
    if (category === 'cardio') {
      return (
        <>
          <View className="flex-1 mx-1 flex-row items-center bg-dark-100 rounded-lg overflow-hidden">
            <TextInput
              className="flex-1 text-center py-2 text-dark-900"
              placeholder="0"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={durationMin != null ? String(durationMin) : ''}
              onChangeText={(v) =>
                updateDuration(v, durationSec != null ? String(durationSec) : '0')
              }
              maxLength={3}
            />
            <Text className="text-dark-400 font-bold">:</Text>
            <TextInput
              className="flex-1 text-center py-2 text-dark-900"
              placeholder="00"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={durationSec != null ? String(durationSec).padStart(2, '0') : ''}
              onChangeText={(v) =>
                updateDuration(durationMin != null ? String(durationMin) : '0', v)
              }
              maxLength={2}
            />
          </View>
          <TextInput
            className="flex-1 mx-1 bg-dark-100 rounded-lg text-center py-2 text-dark-900"
            placeholder="0.0"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
            value={set.distanceMeters != null && set.distanceMeters > 0 ? String(set.distanceMeters / 1000) : ''}
            onChangeText={(v) => {
              const num = parseFloat(v);
              onUpdate({ distanceMeters: !isNaN(num) ? Math.round(num * 1000) : null });
            }}
          />
        </>
      );
    }

    // Flexibility (plank, stretches) — just TIME (min:sec)
    if (category === 'flexibility') {
      return (
        <View className="flex-[2] mx-1 flex-row items-center bg-dark-100 rounded-lg overflow-hidden">
          <TextInput
            className="flex-1 text-center py-2 text-dark-900"
            placeholder="0"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={durationMin != null ? String(durationMin) : ''}
            onChangeText={(v) =>
              updateDuration(v, durationSec != null ? String(durationSec) : '0')
            }
            maxLength={3}
          />
          <Text className="text-dark-400 font-bold text-xs">мин</Text>
          <TextInput
            className="flex-1 text-center py-2 text-dark-900"
            placeholder="00"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={durationSec != null ? String(durationSec).padStart(2, '0') : ''}
            onChangeText={(v) =>
              updateDuration(durationMin != null ? String(durationMin) : '0', v)
            }
            maxLength={2}
          />
          <Text className="text-dark-400 font-bold text-xs mr-2">сек</Text>
        </View>
      );
    }

    // Bodyweight (pushups, pullups, burpees) — optional +KG | REPS
    if (category === 'bodyweight') {
      return (
        <>
          <TextInput
            className="flex-1 mx-1 bg-dark-100 rounded-lg text-center py-2 text-dark-900"
            placeholder="+0"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={set.weightKg != null && set.weightKg > 0 ? String(set.weightKg) : ''}
            onChangeText={(v) => {
              const num = parseInt(v, 10);
              onUpdate({ weightKg: !isNaN(num) && num > 0 ? num : null });
            }}
          />
          <TextInput
            className="flex-1 mx-1 bg-dark-100 rounded-lg text-center py-2 text-dark-900"
            placeholder="0"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={set.reps != null ? String(set.reps) : ''}
            onChangeText={(v) => {
              const num = parseInt(v, 10);
              onUpdate({ reps: !isNaN(num) ? num : null });
            }}
          />
        </>
      );
    }

    // Strength (default) — KG | REPS
    return (
      <>
        <TextInput
          className="flex-1 mx-1 bg-dark-100 rounded-lg text-center py-2 text-dark-900"
          placeholder="0"
          placeholderTextColor="#94A3B8"
          keyboardType="decimal-pad"
          value={set.weightKg != null ? String(set.weightKg) : ''}
          onChangeText={(v) => {
            const num = parseFloat(v);
            onUpdate({ weightKg: !isNaN(num) ? num : null });
          }}
        />
        <TextInput
          className="flex-1 mx-1 bg-dark-100 rounded-lg text-center py-2 text-dark-900"
          placeholder="0"
          placeholderTextColor="#94A3B8"
          keyboardType="number-pad"
          value={set.reps != null ? String(set.reps) : ''}
          onChangeText={(v) => {
            const num = parseInt(v, 10);
            onUpdate({ reps: !isNaN(num) ? num : null });
          }}
        />
      </>
    );
  };

  return (
    <View className={`flex-row items-center py-2.5 px-1 rounded-xl mb-1 ${set.completed ? 'bg-success-50' : ''}`}>
      <View
        className={`w-8 h-8 rounded-lg items-center justify-center mr-1 ${
          set.completed ? 'bg-success-500' : 'bg-dark-200'
        }`}
      >
        <Text className={`text-xs font-extrabold ${set.completed ? 'text-white' : 'text-dark-400'}`}>
          {set.setNumber}
        </Text>
      </View>
      {renderInputs()}
      <TouchableOpacity onPress={onComplete} className="w-8 items-center">
        <Ionicons
          name={set.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={set.completed ? '#1fc98a' : '#b8c9db'}
        />
      </TouchableOpacity>
    </View>
  );
}

export function SetHeader({ category }: { category: ExerciseCategory }) {
  const t = useT();

  const labels = (() => {
    if (category === 'cardio') return ['мин:сек', 'км'];
    if (category === 'flexibility') return ['мин : сек'];
    if (category === 'bodyweight') return [`+${t('workouts.kg')}`, t('workouts.reps')];
    return [t('workouts.kg'), t('workouts.reps')];
  })();

  return (
    <View className="flex-row items-center py-2 border-b border-dark-200 mb-1">
      <View className="w-9" />
      {labels.map((label, i) => (
        <Text
          key={i}
          className={`${labels.length === 1 ? 'flex-[2]' : 'flex-1'} text-xs font-extrabold text-dark-400 text-center uppercase`}
        >
          {label}
        </Text>
      ))}
      <View className="w-8" />
    </View>
  );
}
