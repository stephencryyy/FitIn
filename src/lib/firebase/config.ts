import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  // @ts-expect-error — getReactNativePersistence is exported at runtime but
  // omitted from firebase/auth's public types (issue: firebase-js-sdk#7615).
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { secureAuthPersistence } from './authPersistence';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

let auth: Auth;
if (Platform.OS === 'web') {
  // On web, Firebase uses browser storage (IndexedDB/localStorage) automatically.
  auth = getAuth(app);
} else {
  try {
    // On native, persist auth tokens in OS-level secure storage (Keychain /
    // EncryptedSharedPreferences) instead of plain AsyncStorage.
    // See src/lib/firebase/authPersistence.ts for fallback + migration logic.
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(secureAuthPersistence),
    });
  } catch {
    // Already initialized (fast-refresh, multi-instance) — reuse.
    auth = getAuth(app);
  }
}

export { auth };
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app;
