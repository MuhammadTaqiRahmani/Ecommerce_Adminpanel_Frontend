'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi, CustomerQueryParams } from '@/lib/api/customers';
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
  UpdateCustomerStatusRequest,
  CreateAddressRequest,
  UpdateAddressRequest,
} from '@/types/customer';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params: CustomerQueryParams) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  addresses: (customerId: string) => [...customerKeys.all, 'addresses', customerId] as const,
  stats: () => [...customerKeys.all, 'stats'] as const,
};

export function useCustomers(params?: CustomerQueryParams) {
  return useQuery({
    queryKey: customerKeys.list(params || {}),
    queryFn: () => customersApi.getAll(params),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customersApi.getById(id),
    enabled: !!id,
  });
}

export function useCustomerStats() {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: () => customersApi.getStats(),
  });
}

export function useCustomerAddresses(customerId: string) {
  return useQuery({
    queryKey: customerKeys.addresses(customerId),
    queryFn: () => customersApi.getAddresses(customerId),
    enabled: !!customerId,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => customersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
      toast.success('Customer created successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) =>
      customersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
      toast.success('Customer updated successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateCustomerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerStatusRequest }) =>
      customersApi.updateStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
      toast.success('Customer status updated');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
      toast.success('Customer deleted successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

// Address hooks
export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: CreateAddressRequest }) =>
      customersApi.createAddress(customerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.addresses(variables.customerId) });
      toast.success('Address added successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      addressId,
      data,
    }: {
      customerId: string;
      addressId: string;
      data: UpdateAddressRequest;
    }) => customersApi.updateAddress(customerId, addressId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.addresses(variables.customerId) });
      toast.success('Address updated successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, addressId }: { customerId: string; addressId: string }) =>
      customersApi.deleteAddress(customerId, addressId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.addresses(variables.customerId) });
      toast.success('Address deleted successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
