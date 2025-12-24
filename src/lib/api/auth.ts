import apiClient from './client';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '@/types/auth';
import { Admin } from '@/types/admin';
import { ApiResponse } from '@/types/api';

export const authApi = {
  // Login
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },

  // Refresh token
  refreshToken: async (data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', data);
    return response.data;
  },

  // Get current profile
  getProfile: async (): Promise<ApiResponse<Admin>> => {
    const response = await apiClient.get<ApiResponse<Admin>>('/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<Admin>> => {
    const response = await apiClient.put<ApiResponse<Admin>>('/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>('/profile/password', data);
    return response.data;
  },
};

export default authApi;
