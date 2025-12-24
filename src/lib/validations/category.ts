import { z } from 'zod';

export const createCategorySchema = z.object({
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
  image_url: z
    .string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean().optional().default(true),
  sort_order: z
    .number()
    .int('Sort order must be a whole number')
    .min(0, 'Sort order must be 0 or greater')
    .optional()
    .default(0),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  parent_id: z
    .string()
    .uuid('Invalid parent category')
    .optional()
    .or(z.literal(''))
    .or(z.literal('none'))
    .transform((val) => (val === '' || val === 'none' ? undefined : val)),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
