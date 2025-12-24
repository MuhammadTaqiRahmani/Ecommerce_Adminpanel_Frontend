'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, OrderQueryParams } from '@/lib/api/orders';
import {
  CreateOrderRequest,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
  AddOrderItemRequest,
  UpdateOrderItemRequest,
} from '@/types/order';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: OrderQueryParams) => [...orderKeys.lists(), params] as const,
  recent: (limit?: number) => [...orderKeys.all, 'recent', limit] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  history: (id: string) => [...orderKeys.all, 'history', id] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
};

export function useOrders(params?: OrderQueryParams) {
  return useQuery({
    queryKey: orderKeys.list(params || {}),
    queryFn: () => ordersApi.getAll(params),
  });
}

export function useRecentOrders(limit?: number) {
  return useQuery({
    queryKey: orderKeys.recent(limit),
    queryFn: () => ordersApi.getRecent(limit),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

export function useOrderHistory(id: string) {
  return useQuery({
    queryKey: orderKeys.history(id),
    queryFn: () => ordersApi.getHistory(id),
    enabled: !!id,
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: () => ordersApi.getStats(),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
      toast.success('Order created successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderRequest }) =>
      ordersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      toast.success('Order updated successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusRequest }) =>
      ordersApi.updateStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.history(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
      toast.success('Order status updated successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
      toast.success('Order deleted successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

// Order items hooks
export function useAddOrderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: AddOrderItemRequest }) =>
      ordersApi.addItem(orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      toast.success('Item added to order');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateOrderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      itemId,
      data,
    }: {
      orderId: string;
      itemId: string;
      data: UpdateOrderItemRequest;
    }) => ordersApi.updateItem(orderId, itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      toast.success('Order item updated');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteOrderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: string; itemId: string }) =>
      ordersApi.deleteItem(orderId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      toast.success('Item removed from order');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useCustomerOrders(customerId: string, params?: { limit?: number }) {
  return useQuery({
    queryKey: [...orderKeys.all, 'customer', customerId, params],
    queryFn: () => ordersApi.getAll({ customer_id: customerId, limit: params?.limit }),
    enabled: !!customerId,
  });
}
