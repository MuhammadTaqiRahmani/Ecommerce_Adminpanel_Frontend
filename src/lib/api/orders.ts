import apiClient from './client';
import {
  Order,
  OrderStats,
  OrderStatusHistory,
  CreateOrderRequest,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
  AddOrderItemRequest,
  UpdateOrderItemRequest,
  OrderItem,
  OrderFilters,
} from '@/types/order';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export interface OrderQueryParams extends PaginationParams, OrderFilters {}

export const ordersApi = {
  // List orders
  getAll: async (params?: OrderQueryParams): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>('/orders', { params });
    return response.data;
  },

  // Get order by ID
  getById: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  // Get order statistics
  getStats: async (): Promise<ApiResponse<OrderStats>> => {
    const response = await apiClient.get<ApiResponse<OrderStats>>('/orders/stats');
    return response.data;
  },

  // Get recent orders
  getRecent: async (limit?: number): Promise<ApiResponse<Order[]>> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders/recent', {
      params: { limit },
    });
    return response.data;
  },

  // Get order status history
  getHistory: async (id: string): Promise<ApiResponse<OrderStatusHistory[]>> => {
    const response = await apiClient.get<ApiResponse<OrderStatusHistory[]>>(`/orders/${id}/history`);
    return response.data;
  },

  // Create order
  create: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
    return response.data;
  },

  // Update order
  update: async (id: string, data: UpdateOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await apiClient.put<ApiResponse<Order>>(`/orders/${id}`, data);
    return response.data;
  },

  // Update order status
  updateStatus: async (id: string, data: UpdateOrderStatusRequest): Promise<ApiResponse<Order>> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, data);
    return response.data;
  },

  // Delete order
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/orders/${id}`);
    return response.data;
  },

  // --- Order items ---

  // Add item to order
  addItem: async (orderId: string, data: AddOrderItemRequest): Promise<ApiResponse<OrderItem>> => {
    const response = await apiClient.post<ApiResponse<OrderItem>>(`/orders/${orderId}/items`, data);
    return response.data;
  },

  // Update order item
  updateItem: async (
    orderId: string,
    itemId: string,
    data: UpdateOrderItemRequest
  ): Promise<ApiResponse<OrderItem>> => {
    const response = await apiClient.put<ApiResponse<OrderItem>>(
      `/orders/${orderId}/items/${itemId}`,
      data
    );
    return response.data;
  },

  // Delete order item
  deleteItem: async (orderId: string, itemId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/orders/${orderId}/items/${itemId}`);
    return response.data;
  },
};

export default ordersApi;
