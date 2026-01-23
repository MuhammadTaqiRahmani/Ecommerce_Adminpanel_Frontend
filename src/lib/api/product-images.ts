import apiClient from './client';
import { ApiResponse } from '@/types/api';

// Product Image types
export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    alt_text?: string;
    is_primary: boolean;
    sort_order: number;
    created_at: string;
}

export interface AddProductImageRequest {
    url: string;
    alt_text?: string;
    is_primary?: boolean;
    sort_order?: number;
}

export interface UpdateProductImageRequest {
    alt_text?: string;
    is_primary?: boolean;
    sort_order?: number;
}

export const productImagesApi = {
    // Get all images for a product
    getImages: async (productId: string): Promise<ApiResponse<ProductImage[]>> => {
        const response = await apiClient.get<ApiResponse<ProductImage[]>>(
            `/products/${productId}/images`
        );
        return response.data;
    },

    // Add image to product
    addImage: async (
        productId: string,
        data: AddProductImageRequest
    ): Promise<ApiResponse<ProductImage>> => {
        const response = await apiClient.post<ApiResponse<ProductImage>>(
            `/products/${productId}/images`,
            data
        );
        return response.data;
    },

    // Update image
    updateImage: async (
        productId: string,
        imageId: string,
        data: UpdateProductImageRequest
    ): Promise<ApiResponse<ProductImage>> => {
        const response = await apiClient.put<ApiResponse<ProductImage>>(
            `/products/${productId}/images/${imageId}`,
            data
        );
        return response.data;
    },

    // Delete image
    deleteImage: async (
        productId: string,
        imageId: string
    ): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(
            `/products/${productId}/images/${imageId}`
        );
        return response.data;
    },

    // Set primary image
    setPrimaryImage: async (
        productId: string,
        imageId: string
    ): Promise<ApiResponse<null>> => {
        const response = await apiClient.patch<ApiResponse<null>>(
            `/products/${productId}/images/${imageId}/primary`
        );
        return response.data;
    },
};
