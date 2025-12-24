import apiClient from './client';
import { Admin, CreateAdminRequest, UpdateAdminRequest } from '@/types/admin';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export const adminsApi = {
  // List all admins
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Admin>> => {
    const response = await apiClient.get<PaginatedResponse<Admin>>('/admins', { params });
    return response.data;
  },

  // Get admin by ID
  getById: async (id: string): Promise<ApiResponse<Admin>> => {
    const response = await apiClient.get<ApiResponse<Admin>>(`/admins/${id}`);
    return response.data;
  },

  // Create admin
  create: async (data: CreateAdminRequest): Promise<ApiResponse<Admin>> => {
    const response = await apiClient.post<ApiResponse<Admin>>('/admins', data);
    return response.data;
  },

  // Update admin
  update: async (id: string, data: UpdateAdminRequest): Promise<ApiResponse<Admin>> => {
    const response = await apiClient.put<ApiResponse<Admin>>(`/admins/${id}`, data);
    return response.data;
  },

  // Delete admin
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/admins/${id}`);
    return response.data;
  },
};

export default adminsApi;
