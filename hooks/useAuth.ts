import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../service/auth';
import { router } from 'expo-router';

export function useAuth() {
  const { user, isLoading, error, login, register, logout, clearError } =
    useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const tokens = await AsyncStorage.getItem('tokens');
        if (!tokens) return;

        // Here you would typically validate the token and get user data
        // For now, we'll just check if tokens exist
      } catch (error) {
        console.error('Auth initialization error:', error);
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
    isAuthenticated: !!user,
    login,
    register,
    logout: handleLogout,
    clearError,
  };
}
