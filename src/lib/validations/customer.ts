import { z } from 'zod';

// Address Schema (reusable)
export const addressSchema = z.object({
  type: z.enum(['shipping', 'billing'], {
    message: 'Address type must be shipping or billing',
  }),
  is_default: z.boolean().optional().default(false),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  company: z.string().optional().or(z.literal('')),
  address_line1: z.string().min(1, 'Address is required'),
  address_line2: z.string().optional().or(z.literal('')),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional().or(z.literal('')),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional().or(z.literal('')),
});

export const createCustomerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional().or(z.literal('')),
  is_active: z.boolean().optional().default(true),
  notes: z.string().optional(),
});

export const updateCustomerSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional().or(z.literal('')),
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
  notes: z.string().optional(),
});

export const updateCustomerStatusSchema = z.object({
  is_active: z.boolean(),
});

export const createAddressSchema = addressSchema;
export const updateAddressSchema = addressSchema.partial().extend({
  type: z.enum(['shipping', 'billing']).optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;
export type CreateAddressFormData = z.infer<typeof createAddressSchema>;
export type UpdateAddressFormData = z.infer<typeof updateAddressSchema>;
