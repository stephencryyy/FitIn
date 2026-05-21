import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = { sm: 32, md: 40, lg: 56, xl: 80 };
const TEXT_SIZES = { sm: 'text-xs', md: 'text-sm', lg: 'text-lg', xl: 'text-2xl' };

export function Avatar({ uri, name, size = 'md' }: AvatarProps) {
  const px = SIZES[size];
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  if (uri) {
    return (
      <Image
        source={uri}
        style={{ width: px, height: px, borderRadius: px / 2 }}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View
      className="bg-primary-100 items-center justify-center"
      style={{ width: px, height: px, borderRadius: px / 2 }}
    >
      <Text className={`font-bold text-primary-600 ${TEXT_SIZES[size]}`}>{initials}</Text>
    </View>
  );
}
