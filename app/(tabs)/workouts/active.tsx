import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { RestTimer } from '@/src/components/workout/RestTimer';
import { ExerciseCard } from '@/src/components/workout/ExerciseCard';
import { useWorkoutStore } from '@/src/store/workoutStore';
import { useSettingsStore } from '@/src/store/settingsStore';
import { useAuth } from '@/src/providers/AuthProvider';
import { saveWorkout } from '@/src/lib/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { useT } from '@/src/hooks/useT';
import { translateMuscle } from '@/src/i18n/helpers';
import { getExerciseName } from '@/src/i18n/exerciseTranslations';

export default function ActiveWorkout() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useT();
  const locale = useSettingsStore((s) => s.locale);
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout);
  const addSet = useWorkoutStore((s) => s.addSet);
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const completeSet = useWorkoutStore((s) => s.completeSet);
  const removeExercise = useWorkoutStore((s) => s.removeExercise);
  const finishWorkout = useWorkoutStore((s) => s.finishWorkout);
  const cancelWorkout = useWorkoutStore((s) => s.cancelWorkout);
  const restTimerDefault = useSettingsStore((s) => s.restTimerDefault);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [saving, setSaving] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restActive, setRestActive] = useState(false);

  useEffect(() => {
    if (!activeWorkout) return;
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - activeWorkout.startedAt.getTime()) / 1000);
      setElapsedTime(seconds);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  useEffect(() => {
    if (!activeWorkout) {
      router.replace('/(tabs)/workouts');
    }
  }, [activeWorkout]);

  const totalVolume = useMemo(() => {
    if (!activeWorkout) return 0;
    return activeWorkout.exercises.reduce((sum, ex) => {
      return (
        sum +
        ex.sets.reduce((s, set) => {
          if (set.completed && set.weightKg && set.reps) {
            return s + set.weightKg * set.reps;
          }
          return s;
        }, 0)
      );
    }, 0);
  }, [activeWorkout]);

  const formattedElapsed = useMemo(() => {
    const mins = Math.floor(elapsedTime / 60);
    const secs = elapsedTime % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [elapsedTime]);

  const handleCompleteSet = useCallback(
    (exerciseId: string, setIndex: number) => {
      completeSet(exerciseId, setIndex);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      // Auto-start rest timer
      setRestSeconds(restTimerDefault);
      setRestActive(true);
    },
    [completeSet, restTimerDefault],
  );

  const handleFinish = useCallback(async () => {
    if (!user) return;
    if (!activeWorkout) return;
    if (activeWorkout.exercises.length === 0) {
      Alert.alert(t('common.error'), t('workouts.noExercisesInWorkout'));
      return;
    }

    setSaving(true);
    try {
      const workout = finishWorkout();
      if (!workout) return;

      const completedSets = workout.exercises.reduce(
        (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
        0,
      );

      await saveWorkout(user.uid, {
        title: workout.title,
        startedAt: Timestamp.fromDate(workout.startedAt),
        completedAt: Timestamp.now(),
        durationSeconds: elapsedTime,
        status: 'completed',
        totalVolume,
        exercises: workout.exercises,
        notes: '',
        createdBy: user.uid,
      });

      router.replace({
        pathname: '/modals/workout-complete',
        params: {
          title: workout.title,
          duration: String(elapsedTime),
          volume: String(Math.round(totalVolume)),
          exercises: String(workout.exercises.length),
          sets: String(completedSets),
        },
      });
    } catch (err) {
      console.error('Failed to save workout', err);
      Alert.alert(t('common.error'), t('profile.failedToSave'));
    } finally {
      setSaving(false);
    }
  }, [user, activeWorkout, t, finishWorkout, elapsedTime, totalVolume, router]);

  const handleCancel = useCallback(() => {
    Alert.alert(t('workouts.cancelWorkout'), t('workouts.progressLost'), [
      { text: t('workouts.keep'), style: 'cancel' },
      {
        text: t('common.cancel'),
        style: 'destructive',
        onPress: () => {
          cancelWorkout();
          router.replace('/(tabs)/workouts');
        },
      },
    ]);
  }, [t, cancelWorkout, router]);

  const handleAddExercise = useCallback(() => {
    router.push('/(tabs)/workouts/exercise-picker');
  }, [router]);

  const handleSkipRest = useCallback(() => setRestActive(false), []);
  const handleFinishRest = useCallback(() => setRestActive(false), []);
  const handleAddRestTime = useCallback(
    (delta: number) => setRestSeconds((prev) => Math.max(5, prev + delta)),
    [],
  );

  if (!activeWorkout) return null;

  return (
    <SafeAreaView className="flex-1 bg-dark-50">
      <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-dark-100">
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="close" size={24} color="#334155" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-lg font-bold text-dark-900">{activeWorkout.title}</Text>
          <Text className="text-sm text-primary-500" style={{ fontVariant: ['tabular-nums'] }}>
            {formattedElapsed}
          </Text>
        </View>
        <TouchableOpacity onPress={handleFinish} disabled={saving}>
          <Text className="text-primary-500 font-semibold">{t('workouts.finish')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName={`p-5 ${restActive ? 'pb-48' : 'pb-24'}`}>
        <View className="flex-row gap-3 mb-5">
          <Card className="flex-1 items-center">
            <Text className="text-2xl font-bold text-dark-900">
              {activeWorkout.exercises.length}
            </Text>
            <Text className="text-xs text-dark-400">{t('workouts.exercises')}</Text>
          </Card>
          <Card className="flex-1 items-center">
            <Text className="text-2xl font-bold text-primary-500">{Math.round(totalVolume)}</Text>
            <Text className="text-xs text-dark-400">{t('workouts.volume')}</Text>
          </Card>
        </View>

        {activeWorkout.exercises.length === 0 ? (
          <View className="py-12">
            <EmptyState
              icon="barbell-outline"
              title={t('workouts.noExercisesYet')}
              description={t('workouts.addFirstExercise')}
            />
          </View>
        ) : (
          activeWorkout.exercises.map((exercise, exIndex) => {
            const displayName = getExerciseName(exercise.exerciseName, locale);
            const category = exercise.category || 'strength';
            return (
              <ExerciseCard
                key={exercise.exerciseId + exIndex}
                exercise={exercise}
                displayName={displayName}
                muscleLabel={translateMuscle(exercise.muscleGroup)}
                category={category}
                onRemoveExercise={removeExercise}
                onUpdateSet={updateSet}
                onCompleteSet={handleCompleteSet}
                onAddSet={addSet}
              />
            );
          })
        )}

        <Button
          title={t('workouts.addExercise')}
          onPress={handleAddExercise}
          variant="outline"
          fullWidth
        />
      </ScrollView>

      {restActive && (
        <RestTimer
          seconds={restSeconds}
          onSkip={handleSkipRest}
          onFinish={handleFinishRest}
          onAddTime={handleAddRestTime}
        />
      )}
    </SafeAreaView>
  );
}
