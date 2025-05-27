
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { User } from '../types';

export const useUserConfig = (userId: string | undefined) => {
  const [userConfig, setUserConfig] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setUserConfig(null);
      setIsLoading(false);
      return;
    }

    const loadUserConfig = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserConfig(userDoc.data() as User);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserConfig();
  }, [userId]);

  const updateUserConfig = async (language: 'fr' | 'en' | 'sw', currency: 'USD' | 'CDF' | 'EUR', email: string) => {
    if (!userId) return;

    const newConfig: User = {
      id: userId,
      email,
      language,
      currency
    };

    try {
      await setDoc(doc(db, 'users', userId), newConfig);
      setUserConfig(newConfig);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la configuration:', error);
    }
  };

  return {
    userConfig,
    isLoading,
    updateUserConfig
  };
};
