import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

function ButtonImpl({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const sizeClasses = { sm: 'px-3 py-2.5', md: 'px-5 py-3.5', lg: 'px-6 py-4' };
  const textSizeClasses = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50' : '';

  const renderContent = (textColor: string) => (
    <>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          {title ? (
            <Text style={{ color: textColor }} className={`font-extrabold ${textSizeClasses[size]}`}>
              {title}
            </Text>
          ) : null}
        </View>
      )}
    </>
  );

  const a11y = {
    accessibilityRole: 'button' as const,
    accessibilityLabel: accessibilityLabel ?? (title || undefined),
    accessibilityHint,
    accessibilityState: { disabled: disabled || loading, busy: loading },
  };

  // Primary: gradient orange button with shadow
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        className={`${widthClass} ${disabledClass}`}
        style={{
          shadowColor: '#ff6b3d',
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.26,
          shadowRadius: 28,
          elevation: 8,
        }}
        {...a11y}
      >
        <LinearGradient
          colors={['#ff815e', '#ff6b3d', '#ff8d62']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`flex-row items-center justify-center rounded-xl ${sizeClasses[size]}`}
        >
          {renderContent('#ffffff')}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles: Record<string, { bg: string; textColor: string; border?: string }> = {
    secondary: { bg: 'bg-dark-100', textColor: '#122033' },
    outline: { bg: 'bg-transparent', textColor: '#ff6b3d', border: 'border border-dark-200' },
    ghost: { bg: 'bg-transparent', textColor: '#607085', border: 'border border-dark-200' },
    danger: { bg: 'bg-danger-500', textColor: '#ffffff' },
  };

  const style = variantStyles[variant] || variantStyles.secondary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center rounded-xl ${sizeClasses[size]} ${style.bg} ${style.border || ''} ${widthClass} ${disabledClass}`}
      activeOpacity={0.7}
      {...a11y}
    >
      {renderContent(style.textColor)}
    </TouchableOpacity>
  );
}

export const Button = React.memo(ButtonImpl);
