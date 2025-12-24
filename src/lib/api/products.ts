import apiClient from './client';
import {
  Product,
  ProductStats,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateStockRequest,
  ProductFilters,
} from '@/types/product';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export interface ProductQueryParams extends PaginationParams, ProductFilters {}

export const productsApi = {
  // List products
  getAll: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  // Get product by ID
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  getBySlug: async (slug: string): Promise<ApiResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/slug/${slug}`);
    return response.data;
  },

  // Get product statistics
  getStats: async (): Promise<ApiResponse<ProductStats>> => {
    const response = await apiClient.get<ApiResponse<ProductStats>>('/products/stats');
    return response.data;
  },

  // Create product
  create: async (data: CreateProductRequest): Promise<ApiResponse<Product>> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data);
    return response.data;
  },

  // Update product
  update: async (id: string, data: UpdateProductRequest): Promise<ApiResponse<Product>> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data;
  },

  // Update stock
  updateStock: async (id: string, data: UpdateStockRequest): Promise<ApiResponse<Product>> => {
    const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/stock`, data);
    return response.data;
  },

  // Delete product
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/products/${id}`);
    return response.data;
  },
};

export default productsApi;
