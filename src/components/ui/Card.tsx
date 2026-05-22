import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type CardVariant = 'default' | 'peach' | 'green' | 'dark' | 'glass' | 'blue';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  padded?: boolean;
  variant?: CardVariant;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const GRADIENT_COLORS: Record<string, [string, string, string]> = {
  peach: ['#fff1ec', '#ffffff', '#fff7f4'],
  green: ['#eaf8f5', '#ffffff', '#f2fffc'],
  dark: ['#16263d', '#243e67', '#2c5387'],
  blue: ['#eef2ff', '#ffffff', '#f7fbff'],
};

function CardImpl({
  children,
  onPress,
  className = '',
  padded = true,
  variant = 'default',
  accessibilityLabel,
  accessibilityHint,
}: CardProps) {
  const paddingClass = padded ? 'p-5' : '';
  const baseClasses = `rounded-3xl overflow-hidden ${paddingClass} ${className}`;

  const pressableA11y = onPress
    ? {
        accessibilityRole: 'button' as const,
        accessibilityLabel,
        accessibilityHint,
      }
    : {};

  if (variant !== 'default' && variant !== 'glass') {
    const colors = GRADIENT_COLORS[variant];
    const content = (
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`${baseClasses} border border-dark-200`}
        style={{ borderWidth: variant === 'dark' ? 0 : 1, borderColor: '#d8e3ee' }}
      >
        {children}
      </LinearGradient>
    );

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} {...pressableA11y}>
          {content}
        </TouchableOpacity>
      );
    }
    return content;
  }

  const defaultClasses =
    variant === 'glass'
      ? `${baseClasses} bg-white/70 border border-dark-200`
      : `${baseClasses} bg-white border border-dark-200`;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={defaultClasses}
        style={{ shadowColor: '#183558', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 28, elevation: 4 }}
        {...pressableA11y}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      className={defaultClasses}
      style={{ shadowColor: '#183558', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 28, elevation: 4 }}
    >
      {children}
    </View>
  );
}

export const Card = React.memo(CardImpl);
