import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Card } from '@/src/components/ui/Card';
import { WorkoutDocument } from '@/src/types/workout';
import { format } from 'date-fns';

interface ProgressChartProps {
  workouts: WorkoutDocument[];
  metric?: 'volume' | 'count';
}

export function ProgressChart({ workouts, metric = 'volume' }: ProgressChartProps) {
  const screenWidth = Dimensions.get('window').width;

  if (workouts.length === 0) {
    return (
      <Card>
        <Text className="text-center text-dark-400 py-4">No data yet</Text>
      </Card>
    );
  }

  // Take last 10 workouts, reverse to chronological order
  const sorted = [...workouts]
    .slice(0, 10)
    .reverse();

  const data = sorted.map((w, i) => {
    const date = w.startedAt?.toDate?.() || new Date();
    const value = metric === 'volume' ? Math.round(w.totalVolume) : w.exercises.length;
    return {
      value,
      label: i % 2 === 0 ? format(date, 'M/d') : '',
      dataPointText: String(value),
    };
  });

  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <Card>
      <Text className="text-sm font-semibold text-dark-700 mb-3">
        {metric === 'volume' ? 'Volume Progression (kg)' : 'Exercises per Workout'}
      </Text>
      <LineChart
        data={data}
        width={screenWidth - 80}
        height={180}
        initialSpacing={10}
        spacing={Math.max(30, (screenWidth - 120) / Math.max(data.length - 1, 1))}
        color="#3B82F6"
        thickness={3}
        curved
        dataPointsColor="#3B82F6"
        dataPointsRadius={5}
        hideYAxisText={false}
        yAxisTextStyle={{ color: '#94A3B8', fontSize: 10 }}
        xAxisLabelTextStyle={{ color: '#94A3B8', fontSize: 10 }}
        yAxisColor="#E2E8F0"
        xAxisColor="#E2E8F0"
        maxValue={Math.ceil(maxVal * 1.2)}
        noOfSections={4}
        startFillColor="#3B82F6"
        startOpacity={0.2}
        endFillColor="#3B82F6"
        endOpacity={0.01}
        areaChart
      />
    </Card>
  );
}
