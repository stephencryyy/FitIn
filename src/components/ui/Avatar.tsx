import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  accessibilityLabel?: string;
}

const SIZES = { sm: 32, md: 40, lg: 56, xl: 80 };
const TEXT_SIZES = { sm: 'text-xs', md: 'text-sm', lg: 'text-lg', xl: 'text-2xl' };

function AvatarImpl({ uri, name, size = 'md', accessibilityLabel }: AvatarProps) {
  const px = SIZES[size];
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const label = accessibilityLabel ?? (name ? `Avatar of ${name}` : 'User avatar');

  if (uri) {
    return (
      <Image
        source={uri}
        style={{ width: px, height: px, borderRadius: px / 2 }}
        contentFit="cover"
        transition={200}
        accessible
        accessibilityLabel={label}
        accessibilityRole="image"
      />
    );
  }

  return (
    <View
      className="bg-primary-100 items-center justify-center"
      style={{ width: px, height: px, borderRadius: px / 2 }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
    >
      <Text className={`font-bold text-primary-600 ${TEXT_SIZES[size]}`}>{initials}</Text>
    </View>
  );
}

export const Avatar = React.memo(AvatarImpl);
