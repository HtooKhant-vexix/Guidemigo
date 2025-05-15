import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../service/auth';
import { router, useSegments } from 'expo-router';

export function useAuth() {
  const {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    setup,
    clearError,
    initializeAuth,
    isAuthenticated,
  } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const tokens = await AsyncStorage.getItem('tokens');
        if (tokens) {
          const parsedTokens = JSON.parse(tokens);
          await initializeAuth(parsedTokens);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await AsyncStorage.removeItem('tokens');
      }
    };

    initAuth();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/welcome');
  };

  return {
    user,
    isLoading,
    error,
    setup,
    isAuthenticated: !!user,
    login,
    register,
    logout: handleLogout,
    clearError,
  };
}
