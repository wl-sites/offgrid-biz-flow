
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser } from '../types';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          // Fetch user profile from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              language: profile.language as 'fr' | 'en' | 'sw',
              currency: profile.currency as 'USD' | 'CDF' | 'EUR'
            });
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email,
                language: profile.language as 'fr' | 'en' | 'sw',
                currency: profile.currency as 'USD' | 'CDF' | 'EUR'
              });
            }
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, currency: 'USD' | 'CDF' | 'EUR' = 'USD') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          currency,
          language: 'fr' as 'fr' | 'en' | 'sw'
        }
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateUserConfig = async (language: 'fr' | 'en' | 'sw', currency: 'USD' | 'CDF' | 'EUR') => {
    if (!user) return { error: 'No user logged in' };
    
    const { error } = await supabase
      .from('profiles')
      .update({ language, currency })
      .eq('id', user.id);
    
    if (!error) {
      setUser({ ...user, language, currency });
    }
    
    return { error };
  };

  return {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateUserConfig
  };
};
