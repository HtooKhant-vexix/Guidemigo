import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../service/api';
import { router } from 'expo-router';

export function useAuth() {
  const { user, isLoading, error, login, register, logout, clearError } =
    useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const tokens = await AsyncStorage.getItem('tokens');
        if (!tokens) return;

        // Validate token and get user data
        // This would typically make an API call to verify the token
        // and fetch the latest user data
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

// import { create } from 'zustand';

// interface AuthState {
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => boolean;
//   logout: () => void;
// }

// // Default credentials
// const DEFAULT_EMAIL = 'demo@example.com';
// const DEFAULT_PASSWORD = 'password123';

// export const useAuth = create<AuthState>((set) => ({
//   isAuthenticated: false,
//   isLoading: false,
//   login: (email: string, password: string) => {
//     if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
//       set({ isAuthenticated: true });
//       return true;
//     }
//     return false;
//   },
//   logout: () => set({ isAuthenticated: false }),
// }));
