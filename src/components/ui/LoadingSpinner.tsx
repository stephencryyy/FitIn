import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message, fullScreen = false }: LoadingSpinnerProps) {
  return (
    <View className={`items-center justify-center ${fullScreen ? 'flex-1' : 'py-8'}`}>
      <ActivityIndicator size="large" color="#3B82F6" />
      {message && (
        <Text className="text-dark-400 text-sm mt-3">{message}</Text>
      )}
    </View>
  );
}
