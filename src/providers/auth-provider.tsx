'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore, selectIsHydrated } from '@/store/auth-store';
import { setTokenHandlers } from '@/lib/api/client';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const isHydrated = useAuthStore(selectIsHydrated);

  useEffect(() => {
    // Initialize token handlers after hydration
    setTokenHandlers({
      getToken: () => useAuthStore.getState().token,
      getRefreshToken: () => useAuthStore.getState().refreshToken,
      setTokens: (token, refreshToken) => useAuthStore.getState().setTokens(token, refreshToken),
      clearAuth: () => useAuthStore.getState().logout(),
    });
  }, []);

  // Show nothing while hydrating to prevent flash
  if (!isHydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
