import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
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
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: User) => void;
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
  async (config: InternalAxiosRequestConfig) => {
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

    // Check if it's an axios error and has a response
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // Handle non-401 errors or already retried requests
    if (error.response.status !== 401 || originalRequest._retry) {
      // If we get a 403 (Forbidden) or other auth errors, logout
      if (error.response.status === 403) {
        await tokenManager.clearTokens();
        await useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }

    // Don't retry refresh token requests to avoid infinite loops
    if (originalRequest.url === REFRESH_ENDPOINT) {
      // Only logout if refresh token is expired (usually indicated by 401)
      if (error.response.status === 401) {
        await tokenManager.clearTokens();
        await useAuthStore.getState().logout();
      }
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
        // If no refresh token, clear everything and redirect to login
        await tokenManager.clearTokens();
        await useAuthStore.getState().logout();
        throw new Error('No refresh token available');
      }

      // Make sure we don't use the expired token for the refresh request
      delete originalRequest.headers?.Authorization;

      const response = await api.post(REFRESH_ENDPOINT, {
        refreshToken: tokens.refreshToken,
      });

      const responseData = response.data as TokenRefreshResponse;
      if (!responseData.success) {
        throw new Error('Token refresh failed');
      }

      const newTokens = {
        accessToken: responseData.data.accessToken,
        refreshToken: responseData.data.refreshToken,
      };

      // Update tokens in storage first
      await tokenManager.setTokens(newTokens);

      // Update the store with new tokens and user data
      useAuthStore.getState().setTokens(newTokens);
      useAuthStore.getState().setUser(responseData.data.user);

      // Process queued requests with new token
      refreshQueue.process(null, newTokens.accessToken);

      // Update the original request with new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      }

      // Retry the original request with new token
      const retryResponse = await api(originalRequest);
      return retryResponse;
    } catch (refreshError: any) {
      // Only logout if the refresh token is expired (401)
      if (
        refreshError.response?.status === 401 ||
        refreshError.message === 'No refresh token available'
      ) {
        refreshQueue.process(refreshError, null);
        await tokenManager.clearTokens();
        await useAuthStore.getState().logout();
      } else {
        // For other errors, just reject the request
        refreshQueue.process(refreshError, null);
      }
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

  setTokens: (tokens: AuthTokens) => {
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isAuthenticated: true,
    });
  },

  setUser: (user: User) => {
    set({ user });
  },

  initializeAuth: async (tokens: AuthTokens) => {
    try {
      set({ isLoading: true, error: null });

      // Check if we have any tokens to work with
      if (!tokens) {
        throw new Error('No tokens provided');
      }

      // Store whatever tokens we have
      await tokenManager.setTokens(tokens);

      // Only attempt validation if we have a refresh token
      if (tokens.refreshToken) {
        try {
          const response = await api.post(REFRESH_ENDPOINT, {
            refreshToken: tokens.refreshToken,
          });

          const responseData = response.data as TokenRefreshResponse;
          if (responseData.success) {
            const newTokens = {
              accessToken: responseData.data.accessToken,
              refreshToken: responseData.data.refreshToken,
            };

            // Update storage with new tokens
            await tokenManager.setTokens(newTokens);

            // Update state with validated tokens and user
            set({
              user: responseData.data.user,
              isAuthenticated: true,
              accessToken: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
              isLoading: false,
              error: null,
            });
            return;
          }
        } catch (error) {
          console.warn('Token validation failed:', error);
          // Don't throw here, fall through to use existing tokens
        }
      }

      // If we have an access token but validation failed or wasn't attempted,
      // still set the state with what we have
      if (tokens.accessToken) {
        set({
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isLoading: false,
          error: null,
        });
        return;
      }

      // If we get here, we have no valid tokens
      await tokenManager.clearTokens();
      throw new Error('No valid tokens available');
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to initialize auth',
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
      });
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post<AuthResponse>('/auth/login', credentials);

      if (response.data.success) {
        const tokens = {
          accessToken: response.data.data.accessToken,
          refreshToken: response.data.data.refreshToken,
        };

        await tokenManager.setTokens(tokens);
        set({
          user: response.data.data.user,
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
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
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

        await tokenManager.setTokens(tokens);
        set({
          user: response.data.data.user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
        return tokens;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
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
