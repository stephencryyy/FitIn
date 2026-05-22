import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
}

function EmptyStateImpl({ icon, title, description, actionTitle, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12" accessible>
      <View
        className="w-20 h-20 rounded-full bg-primary-50 items-center justify-center mb-4"
        accessible={false}
      >
        <Ionicons name={icon} size={36} color="#3B82F6" />
      </View>
      <Text
        className="text-xl font-bold text-dark-900 text-center mb-2"
        accessibilityRole="header"
      >
        {title}
      </Text>
      <Text className="text-base text-dark-400 text-center mb-6">{description}</Text>
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} accessibilityLabel={actionTitle} />
      )}
    </View>
  );
}

export const EmptyState = React.memo(EmptyStateImpl);
