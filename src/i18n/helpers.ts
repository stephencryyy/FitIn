import { i18n } from './index';

/**
 * Convert English muscle name (as stored in exercises) to translation key.
 */
function muscleKey(muscle: string): string {
  return muscle.toLowerCase().replace(/\s+/g, '_');
}

/**
 * Convert English equipment name to translation key.
 */
function equipmentKey(equipment: string): string {
  return equipment.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
}

/**
 * Translate a muscle group using current locale.
 * Falls back to original English if translation missing.
 */
export function translateMuscle(muscle: string): string {
  const key = `muscles.${muscleKey(muscle)}`;
  const translated = i18n.t(key);
  if (!translated || translated === key || translated.startsWith('[missing')) {
    return muscle;
  }
  return translated;
}

/**
 * Translate equipment using current locale.
 */
export function translateEquipment(equipment: string): string {
  const key = `equipment.${equipmentKey(equipment)}`;
  const translated = i18n.t(key);
  if (!translated || translated === key || translated.startsWith('[missing')) {
    return equipment;
  }
  return translated;
}
