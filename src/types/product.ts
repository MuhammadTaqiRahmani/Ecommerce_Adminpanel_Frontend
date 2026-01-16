import { Category } from './category';
import { Media } from './media';

// Product Status Types
export type ProductStatus = 'draft' | 'active' | 'archived';
export type WeightUnit = 'kg' | 'g' | 'lb' | 'oz';

export const ProductStatuses = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;

export const WeightUnits = {
  KILOGRAM: 'kg',
  GRAM: 'g',
  POUND: 'lb',
  OUNCE: 'oz',
} as const;

// Product Entity
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  barcode: string;
  price: number;
  compare_at_price: number;
  cost_price: number;
  quantity: number;
  low_stock_threshold: number;
  weight: number;
  weight_unit: WeightUnit;
  status: ProductStatus;
  is_featured: boolean;
  is_taxable: boolean;
  tax_rate: number;
  meta_title: string;
  meta_description: string;
  category_id: string | null;
  category: Category | null;
  tags: string[];
  images: Media[];
  
  // Computed fields
  in_stock: boolean;
  low_stock: boolean;
  discount_percentage: number;
  
  created_at: string;
  updated_at: string;
}

// Product Request Types
// CreateProductRequest matches backend CreateProductRequest DTO
export interface CreateProductRequest {
  name: string;
  slug?: string;
  description?: string;
  short_description?: string;
  sku?: string;  // Optional in backend
  barcode?: string;
  price: number;
  compare_at_price?: number;
  cost_price?: number;
  stock_quantity?: number;  // Backend uses stock_quantity, not quantity
  low_stock_threshold?: number;
  weight?: number;
  weight_unit?: WeightUnit;
  is_active?: boolean;  // Backend uses is_active boolean, not status string
  is_featured?: boolean;
  is_digital?: boolean;
  meta_title?: string;
  meta_description?: string;
  category_id?: string;
  // Note: tags, is_taxable, tax_rate are NOT supported by backend
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface UpdateStockRequest {
  quantity: number;
}

// Product Stats
export interface ProductStats {
  total: number;
  active: number;
  draft: number;
  archived: number;
  low_stock: number;
  out_of_stock: number;
}

// Product Filters
export interface ProductFilters {
  status?: ProductStatus;
  category_id?: string;
  in_stock?: boolean;
  is_featured?: boolean;
  search?: string;
}

export const statusLabels: Record<ProductStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  archived: 'Archived',
};

export const statusColors: Record<ProductStatus, string> = {
  draft: 'secondary',
  active: 'default',
  archived: 'destructive',
};

export function getProductStatusLabel(status: ProductStatus): string {
  return statusLabels[status] || status;
}

export function getProductStatusColor(status: ProductStatus): string {
  return statusColors[status] || 'secondary';
}
