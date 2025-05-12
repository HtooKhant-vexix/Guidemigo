import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { create } from 'zustand';

// Types
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  type: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    type: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create axios instance
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<AuthTokens> | null = null;

// Auth store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  initializeAuth: async (tokens: AuthTokens) => {
    try {
      set({ isLoading: true });
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });

      set({
        user: response.data,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post('/auth/login', credentials);

      await AsyncStorage.setItem(
        'tokens',
        JSON.stringify({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );

      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to login',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Registerstart');
      const response = await api.post('/auth/register', data);
      console.log('Register response:', response.data.data.user);

      if (!response.data.success) {
        throw new Error('Registration failed');
      }
      // Uncomment the following lines to store tokens in AsyncStorage

      await AsyncStorage.setItem(
        'tokens',
        JSON.stringify({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );

      set({
        user: response?.data?.data?.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        isLoading: false,
      });

      // router.replace({
      //   pathname: '/account-setup',
      //   params: { id: response.data.data.user.id },
      // });
      console.log('Register implemented yet');
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false,
      });
      console.error('Register error:', error.message);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('tokens');
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  clearError: () => set({ error: null }),
}));

// Axios interceptors
api.interceptors.request.use(
  async (config) => {
    const tokens = await AsyncStorage.getItem('tokens');
    if (tokens) {
      const { accessToken } = JSON.parse(tokens) as AuthTokens;
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          const tokens = await AsyncStorage.getItem('tokens');
          if (!tokens) throw new Error('No refresh token');

          const { refreshToken } = JSON.parse(tokens) as AuthTokens;
          refreshPromise = api
            .post<AuthTokens>('/auth/refresh', { refreshToken })
            .then((response) => response.data)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newTokens = await refreshPromise;
        await AsyncStorage.setItem('tokens', JSON.stringify(newTokens));

        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
