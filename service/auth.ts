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
  message: string;
  data: {
    accessToken: string;
    user: {
      email: string;
      id: number;
      refresh: string;
      role: string | null;
    };
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
      if (!tokens) return null;

      const parsedTokens = JSON.parse(tokens);
      // Validate tokens before returning
      if (!parsedTokens.accessToken || !parsedTokens.refreshToken) {
        console.error('Invalid tokens in storage');
        await this.clearTokens();
        return null;
      }
      return parsedTokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  },

  async setTokens(tokens: AuthTokens): Promise<void> {
    try {
      // Validate tokens before storing
      if (!tokens.accessToken || !tokens.refreshToken) {
        throw new Error(
          'Invalid tokens: both accessToken and refreshToken are required'
        );
      }
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
      if (
        !responseData.success ||
        !responseData.data.accessToken ||
        !responseData.data.user?.refresh
      ) {
        throw new Error('Invalid token refresh response');
      }

      const newTokens = {
        accessToken: responseData.data.accessToken,
        refreshToken: responseData.data.user.refresh,
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
        refreshError.message === 'No refresh token available' ||
        refreshError.message === 'Invalid token refresh response'
      ) {
        // Handle invalid token response
      }
      refreshQueue.process(refreshError, null);
      await tokenManager.clearTokens();
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

  setTokens: (tokens: AuthTokens) => {
    if (!tokens?.accessToken || !tokens?.refreshToken) {
      console.error(
        'Invalid tokens: both accessToken and refreshToken are required'
      );
      return;
    }
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

      // Validate tokens
      if (!tokens?.accessToken || !tokens?.refreshToken) {
        throw new Error(
          'Invalid tokens: both accessToken and refreshToken are required'
        );
      }

      // Store tokens
      await tokenManager.setTokens(tokens);

      try {
        console.log(
          'Attempting token refresh with token:',
          tokens.refreshToken
        );

        const response = await api.post(REFRESH_ENDPOINT, {
          refreshToken: tokens.refreshToken,
        });

        console.log(
          'Raw token refresh response:',
          JSON.stringify(response.data, null, 2)
        );

        // First check if response.data exists and is an object
        if (!response.data || typeof response.data !== 'object') {
          console.error('Invalid response data:', response.data);
          throw new Error('Invalid token refresh response structure');
        }

        const responseData = response.data as TokenRefreshResponse;
        console.log(
          'Parsed response data:',
          JSON.stringify(responseData, null, 2)
        );

        // Check if response has success flag
        if (!responseData.success) {
          console.error('Token refresh failed:', responseData.message);
          throw new Error(
            responseData.message || 'Token refresh request failed'
          );
        }

        // Check if response has data object
        if (!responseData.data || typeof responseData.data !== 'object') {
          console.error('Invalid response data structure:', responseData);
          throw new Error('Invalid token refresh response data');
        }

        // Check if both tokens are present
        if (
          !responseData.data.accessToken ||
          !responseData.data.user?.refresh
        ) {
          console.error('Missing tokens in response data:', responseData.data);
          throw new Error('Missing tokens in refresh response');
        }

        const newTokens = {
          accessToken: responseData.data.accessToken,
          refreshToken: responseData.data.user.refresh,
        };

        console.log('New tokens received:', {
          accessToken: newTokens.accessToken.substring(0, 10) + '...',
          refreshToken: newTokens.refreshToken.substring(0, 10) + '...',
        });

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
      } catch (error) {
        console.warn('Token validation failed:', error);
        // If validation fails, still try to use the provided tokens
        if (tokens.accessToken && tokens.refreshToken) {
          console.log('Using provided tokens after validation failure');
          set({
            isAuthenticated: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isLoading: false,
            error: null,
          });
          return;
        }
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

      if (
        !response.data.success ||
        !response.data.data.accessToken ||
        !response.data.data.refreshToken
      ) {
        throw new Error('Invalid login response: missing tokens');
      }

      const tokens = {
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      };

      // Store tokens first
      await tokenManager.setTokens(tokens);

      // Then update state
      set({
        user: response.data.data.user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Clear tokens on error
      await tokenManager.clearTokens();
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

      if (
        !response.data.success ||
        !response.data.data.accessToken ||
        !response.data.data.refreshToken
      ) {
        throw new Error('Invalid registration response: missing tokens');
      }

      const tokens = {
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      };

      // Store tokens but don't set authentication state yet
      await tokenManager.setTokens(tokens);

      // Only set loading state to false
      set({
        isLoading: false,
        error: null,
      });

      return tokens;
    } catch (error) {
      // Clear tokens on error
      await tokenManager.clearTokens();
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

      // Validate tokens before using
      if (!token.accessToken || !token.refreshToken) {
        throw new Error(
          'Invalid tokens: both accessToken and refreshToken are required'
        );
      }

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

      // Store both tokens
      await tokenManager.setTokens(token);

      // Set authentication state after successful setup
      set({
        user: response.data.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, data: response.data };
    } catch (error) {
      // Clear tokens on error
      await tokenManager.clearTokens();
      set({
        error:
          error instanceof Error ? error.message : 'Failed to update profile',
        isLoading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Clear tokens first
      await tokenManager.clearTokens();

      // Then update state
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({
        error: 'Failed to logout',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default api;
