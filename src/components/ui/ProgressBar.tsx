import React from 'react';
import { View, Text } from 'react-native';

interface ProgressBarProps {
  progress: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
  height?: number;
  tall?: boolean;
  accessibilityLabel?: string;
}

function ProgressBarImpl({
  progress,
  color = 'bg-primary-500',
  label,
  showPercentage = false,
  height,
  tall = false,
  accessibilityLabel,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const barHeight = height ?? (tall ? 14 : 10);
  const percent = Math.round(clampedProgress * 100);

  return (
    <View className="w-full">
      {(label || showPercentage) && (
        <View className="flex-row justify-between mb-1.5">
          {label && <Text className="text-sm font-semibold text-dark-400">{label}</Text>}
          {showPercentage && (
            <Text className="text-sm font-extrabold text-dark-900">
              {percent}%
            </Text>
          )}
        </View>
      )}
      <View
        className="w-full bg-dark-100 overflow-hidden"
        style={{ height: barHeight, borderRadius: 999 }}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel ?? label ?? 'Progress'}
        accessibilityValue={{ min: 0, max: 100, now: percent }}
      >
        <View
          className={`h-full ${color}`}
          style={{ width: `${clampedProgress * 100}%`, borderRadius: 999 }}
        />
      </View>
    </View>
  );
}

export const ProgressBar = React.memo(ProgressBarImpl);
