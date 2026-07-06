import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi } from '@/lib/api';

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setAuth: (user: User, token: string) => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(email, password);
          const token = response.data?.data?.access_token;
          const user  = response.data?.data?.user as User;
          if (!token) throw new Error('No se recibió token del servidor');
          if (typeof window !== 'undefined') {
            localStorage.setItem('cc360_token', token);
          }
          // Set cookie BEFORE updating state so middleware sees it on next navigation
          setCookie('cc360_token', token, 7);
          set({ token, user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cc360_token');
          localStorage.removeItem('cc360_refresh');
        }
        removeCookie('cc360_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') localStorage.setItem('cc360_token', token);
        setCookie('cc360_token', token, 7);
        set({ user, token, isAuthenticated: true });
      },

      fetchMe: async () => {
        try {
          const response = await authApi.me();
          const user = (response.data?.data ?? response.data) as User;
          if (user?.id) {
            set({ user, isAuthenticated: true });
          }
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'cc360-auth',
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated, user: state.user }),
    }
  )
);
