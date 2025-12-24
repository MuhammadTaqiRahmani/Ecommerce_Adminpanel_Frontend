import apiClient from './client';
import {
  Customer,
  CustomerStats,
  Address,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  UpdateCustomerStatusRequest,
  CreateAddressRequest,
  UpdateAddressRequest,
  CustomerFilters,
} from '@/types/customer';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export interface CustomerQueryParams extends PaginationParams, CustomerFilters {}

export const customersApi = {
  // List customers
  getAll: async (params?: CustomerQueryParams): Promise<PaginatedResponse<Customer>> => {
    const response = await apiClient.get<PaginatedResponse<Customer>>('/customers', { params });
    return response.data;
  },

  // Get customer by ID
  getById: async (id: string): Promise<ApiResponse<Customer>> => {
    const response = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data;
  },

  // Get customer statistics
  getStats: async (): Promise<ApiResponse<CustomerStats>> => {
    const response = await apiClient.get<ApiResponse<CustomerStats>>('/customers/stats');
    return response.data;
  },

  // Create customer
  create: async (data: CreateCustomerRequest): Promise<ApiResponse<Customer>> => {
    const response = await apiClient.post<ApiResponse<Customer>>('/customers', data);
    return response.data;
  },

  // Update customer
  update: async (id: string, data: UpdateCustomerRequest): Promise<ApiResponse<Customer>> => {
    const response = await apiClient.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return response.data;
  },

  // Update customer status
  updateStatus: async (id: string, data: UpdateCustomerStatusRequest): Promise<ApiResponse<Customer>> => {
    const response = await apiClient.patch<ApiResponse<Customer>>(`/customers/${id}/status`, data);
    return response.data;
  },

  // Delete customer
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/customers/${id}`);
    return response.data;
  },

  // --- Address endpoints ---

  // Get customer addresses
  getAddresses: async (customerId: string): Promise<ApiResponse<Address[]>> => {
    const response = await apiClient.get<ApiResponse<Address[]>>(`/customers/${customerId}/addresses`);
    return response.data;
  },

  // Create address
  createAddress: async (customerId: string, data: CreateAddressRequest): Promise<ApiResponse<Address>> => {
    const response = await apiClient.post<ApiResponse<Address>>(`/customers/${customerId}/addresses`, data);
    return response.data;
  },

  // Update address
  updateAddress: async (
    customerId: string,
    addressId: string,
    data: UpdateAddressRequest
  ): Promise<ApiResponse<Address>> => {
    const response = await apiClient.put<ApiResponse<Address>>(
      `/customers/${customerId}/addresses/${addressId}`,
      data
    );
    return response.data;
  },

  // Delete address
  deleteAddress: async (customerId: string, addressId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/customers/${customerId}/addresses/${addressId}`
    );
    return response.data;
  },
};

export default customersApi;
