import { Admin } from './admin';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
  expires_in: number;
  admin: Admin;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  token: string;
  refresh_token: string;
  expires_in: number;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
