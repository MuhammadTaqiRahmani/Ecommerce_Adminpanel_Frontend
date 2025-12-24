import apiClient from './client';
import { ApiResponse } from '@/types/api';

export interface DashboardStats {
  total_orders: number;
  pending_orders: number;
  total_products: number;
  low_stock_products: number;
  total_customers: number;
  new_customers: number;
  total_revenue: number;
  revenue_this_month: number;
}

export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  },
};

export default dashboardApi;
