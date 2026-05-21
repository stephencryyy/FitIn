import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInput['props']['keyboardType'];
  autoCapitalize?: TextInput['props']['autoCapitalize'];
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  icon,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-dark-700 mb-1.5">{label}</Text>
      )}
      <View
        className={`flex-row items-center bg-dark-50 rounded-xl border-2 px-4 ${
          error
            ? 'border-danger-500'
            : isFocused
              ? 'border-primary-500'
              : 'border-dark-200'
        }`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? '#EF4444' : isFocused ? '#3B82F6' : '#94A3B8'}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          className="flex-1 py-3 text-base text-dark-900"
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#94A3B8"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-sm text-danger-500 mt-1">{error}</Text>
      )}
    </View>
  );
}
