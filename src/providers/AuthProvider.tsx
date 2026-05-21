import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuthState } from '@/src/lib/firebase/auth';
import { getUserDoc, ensureUserDoc } from '@/src/lib/firebase/firestore';
import { UserDocument } from '@/src/types/user';

interface AuthContextType {
  user: User | null;
  profile: (UserDocument & { id: string }) | null;
  loading: boolean;
  isOnboarded: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isOnboarded: false,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<(UserDocument & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      const doc = await getUserDoc(user.uid);
      setProfile(doc);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        let doc = await getUserDoc(firebaseUser.uid);
        // Auto-create missing profile doc (e.g. if sign-up partially failed)
        if (!doc) {
          try {
            await ensureUserDoc(firebaseUser.uid, {
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              photoURL: firebaseUser.photoURL,
            });
            doc = await getUserDoc(firebaseUser.uid);
          } catch (err) {
            console.error('Failed to ensure user doc:', err);
          }
        }
        setProfile(doc);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isOnboarded = profile?.onboardingComplete ?? false;

  return (
    <AuthContext.Provider value={{ user, profile, loading, isOnboarded, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
