'use client';

import { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Upload, X, Star, Loader2, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { mediaApi } from '@/lib/api/media';
import { productImagesApi, ProductImage } from '@/lib/api/product-images';

interface ProductImagesUploadProps {
    productId?: string;
    isEdit?: boolean;
    onImagesChange?: (images: ProductImage[]) => void;
    initialImages?: ProductImage[];
}

interface LocalImage {
    id: string;
    file?: File;
    url: string;
    alt_text?: string;
    is_primary: boolean;
    sort_order: number;
    isUploading?: boolean;
    isLocal?: boolean;
}

export interface ProductImagesUploadRef {
    getUploadedUrls: () => { url: string; is_primary: boolean; sort_order: number }[];
}

const MAX_IMAGES = 5;

export const ProductImagesUpload = forwardRef<ProductImagesUploadRef, ProductImagesUploadProps>(
    function ProductImagesUpload({
        productId,
        isEdit = false,
        onImagesChange,
        initialImages = [],
    }, ref) {
        const [images, setImages] = useState<LocalImage[]>([]);
        const [isDragging, setIsDragging] = useState(false);
        const [isLoading, setIsLoading] = useState(false);

        // Expose getUploadedUrls method to parent via ref
        useImperativeHandle(ref, () => ({
            getUploadedUrls: () => {
                return images
                    .filter(img => !img.isUploading && img.url && !img.url.startsWith('blob:'))
                    .map((img, index) => ({
                        url: img.url,
                        is_primary: index === 0 || img.is_primary,
                        sort_order: img.sort_order,
                    }));
            },
        }), [images]);

        // Load existing images for edit mode
        useEffect(() => {
            if (isEdit && productId) {
                loadProductImages();
            } else if (initialImages.length > 0) {
                setImages(initialImages.map(img => ({ ...img, isLocal: false })));
            }
        }, [productId, isEdit]);

        const loadProductImages = async () => {
            if (!productId) return;
            setIsLoading(true);
            try {
                const response = await productImagesApi.getImages(productId);
                if (response.success && response.data) {
                    setImages(response.data.map(img => ({ ...img, isLocal: false })));
                }
            } catch (error) {
                console.error('Failed to load product images:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const notifyChange = useCallback((newImages: LocalImage[]) => {
            if (onImagesChange) {
                onImagesChange(newImages.filter(img => !img.isLocal) as ProductImage[]);
            }
        }, [onImagesChange]);

        const handleDragEnter = (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(true);
        };

        const handleDragLeave = (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
        };

        const handleDragOver = (e: React.DragEvent) => {
            e.preventDefault();
        };

        const handleDrop = useCallback(async (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files).filter(
                file => file.type.startsWith('image/')
            );
            await handleFiles(files);
        }, [images]);

        const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            await handleFiles(files);
            e.target.value = '';
        };

        const handleFiles = async (files: File[]) => {
            const remainingSlots = MAX_IMAGES - images.length;
            if (remainingSlots <= 0) {
                console.warn('Maximum images reached');
                return;
            }

            const filesToUpload = files.slice(0, remainingSlots);

            for (const file of filesToUpload) {
                const tempId = `temp-${Date.now()}-${Math.random()}`;
                const localUrl = URL.createObjectURL(file);

                // Add temporary local image
                const localImage: LocalImage = {
                    id: tempId,
                    file,
                    url: localUrl,
                    is_primary: images.length === 0, // First image is primary
                    sort_order: images.length,
                    isUploading: true,
                    isLocal: true,
                };

                setImages(prev => [...prev, localImage]);

                try {
                    // Upload to media service
                    const uploadResponse = await mediaApi.upload({
                        file,
                        entity_type: 'product',
                        entity_id: productId,
                    });

                    if (uploadResponse.success && uploadResponse.data) {
                        const uploadedUrl = uploadResponse.data.url;

                        // If editing, also add to product images
                        if (isEdit && productId) {
                            const imageResponse = await productImagesApi.addImage(productId, {
                                url: uploadedUrl,
                                is_primary: images.length === 0,
                                sort_order: images.length,
                            });

                            if (imageResponse.success && imageResponse.data) {
                                // Replace temp image with real one
                                setImages(prev =>
                                    prev.map(img =>
                                        img.id === tempId
                                            ? { ...imageResponse.data!, isLocal: false, isUploading: false }
                                            : img
                                    )
                                );
                            }
                        } else {
                            // For create mode, just update URL
                            setImages(prev =>
                                prev.map(img =>
                                    img.id === tempId
                                        ? { ...img, url: uploadedUrl, isUploading: false }
                                        : img
                                )
                            );
                        }

                        console.log('Image uploaded successfully');
                    }
                } catch (error) {
                    console.error('Upload failed:', error);
                    // Remove failed upload
                    setImages(prev => prev.filter(img => img.id !== tempId));
                }
            }
        };

        const handleRemoveImage = async (imageId: string) => {
            const imageToRemove = images.find(img => img.id === imageId);
            if (!imageToRemove) return;

            // If it's a saved image and we're editing, delete from backend
            if (isEdit && productId && !imageToRemove.isLocal) {
                try {
                    await productImagesApi.deleteImage(productId, imageId);
                    console.log('Image removed from product');
                } catch (error) {
                    console.error('Failed to delete image:', error);
                    return;
                }
            }

            setImages(prev => {
                const newImages = prev.filter(img => img.id !== imageId);
                // If we removed the primary image, make the first one primary
                if (imageToRemove.is_primary && newImages.length > 0) {
                    newImages[0].is_primary = true;
                }
                notifyChange(newImages);
                return newImages;
            });
        };

        const handleSetPrimary = async (imageId: string) => {
            if (isEdit && productId) {
                try {
                    await productImagesApi.setPrimaryImage(productId, imageId);
                } catch (error) {
                    console.error('Failed to set primary:', error);
                    return;
                }
            }

            setImages(prev => {
                const newImages = prev.map(img => ({
                    ...img,
                    is_primary: img.id === imageId,
                }));
                notifyChange(newImages);
                return newImages;
            });
        };

        // Get uploadable images for create mode (to be attached after product creation)
        const getUploadedUrls = () => {
            return images
                .filter(img => !img.isUploading)
                .map(img => ({
                    url: img.url,
                    is_primary: img.is_primary,
                    sort_order: img.sort_order,
                }));
        };

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Product Images</span>
                        <span className="text-sm font-normal text-muted-foreground">
                            {images.length}/{MAX_IMAGES}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Drop Zone */}
                    {images.length < MAX_IMAGES && (
                        <div
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className={cn(
                                'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
                                isDragging
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted-foreground/25 hover:border-primary/50'
                            )}
                            onClick={() => document.getElementById('image-upload')?.click()}
                        >
                            <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                                Drag and drop images here, or click to select
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, GIF up to 10MB
                            </p>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* Images Grid */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="relative group rounded-lg overflow-hidden border bg-muted aspect-square"
                                >
                                    {image.url ? (
                                        <Image
                                            src={image.url}
                                            alt={image.alt_text || 'Product image'}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}

                                    {/* Loading Overlay */}
                                    {image.isUploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                                        </div>
                                    )}

                                    {/* Primary Badge */}
                                    {image.is_primary && !image.isUploading && (
                                        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-current" />
                                            Primary
                                        </div>
                                    )}

                                    {/* Actions Overlay */}
                                    {!image.isUploading && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            {!image.is_primary && (
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleSetPrimary(image.id)}
                                                    title="Set as primary"
                                                >
                                                    <Star className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleRemoveImage(image.id)}
                                                title="Remove image"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {images.length === 0 && !isLoading && (
                        <p className="text-center text-sm text-muted-foreground py-4">
                            No images added yet. Upload up to {MAX_IMAGES} product images.
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    }
);
