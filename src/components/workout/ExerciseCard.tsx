import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { SetRow, SetHeader } from '@/src/components/workout/SetRow';
import { ExerciseCategory, ExerciseSet, WorkoutExercise } from '@/src/types/workout';
import { useT } from '@/src/hooks/useT';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  displayName: string;
  muscleLabel: string;
  category: ExerciseCategory;
  onRemoveExercise: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, setIndex: number, data: Partial<ExerciseSet>) => void;
  onCompleteSet: (exerciseId: string, setIndex: number) => void;
  onAddSet: (exerciseId: string) => void;
}

interface SetRowItemProps {
  set: ExerciseSet;
  category: ExerciseCategory;
  exerciseId: string;
  setIndex: number;
  onUpdateSet: (exerciseId: string, setIndex: number, data: Partial<ExerciseSet>) => void;
  onCompleteSet: (exerciseId: string, setIndex: number) => void;
}

/**
 * Stable per-set wrapper: closes over (exerciseId, setIndex) so that
 * SetRow receives the same handler references between renders as long as
 * those identifiers don't change.
 */
const SetRowItem = memo(function SetRowItem({
  set,
  category,
  exerciseId,
  setIndex,
  onUpdateSet,
  onCompleteSet,
}: SetRowItemProps) {
  const handleUpdate = useCallback(
    (data: Partial<ExerciseSet>) => onUpdateSet(exerciseId, setIndex, data),
    [onUpdateSet, exerciseId, setIndex],
  );

  const handleComplete = useCallback(
    () => onCompleteSet(exerciseId, setIndex),
    [onCompleteSet, exerciseId, setIndex],
  );

  return (
    <SetRow
      set={set}
      category={category}
      onUpdate={handleUpdate}
      onComplete={handleComplete}
    />
  );
});

/**
 * Per-exercise card. Memoized so that text input in one exercise/set
 * doesn't cascade rerenders to sibling exercise cards.
 */
export const ExerciseCard = memo(function ExerciseCard({
  exercise,
  displayName,
  muscleLabel,
  category,
  onRemoveExercise,
  onUpdateSet,
  onCompleteSet,
  onAddSet,
}: ExerciseCardProps) {
  const t = useT();

  const handleRemove = useCallback(
    () => onRemoveExercise(exercise.exerciseId),
    [onRemoveExercise, exercise.exerciseId],
  );

  const handleAddSet = useCallback(
    () => onAddSet(exercise.exerciseId),
    [onAddSet, exercise.exerciseId],
  );

  return (
    <Card className="mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="font-bold text-dark-900 text-base">{displayName}</Text>
          <Text className="text-xs text-dark-400">{muscleLabel}</Text>
        </View>
        <TouchableOpacity onPress={handleRemove}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <SetHeader category={category} />

      {exercise.sets.map((set, setIndex) => (
        <SetRowItem
          key={setIndex}
          set={set}
          category={category}
          exerciseId={exercise.exerciseId}
          setIndex={setIndex}
          onUpdateSet={onUpdateSet}
          onCompleteSet={onCompleteSet}
        />
      ))}

      <TouchableOpacity
        onPress={handleAddSet}
        className="mt-3 py-2 bg-primary-50 rounded-lg items-center"
      >
        <Text className="text-primary-600 font-semibold">{t('workouts.addSet')}</Text>
      </TouchableOpacity>
    </Card>
  );
});
