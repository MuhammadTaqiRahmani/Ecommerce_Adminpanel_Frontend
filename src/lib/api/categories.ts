import apiClient from './client';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryFilters,
} from '@/types/category';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export interface CategoryQueryParams extends PaginationParams, CategoryFilters {}

export const categoriesApi = {
  // List categories
  getAll: async (params?: CategoryQueryParams): Promise<PaginatedResponse<Category>> => {
    const response = await apiClient.get<PaginatedResponse<Category>>('/categories', { params });
    return response.data;
  },

  // Get category tree
  getTree: async (): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories/tree');
    return response.data;
  },

  // Get category by ID
  getById: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  getBySlug: async (slug: string): Promise<ApiResponse<Category>> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/slug/${slug}`);
    return response.data;
  },

  // Create category
  create: async (data: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
    return response.data;
  },

  // Update category
  update: async (id: string, data: UpdateCategoryRequest): Promise<ApiResponse<Category>> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/categories/${id}`);
    return response.data;
  },
};

export default categoriesApi;
