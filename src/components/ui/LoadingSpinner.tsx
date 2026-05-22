import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  accessibilityLabel?: string;
}

function LoadingSpinnerImpl({ message, fullScreen = false, accessibilityLabel }: LoadingSpinnerProps) {
  return (
    <View
      className={`items-center justify-center ${fullScreen ? 'flex-1' : 'py-8'}`}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? message ?? 'Loading'}
    >
      <ActivityIndicator size="large" color="#3B82F6" />
      {message && (
        <Text className="text-dark-400 text-sm mt-3">{message}</Text>
      )}
    </View>
  );
}

export const LoadingSpinner = React.memo(LoadingSpinnerImpl);
