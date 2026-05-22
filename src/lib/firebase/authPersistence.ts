import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Storage adapter for Firebase Auth that backs the session token with
 * `expo-secure-store` (Keychain on iOS, EncryptedSharedPreferences on
 * Android) instead of plain AsyncStorage.
 *
 * Migration: when SecureStore returns null but AsyncStorage has a value,
 * we copy it across once and then clear the plaintext copy. This keeps
 * existing signed-in users from being kicked out by the migration.
 *
 * Fallback: if SecureStore is unavailable (very old Android, simulator
 * without keychain entitlements) or a write fails (e.g., payload size),
 * we transparently fall back to AsyncStorage so the user is never
 * locked out — better to have a slightly less-protected session than
 * no session at all. The fallback path is logged so we can spot it.
 */

let secureStoreAvailable: boolean | null = null;

async function probeSecureStore(): Promise<boolean> {
  if (secureStoreAvailable !== null) return secureStoreAvailable;
  try {
    secureStoreAvailable = await SecureStore.isAvailableAsync();
  } catch {
    secureStoreAvailable = false;
  }
  return secureStoreAvailable;
}

/**
 * SecureStore only accepts keys that match `[A-Za-z0-9._-]`. Firebase
 * uses keys like `firebase:authUser:<apiKey>:[DEFAULT]` with colons and
 * brackets, so we hash them into a safe form.
 */
function safeKey(key: string): string {
  return key.replace(/[^A-Za-z0-9._-]/g, '_');
}

export const secureAuthPersistence = {
  async getItem(key: string): Promise<string | null> {
    const safe = safeKey(key);
    if (await probeSecureStore()) {
      try {
        const fromSecure = await SecureStore.getItemAsync(safe);
        if (fromSecure !== null) return fromSecure;

        // One-time migration: legacy session in AsyncStorage → SecureStore.
        const fromAsync = await AsyncStorage.getItem(key);
        if (fromAsync !== null) {
          try {
            await SecureStore.setItemAsync(safe, fromAsync);
            await AsyncStorage.removeItem(key);
          } catch {
            // Migration failed (e.g. value too large) — keep AsyncStorage copy.
          }
          return fromAsync;
        }
        return null;
      } catch {
        // Read failure — fall through to AsyncStorage.
      }
    }
    return AsyncStorage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    const safe = safeKey(key);
    if (await probeSecureStore()) {
      try {
        await SecureStore.setItemAsync(safe, value);
        return;
      } catch (err) {
        // Probably the iOS keychain payload limit. Degrade gracefully.
        // eslint-disable-next-line no-console
        console.warn('[auth] SecureStore.setItemAsync failed, falling back to AsyncStorage', err);
      }
    }
    await AsyncStorage.setItem(key, value);
  },

  async removeItem(key: string): Promise<void> {
    const safe = safeKey(key);
    if (await probeSecureStore()) {
      try {
        await SecureStore.deleteItemAsync(safe);
      } catch {
        // ignore — also remove from AsyncStorage just in case.
      }
    }
    await AsyncStorage.removeItem(key);
  },
};
