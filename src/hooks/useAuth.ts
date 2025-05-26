
import { useState, useEffect } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = storage.getUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login - in real app, this would use Supabase
    if (email && password) {
      const newUser: User = {
        id: '1',
        email,
        language: 'fr',
        currency: 'USD'
      };
      storage.setUser(newUser);
      setUser(newUser);
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, currency: 'USD' | 'CDF' | 'EUR'): Promise<boolean> => {
    // Simulate registration - in real app, this would use Supabase
    if (email && password) {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        language: 'fr',
        currency
      };
      storage.setUser(newUser);
      setUser(newUser);
      return true;
    }
    return false;
  };

  const updateUserConfig = (language: 'fr' | 'en' | 'sw', currency: 'USD' | 'CDF' | 'EUR') => {
    if (user) {
      const updatedUser = { ...user, language, currency };
      storage.setUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const logout = () => {
    storage.clearUser();
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUserConfig
  };
};
