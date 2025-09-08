import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '@/lib/authService';
import { DbService, UserDocument } from '@/lib/dbService';

export interface AuthState {
  user: User | null;
  userDoc: UserDocument | null;
  loading: boolean;
  emailVerified: boolean;
  hasOnboarded: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        // Get user document from Firestore
        try {
          const doc = await DbService.getUser(user.uid);
          setUserDoc(doc);
        } catch (error) {
          console.error('Failed to get user document:', error);
          setUserDoc(null);
        }
      } else {
        setUserDoc(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const emailVerified = user?.emailVerified || false;
  const hasOnboarded = userDoc?.hasOnboarded || false;

  return {
    user,
    userDoc,
    loading,
    emailVerified,
    hasOnboarded
  };
}