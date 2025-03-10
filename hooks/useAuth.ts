import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Default credentials
const DEFAULT_EMAIL = 'demo@example.com';
const DEFAULT_PASSWORD = 'password123';

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  login: (email: string, password: string) => {
    if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false }),
}));