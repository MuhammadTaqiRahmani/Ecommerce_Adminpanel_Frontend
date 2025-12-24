'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api/auth';
import { LoginRequest, ChangePasswordRequest, UpdateProfileRequest } from '@/types/auth';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';

export function useAuth() {
  const router = useRouter();
  const {
    token,
    admin,
    isAuthenticated,
    isLoading,
    setAuth,
    logout: clearAuth,
  } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (response) => {
      if (response.success && response.data) {
        const { token, refresh_token, admin } = response.data;
        setAuth(token, refresh_token, admin);
        toast.success('Login successful!');
        // Small delay to ensure cookies are set before navigation
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push('/dashboard');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Password changed successfully!');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });

  // Logout function
  const logout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return {
    token,
    admin,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    changePassword: changePasswordMutation.mutate,
    changePasswordAsync: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    logout,
  };
}

// Update Profile Hook
export function useUpdateProfile() {
  const { setAdmin, admin } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authApi.updateProfile(data),
    onSuccess: (response) => {
      if (response.success && response.data && admin) {
        setAdmin({ ...admin, ...response.data });
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

// Change Password Hook (standalone)
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
