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
        const re_tokens = await AsyncStorage.getItem('tokens');
        console.log(tokens);
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
    try {
      await logout();
      await AsyncStorage.removeItem('tokens');
      router.replace('/welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      await login(credentials);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleRegister = async (data: {
    email: string;
    password: string;
    name: string;
    type: string;
  }) => {
    try {
      const tokens = await register(data);
      if (tokens) {
        await AsyncStorage.setItem('tokens', JSON.stringify(tokens));
        return tokens;
      }
      return null;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return {
    user,
    isLoading,
    error,
    setup,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError,
  };
}
