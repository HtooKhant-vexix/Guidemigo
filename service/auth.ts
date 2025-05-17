import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
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

interface AuthState {
  user: User | null | undefined;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean; // Added this property
  initializeAuth: (tokens: AuthTokens) => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    type: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setup: any;
}

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<AuthTokens> | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  initializeAuth: async (tokens: AuthTokens) => {
    try {
      set({ isLoading: true });
      // const response = await api.get('/auth/refresh-token', {
      //   headers: { Authorization: `Bearer ${tokens.accessToken}` },
      // });

      // console.log('init..............................');

      const response = await api.post(
        '/auth/refresh-token',
        {
          refreshToken: tokens.refreshToken,
        },
        {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        }
      );

      // console.log(
      //   response.data.data.user,
      //   'response...........................'
      // );

      set({
        user: response.data.data.user,
        isAuthenticated: true,
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
      // console.log(data.data.accessToken);
      // console.log(data.data.refreshToken);
      // console.log(data.data.user);
      await AsyncStorage.setItem(
        'tokens',
        JSON.stringify({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        })
      );

      set({
        user: data.data.user,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
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
      const response = await api.post('/auth/register', data);

      // await AsyncStorage.setItem(
      //   'tokens',
      //   JSON.stringify({
      //     accessToken: response.data.data.accessToken,
      //     refreshToken: response.data.data.refreshToken,
      //   })
      // );

      set({
        isLoading: false,
      });
      return {
        user: response.data.data.user.id,
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      };
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false,
      });
      throw error;
    }
  },

  setup: async (data, token) => {
    try {
      set({ isLoading: true, error: null });
      // console.log(
      //   Number(data.id),
      //   token,
      //   `/user/profile/update?id=${Number(data.id)}`,
      //   'data.....gg......................'
      // );

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
      data.languages.forEach((language) =>
        formData.append('languages[]', language)
      );
      data.expertise?.forEach((expertise) =>
        formData.append('expertise[]', expertise)
      );

      // console.log('FormData:', formData);

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
      // console.log(response, 'response...........................');

      await AsyncStorage.setItem(
        'tokens',
        JSON.stringify({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        })
      );

      set({
        user: response.data.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false,
      });
      // console.log(error, 'error...........................');
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
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  clearError: () => set({ error: null }),
}));

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
            .post<AuthTokens>('/auth/refresh-token', { refreshToken })
            .then((response) => response.data)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newTokens = await refreshPromise;
        // console.log(newTokens, '.......................................');
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
