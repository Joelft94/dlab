import { create } from 'zustand';
import * as authService from '@/services/auth';
import type { User } from '@/types/api';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? (Cookies.get('token') || localStorage.getItem('token')) : null,
  isLoading: false,
  error: null,
  isAuthenticated: typeof window !== 'undefined' ? !!(Cookies.get('token') || localStorage.getItem('token')) : false,
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(username, password);
      
      set({ 
        user: response.user, 
        token: response.token, 
        isLoading: false,
        isAuthenticated: true,
        error: null
      });

      // Force a page reload to ensure middleware picks up the new cookie
      window.location.href = '/dashboard/users';
      
    } catch (error: any) {
      console.error("Login error in hook:", error);
      set({ 
        error: error.response?.data?.message || 'Invalid credentials', 
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },
  logout: () => {
    authService.logout();
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      error: null
    });
    window.location.href = '/login';
  },
}));