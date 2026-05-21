import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase/config';

interface UsernameInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onValidityChange?: (valid: boolean) => void;
  currentUserId?: string;
  errorText?: string;
}

export function UsernameInput({
  label,
  value,
  onChangeText,
  onValidityChange,
  currentUserId,
  errorText,
}: UsernameInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (text: string) => {
    // Only lowercase letters, numbers, underscore
    const clean = text.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20);
    onChangeText(clean);
  };

  useEffect(() => {
    if (!value) {
      setAvailable(null);
      setError(null);
      onValidityChange?.(false);
      return;
    }
    if (value.length < 3) {
      setAvailable(null);
      setError('min 3 characters');
      onValidityChange?.(false);
      return;
    }

    setChecking(true);
    setError(null);
    const timer = setTimeout(async () => {
      try {
        const snap = await getDoc(doc(db, 'usernames', value));
        if (snap.exists() && snap.data().userId !== currentUserId) {
          setAvailable(false);
          setError('already taken');
          onValidityChange?.(false);
        } else {
          setAvailable(true);
          onValidityChange?.(true);
        }
      } catch (err) {
        setError('check failed');
        onValidityChange?.(false);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, currentUserId]);

  const showError = errorText || error;
  const showSuccess = available === true && !showError;

  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-medium text-dark-700 mb-1.5">{label}</Text>}
      <View
        className={`flex-row items-center bg-dark-50 rounded-xl border-2 px-4 ${
          showError
            ? 'border-danger-500'
            : showSuccess
              ? 'border-success-500'
              : isFocused
                ? 'border-primary-500'
                : 'border-dark-200'
        }`}
      >
        <Text className="text-dark-400 text-base mr-1">@</Text>
        <TextInput
          className="flex-1 py-3 text-base text-dark-900"
          placeholder="username"
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={handleChange}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={20}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {checking ? (
          <ActivityIndicator size="small" color="#94A3B8" />
        ) : showSuccess ? (
          <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
        ) : showError && value.length >= 3 ? (
          <Ionicons name="close-circle" size={20} color="#EF4444" />
        ) : null}
      </View>
      {showError && value.length > 0 && (
        <Text className="text-sm text-danger-500 mt-1">{errorText || error}</Text>
      )}
    </View>
  );
}
