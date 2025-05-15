import axios from 'axios';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse extends AuthTokens {
  user: User;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

// Create axios instance
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.165:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth store
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
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
    }
  },
  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post<AuthResponse>('/auth/register', data);
      console.log(response.data, 'response.data');
      if (response.data.success) {
        console.log('Registration successful');
        await AsyncStorage.setItem(
          'tokens',
          JSON.stringify({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          })
        );
      } else {
        throw new Error('Registration failed');
        console.log('Registration failed');
      }

      set({
        user: response.data.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false,
      });
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

// Places API
export const fetchPlaces = async () => {
  const { data } = await api.get('/location');
  console.log(data, '.......');
  return data;
};

export const fetchPlace = async (id: string) => {
  const { data } = await api.get(`/places/${id}`);
  return data;
};

// Posts API
export const fetchPosts = async () => {
  const { data } = await api.get('/activity');
  return data;
};

export const fetchTour = async () => {
  const { data } = await api.get('/tour');
  return data;
};

export const createPost = async (postData: {
  content: string;
  location?: string;
  images?: string[];
}) => {
  const { data } = await api.post('/posts', postData);
  return data;
};

export const likePost = async (postId: string) => {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data;
};

export const unlikePost = async (postId: string) => {
  const { data } = await api.delete(`/posts/${postId}/like`);
  return data;
};

// Hosts API
export const fetchHosts = async () => {
  const { data } = await api.get('/user/all');
  return data;
};

export const fetchHost = async (id: string) => {
  const { data } = await api.get(`/hosts/${id}`);
  return data;
};

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
        const tokens = await AsyncStorage.getItem('tokens');
        if (!tokens) throw new Error('No refresh token');

        const { refreshToken } = JSON.parse(tokens) as AuthTokens;
        const { data } = await api.post<AuthTokens>('/auth/refresh-token', {
          refreshToken,
        });

        await AsyncStorage.setItem(
          'tokens',
          JSON.stringify({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
        );

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
