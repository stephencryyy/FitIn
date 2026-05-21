import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/src/components/ui/Button';
import { useT } from '@/src/hooks/useT';

const PREFERENCES = [
  'none',
  'vegetarian',
  'vegan',
  'gluten_free',
  'lactose_free',
  'keto',
  'paleo',
  'halal',
  'kosher',
  'low_carb',
  'high_protein',
];

const LABELS_EN: Record<string, string> = {
  none: 'No restrictions',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  gluten_free: 'Gluten-free',
  lactose_free: 'Lactose-free',
  keto: 'Keto',
  paleo: 'Paleo',
  halal: 'Halal',
  kosher: 'Kosher',
  low_carb: 'Low-carb',
  high_protein: 'High-protein',
};

const LABELS_RU: Record<string, string> = {
  none: 'Без ограничений',
  vegetarian: 'Вегетарианец',
  vegan: 'Веган',
  gluten_free: 'Без глютена',
  lactose_free: 'Без лактозы',
  keto: 'Кето',
  paleo: 'Палео',
  halal: 'Халяль',
  kosher: 'Кошер',
  low_carb: 'Мало углеводов',
  high_protein: 'Много белка',
};

export default function DietaryPreferences() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const t = useT();
  const [selected, setSelected] = useState<string[]>([]);

  // Pick labels based on current locale via t() result of a known key
  const isRu = t('common.cancel') === 'Отмена';
  const labels = isRu ? LABELS_RU : LABELS_EN;

  const toggle = (pref: string) => {
    if (pref === 'none') {
      setSelected(['none']);
      return;
    }
    setSelected((prev) => {
      const without = prev.filter((p) => p !== 'none');
      return without.includes(pref) ? without.filter((p) => p !== pref) : [...without, pref];
    });
  };

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/summary',
      params: { ...params, dietary: selected.join(',') },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="px-6 py-8 flex-grow">
        <Text className="text-2xl font-bold text-dark-900 mb-2">
          {t('onboarding.dietaryPreferences')}
        </Text>
        <Text className="text-dark-400 mb-6">{t('onboarding.selectAll')}</Text>

        <View className="flex-row flex-wrap gap-3 mb-8">
          {PREFERENCES.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => toggle(p)}
              className={`px-4 py-2.5 rounded-full border-2 ${
                selected.includes(p) ? 'border-primary-500 bg-primary-50' : 'border-dark-200'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selected.includes(p) ? 'text-primary-600' : 'text-dark-600'
                }`}
              >
                {labels[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-1 min-h-[20px]" />

        <Button
          title={t('common.continue')}
          onPress={handleNext}
          disabled={selected.length === 0}
          fullWidth
          size="lg"
        />
        <View className="flex-row justify-center mt-4 gap-1.5">
          <View className="w-8 h-1.5 rounded-full bg-primary-500" />
          <View className="w-8 h-1.5 rounded-full bg-primary-500" />
          <View className="w-8 h-1.5 rounded-full bg-primary-500" />
          <View className="w-8 h-1.5 rounded-full bg-primary-500" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
