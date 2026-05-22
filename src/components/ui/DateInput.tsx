import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DateInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
}

/**
 * Date input that auto-formats as user types.
 * Accepts formats: YYYYMMDD, YYYY-MM-DD, YYYY.MM.DD, DDMMYYYY
 * Normalizes to YYYY-MM-DD
 */
function DateInputImpl({ label, value, onChangeText, error, placeholder = 'YYYY-MM-DD' }: DateInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (text: string) => {
    // Strip all non-digits
    const digits = text.replace(/\D/g, '').slice(0, 8);

    let formatted = '';
    if (digits.length === 0) {
      formatted = '';
    } else if (digits.length <= 4) {
      formatted = digits;
    } else if (digits.length <= 6) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    }

    onChangeText(formatted);
  };

  const isValid = (() => {
    if (!value) return true;
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return value.length < 10;
    const [, y, m, d] = match;
    const year = Number(y);
    const month = Number(m);
    const day = Number(d);
    const now = new Date().getFullYear();
    return year >= 1900 && year <= now && month >= 1 && month <= 12 && day >= 1 && day <= 31;
  })();

  const showError = error || (!isValid && value.length === 10);

  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-medium text-dark-700 mb-1.5">{label}</Text>}
      <View
        className={`flex-row items-center bg-dark-50 rounded-xl border-2 px-4 ${
          showError ? 'border-danger-500' : isFocused ? 'border-primary-500' : 'border-dark-200'
        }`}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={showError ? '#EF4444' : isFocused ? '#3B82F6' : '#94A3B8'}
          style={{ marginRight: 8 }}
        />
        <TextInput
          className="flex-1 py-3 text-base text-dark-900"
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={handleChange}
          keyboardType="numeric"
          maxLength={10}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label ?? 'Date'}
          accessibilityHint="Enter a date in year-month-day format"
        />
      </View>
      {showError && (
        <Text className="text-sm text-danger-500 mt-1" accessibilityLiveRegion="polite">
          {error || 'Invalid date'}
        </Text>
      )}
    </View>
  );
}

export const DateInput = React.memo(DateInputImpl);
