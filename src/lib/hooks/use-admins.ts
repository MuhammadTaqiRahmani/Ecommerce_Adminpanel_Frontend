'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminsApi } from '@/lib/api/admins';
import { CreateAdminRequest, UpdateAdminRequest } from '@/types/admin';
import { PaginationParams } from '@/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';

export const adminKeys = {
  all: ['admins'] as const,
  lists: () => [...adminKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...adminKeys.lists(), params] as const,
  details: () => [...adminKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminKeys.details(), id] as const,
};

export function useAdmins(params?: PaginationParams) {
  return useQuery({
    queryKey: adminKeys.list(params || {}),
    queryFn: () => adminsApi.getAll(params),
  });
}

export function useAdmin(id: string) {
  return useQuery({
    queryKey: adminKeys.detail(id),
    queryFn: () => adminsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminRequest) => adminsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      toast.success('Admin created successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminRequest }) =>
      adminsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminKeys.detail(variables.id) });
      toast.success('Admin updated successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      toast.success('Admin deleted successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
