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

// Enhanced types for better type safety
interface TokenRefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

interface QueuedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
  config: any;
}

// Constants for better maintainability
const TOKEN_STORAGE_KEY = 'tokens';
const REFRESH_ENDPOINT = '/auth/refresh-token';
const MAX_RETRIES = 1;

// Enhanced queue management
class TokenRefreshQueue {
  private queue: QueuedRequest[] = [];
  private isRefreshing: boolean = false;

  add(request: QueuedRequest) {
    this.queue.push(request);
  }

  clear() {
    this.queue = [];
  }

  process(error: any = null, token: string | null = null) {
    this.queue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        resolve(api(config));
      }
    });
    this.clear();
  }

  setRefreshing(status: boolean) {
    this.isRefreshing = status;
  }

  getRefreshing() {
    return this.isRefreshing;
  }
}

const refreshQueue = new TokenRefreshQueue();

// Enhanced token management
const tokenManager = {
  async getTokens(): Promise<AuthTokens | null> {
    try {
      const tokens = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  },

  async setTokens(tokens: AuthTokens): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Error setting tokens:', error);
      throw error;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  },
};

// Enhanced request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const tokens = await tokenManager.getTokens();
      if (tokens?.accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor with better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle non-401 errors or already retried requests
    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Handle token refresh
    if (refreshQueue.getRefreshing()) {
      return new Promise((resolve, reject) => {
        refreshQueue.add({ resolve, reject, config: originalRequest });
      });
    }

    originalRequest._retry = true;
    refreshQueue.setRefreshing(true);

    try {
      const tokens = await tokenManager.getTokens();
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const { data } = await api.post<TokenRefreshResponse>(REFRESH_ENDPOINT, {
        refreshToken: tokens.refreshToken,
      });

      if (!data.success) {
        throw new Error('Token refresh failed');
      }

      const newTokens = {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };

      await tokenManager.setTokens(newTokens);
      refreshQueue.process(null, newTokens.accessToken);

      // Update the original request with new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      refreshQueue.process(refreshError, null);
      await useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      refreshQueue.setRefreshing(false);
    }
  }
);

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
      await tokenManager.setTokens(tokens);
      const response = await api.post<AuthResponse>(
        REFRESH_ENDPOINT,
        { refreshToken: tokens.refreshToken },
        { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
      );

      if (response.data.success) {
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
      await tokenManager.clearTokens();
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

        await tokenManager.setTokens(tokens);
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
      await tokenManager.clearTokens();
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

export default api;
