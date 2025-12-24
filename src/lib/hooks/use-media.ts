'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi, MediaQueryParams } from '@/lib/api/media';
import { MediaUploadData, UpdateMediaRequest } from '@/types/media';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';

export const mediaKeys = {
  all: ['media'] as const,
  lists: () => [...mediaKeys.all, 'list'] as const,
  list: (params: MediaQueryParams) => [...mediaKeys.lists(), params] as const,
  byEntity: (entityType: string, entityId: string) =>
    [...mediaKeys.all, 'entity', entityType, entityId] as const,
  details: () => [...mediaKeys.all, 'detail'] as const,
  detail: (id: string) => [...mediaKeys.details(), id] as const,
  stats: () => [...mediaKeys.all, 'stats'] as const,
};

export function useMedia(params?: MediaQueryParams) {
  return useQuery({
    queryKey: mediaKeys.list(params || {}),
    queryFn: () => mediaApi.getAll(params),
  });
}

export function useMediaById(id: string) {
  return useQuery({
    queryKey: mediaKeys.detail(id),
    queryFn: () => mediaApi.getById(id),
    enabled: !!id,
  });
}

export function useMediaByEntity(entityType: string, entityId: string) {
  return useQuery({
    queryKey: mediaKeys.byEntity(entityType, entityId),
    queryFn: () => mediaApi.getByEntity(entityType, entityId),
    enabled: !!entityType && !!entityId,
  });
}

export function useMediaStats() {
  return useQuery({
    queryKey: mediaKeys.stats(),
    queryFn: () => mediaApi.getStats(),
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MediaUploadData) => mediaApi.upload(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUploadMultipleMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      files,
      options,
    }: {
      files: File[];
      options?: { entity_type?: string; entity_id?: string };
    }) => mediaApi.uploadMultiple(files, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      toast.success('Files uploaded successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMediaRequest }) =>
      mediaApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: mediaKeys.detail(variables.id) });
      toast.success('Media updated successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      toast.success('Media deleted successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
