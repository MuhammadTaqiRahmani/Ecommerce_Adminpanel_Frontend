import apiClient from './client';
import {
  Media,
  MediaStats,
  MediaUploadData,
  UpdateMediaRequest,
  MediaFilters,
} from '@/types/media';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export interface MediaQueryParams extends PaginationParams, MediaFilters {}

export const mediaApi = {
  // List media
  getAll: async (params?: MediaQueryParams): Promise<PaginatedResponse<Media>> => {
    const response = await apiClient.get<PaginatedResponse<Media>>('/media', { params });
    return response.data;
  },

  // Get media by ID
  getById: async (id: string): Promise<ApiResponse<Media>> => {
    const response = await apiClient.get<ApiResponse<Media>>(`/media/${id}`);
    return response.data;
  },

  // Get media by entity
  getByEntity: async (entityType: string, entityId: string): Promise<ApiResponse<Media[]>> => {
    const response = await apiClient.get<ApiResponse<Media[]>>(
      `/media/entity/${entityType}/${entityId}`
    );
    return response.data;
  },

  // Get media statistics
  getStats: async (): Promise<ApiResponse<MediaStats>> => {
    const response = await apiClient.get<ApiResponse<MediaStats>>('/media/stats');
    return response.data;
  },

  // Upload single file
  upload: async (data: MediaUploadData): Promise<ApiResponse<Media>> => {
    const formData = new FormData();
    formData.append('file', data.file);
    if (data.entity_type) formData.append('entity_type', data.entity_type);
    if (data.entity_id) formData.append('entity_id', data.entity_id);
    if (data.alt_text) formData.append('alt_text', data.alt_text);
    if (data.title) formData.append('title', data.title);
    if (data.sort_order !== undefined) formData.append('sort_order', String(data.sort_order));

    const response = await apiClient.post<ApiResponse<Media>>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple files
  uploadMultiple: async (
    files: File[],
    options?: {
      entity_type?: string;
      entity_id?: string;
    }
  ): Promise<ApiResponse<Media[]>> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (options?.entity_type) formData.append('entity_type', options.entity_type);
    if (options?.entity_id) formData.append('entity_id', options.entity_id);

    const response = await apiClient.post<ApiResponse<Media[]>>('/media/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update media
  update: async (id: string, data: UpdateMediaRequest): Promise<ApiResponse<Media>> => {
    const response = await apiClient.put<ApiResponse<Media>>(`/media/${id}`, data);
    return response.data;
  },

  // Delete media
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/media/${id}`);
    return response.data;
  },
};

export default mediaApi;
