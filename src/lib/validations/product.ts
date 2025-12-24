import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  slug: z
    .string()
    .max(255, 'Slug must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  description: z.string().optional(),
  short_description: z.string().optional(),
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(100, 'SKU must be less than 100 characters'),
  barcode: z
    .string()
    .max(100, 'Barcode must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  price: z
    .number({ message: 'Price is required and must be a number' })
    .min(0, 'Price must be 0 or greater'),
  compare_at_price: z
    .number()
    .min(0, 'Compare at price must be 0 or greater')
    .optional()
    .nullable()
    .transform((val) => val ?? undefined),
  cost_price: z
    .number()
    .min(0, 'Cost price must be 0 or greater')
    .optional()
    .nullable()
    .transform((val) => val ?? undefined),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity must be 0 or greater')
    .optional()
    .default(0),
  low_stock_threshold: z
    .number()
    .int('Low stock threshold must be a whole number')
    .min(0, 'Low stock threshold must be 0 or greater')
    .optional()
    .default(5),
  weight: z
    .number()
    .min(0, 'Weight must be 0 or greater')
    .optional()
    .nullable()
    .transform((val) => val ?? undefined),
  weight_unit: z.enum(['kg', 'g', 'lb', 'oz']).optional().default('kg'),
  status: z.enum(['draft', 'active', 'archived']).optional().default('draft'),
  is_featured: z.boolean().optional().default(false),
  is_taxable: z.boolean().optional().default(true),
  tax_rate: z
    .number()
    .min(0, 'Tax rate must be 0 or greater')
    .max(100, 'Tax rate must be 100 or less')
    .optional()
    .nullable()
    .transform((val) => val ?? undefined),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  category_id: z
    .string()
    .uuid('Invalid category')
    .optional()
    .nullable()
    .or(z.literal(''))
    .or(z.literal('none'))
    .transform((val) => (val === '' || val === 'none' || val === null ? undefined : val)),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
});

export const updateProductSchema = createProductSchema.partial().omit({ sku: true }).extend({
  sku: z
    .string()
    .max(100, 'SKU must be less than 100 characters')
    .optional(),
});

export const updateStockSchema = z.object({
  quantity: z
    .number({ message: 'Quantity is required and must be a number' })
    .int('Quantity must be a whole number')
    .min(0, 'Quantity must be 0 or greater'),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type UpdateStockFormData = z.infer<typeof updateStockSchema>;
