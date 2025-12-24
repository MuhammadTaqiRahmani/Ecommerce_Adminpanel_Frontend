import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Admin } from '@/types/admin';
import { setTokenHandlers } from '@/lib/api/client';

// Cookie-based storage for SSR compatibility
const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof document === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  },
  removeItem: (name: string): void => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  },
};

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
}

interface AuthActions {
  setAuth: (token: string, refreshToken: string, admin: Admin) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setAdmin: (admin: Admin) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      token: null,
      refreshToken: null,
      admin: null,
      isAuthenticated: false,
      isLoading: true,
      isHydrated: false,

      // Actions
      setAuth: (token, refreshToken, admin) => {
        set({
          token,
          refreshToken,
          admin,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setTokens: (token, refreshToken) => {
        set({ token, refreshToken });
      },

      setAdmin: (admin) => {
        set({ admin });
      },

      logout: () => {
        set({
          token: null,
          refreshToken: null,
          admin: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          state.setLoading(false);
        }
      },
    }
  )
);

// Initialize token handlers for API client
if (typeof window !== 'undefined') {
  setTokenHandlers({
    getToken: () => useAuthStore.getState().token,
    getRefreshToken: () => useAuthStore.getState().refreshToken,
    setTokens: (token, refreshToken) => useAuthStore.getState().setTokens(token, refreshToken),
    clearAuth: () => useAuthStore.getState().logout(),
  });
}

// Selectors
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectAdmin = (state: AuthStore) => state.admin;
export const selectToken = (state: AuthStore) => state.token;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectIsHydrated = (state: AuthStore) => state.isHydrated;
