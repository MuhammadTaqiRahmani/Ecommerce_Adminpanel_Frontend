import { z } from 'zod';

export const createAdminSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  name: z
    .string()
    .min(1, 'Name is required'),
  role: z.enum(['super_admin', 'admin', 'moderator'], {
    message: 'Please select a valid role',
  }),
});

export const updateAdminSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  name: z
    .string()
    .optional(),
  role: z.enum(['super_admin', 'admin', 'moderator']).optional(),
  is_active: z.boolean().optional(),
});

export type CreateAdminFormData = z.infer<typeof createAdminSchema>;
export type UpdateAdminFormData = z.infer<typeof updateAdminSchema>;
