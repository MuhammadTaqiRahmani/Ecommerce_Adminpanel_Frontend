import { z } from 'zod';

// Order Address Schema
export const orderAddressSchema = z.object({
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

// Order Item Schema
export const orderItemSchema = z.object({
  product_id: z.string().uuid('Invalid product'),
  quantity: z
    .number({ message: 'Quantity is required' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  unit_price: z
    .number({ message: 'Price is required' })
    .min(0, 'Price must be 0 or greater'),
});

export const createOrderSchema = z.object({
  customer_id: z.string().uuid('Please select a customer'),
  payment_method: z.string().optional(),
  discount_amount: z
    .number()
    .min(0, 'Discount must be 0 or greater')
    .optional()
    .default(0),
  tax_amount: z
    .number()
    .min(0, 'Tax must be 0 or greater')
    .optional()
    .default(0),
  shipping_amount: z
    .number()
    .min(0, 'Shipping must be 0 or greater')
    .optional()
    .default(0),
  notes: z.string().optional(),
  internal_notes: z.string().optional(),
  shipping_address: orderAddressSchema,
  billing_address: orderAddressSchema,
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
});

export const updateOrderSchema = z.object({
  payment_method: z.string().optional(),
  discount_amount: z
    .number()
    .min(0, 'Discount must be 0 or greater')
    .optional(),
  tax_amount: z
    .number()
    .min(0, 'Tax must be 0 or greater')
    .optional(),
  shipping_amount: z
    .number()
    .min(0, 'Shipping must be 0 or greater')
    .optional(),
  notes: z.string().optional(),
  internal_notes: z.string().optional(),
  shipping_address: orderAddressSchema.optional(),
  billing_address: orderAddressSchema.optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ], {
    message: 'Please select a valid status',
  }),
  notes: z.string().optional(),
});

export const addOrderItemSchema = orderItemSchema;

export const updateOrderItemSchema = z.object({
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .optional(),
  unit_price: z
    .number()
    .min(0, 'Price must be 0 or greater')
    .optional(),
});

export type OrderAddressFormData = z.infer<typeof orderAddressSchema>;
export type OrderItemFormData = z.infer<typeof orderItemSchema>;
export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
export type UpdateOrderStatusFormData = z.infer<typeof updateOrderStatusSchema>;
export type AddOrderItemFormData = z.infer<typeof addOrderItemSchema>;
export type UpdateOrderItemFormData = z.infer<typeof updateOrderItemSchema>;
