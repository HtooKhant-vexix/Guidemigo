import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { create } from 'zustand';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  role?: string | null;
}

interface AuthResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  success: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  initializeAuth: (tokens: AuthTokens) => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    type: string;
  }) => Promise<AuthTokens | null>;
  logout: () => Promise<void>;
  clearError: () => void;
  setup: (data: any, token: AuthTokens) => Promise<any>;
}

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  initializeAuth: async (tokens: AuthTokens) => {
    try {
      set({ isLoading: true });
      const response = await api.post<AuthResponse>(
        '/auth/refresh-token',
        { refreshToken: tokens.refreshToken },
        { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
      );

      if (response.data.success) {
        await AsyncStorage.setItem('tokens', JSON.stringify(tokens));
        set({
          user: response.data.data.user,
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isLoading: false,
        });
      } else {
        throw new Error('Failed to initialize auth');
      }
    } catch (error) {
      set({ isLoading: false });
      await AsyncStorage.removeItem('tokens');
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);

      if (data.success) {
        const tokens = {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        };

        await AsyncStorage.setItem('tokens', JSON.stringify(tokens));
        set({
          user: data.data.user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error('Login failed');
      }
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
      const response = await api.post<AuthResponse>('/auth/register', data);

      if (response.data.success) {
        const tokens = {
          accessToken: response.data.data.accessToken,
          refreshToken: response.data.data.refreshToken,
        };

        await AsyncStorage.setItem('tokens', JSON.stringify(tokens));
        set({ isLoading: false });
        return tokens;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false,
      });
      return null;
    }
  },

  setup: async (data, token) => {
    try {
      set({ isLoading: true, error: null });
      const formData = new FormData();
      formData.append('id', data.id);
      formData.append('name', data.name);
      formData.append('bio', data.bio);
      formData.append('dob', data.dob);
      formData.append('gender', data.gender);
      formData.append('location', data.location);
      formData.append('phonenumber', data.phonenumber);
      formData.append('type', data.type);
      formData.append('experience', data.experience || '');
      formData.append('travellers', data.travellers.toString());

      if (Array.isArray(data.languages)) {
        data.languages.forEach((language: string) => {
          formData.append('languages[]', language);
        });
      }

      if (Array.isArray(data.expertise)) {
        data.expertise.forEach((expertise: string) => {
          formData.append('expertise[]', expertise);
        });
      }

      const response = await axios.patch(
        `/user/profile/update?id=${Number(data.id)}`,
        formData,
        {
          baseURL:
            process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.165:3000',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );

      await AsyncStorage.setItem('tokens', JSON.stringify(token));
      set({
        user: response.data.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to update profile',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('tokens');
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({ error: 'Failed to logout' });
    }
  },

  clearError: () => set({ error: null }),
}));

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const tokens = await AsyncStorage.getItem('tokens');
    if (tokens) {
      const { accessToken } = JSON.parse(tokens) as AuthTokens;
      if (config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = await AsyncStorage.getItem('tokens');
        if (!tokens) throw new Error('No refresh token available');

        const { refreshToken } = JSON.parse(tokens) as AuthTokens;
        const { data } = await api.post<AuthResponse>('/auth/refresh-token', {
          refreshToken,
        });

        if (data.success) {
          const newTokens = {
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          };

          await AsyncStorage.setItem('tokens', JSON.stringify(newTokens));
          processQueue(null, newTokens.accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          }
          return api(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
