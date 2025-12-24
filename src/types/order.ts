import { Customer } from './customer';
import { Product } from './product';

// Order Status Types
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export const OrderStatuses = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export const PaymentStatuses = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Order Address (embedded in order)
export interface OrderAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

// Order Item
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product: Product | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

// Order Status History
export interface OrderStatusHistory {
  id: string;
  order_id: string;
  from_status: string;
  to_status: string;
  notes: string;
  created_by: string;
  created_at: string;
}

// Order Entity
export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer: Customer;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  
  // Amounts
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  
  // Addresses
  shipping_address: OrderAddress;
  billing_address: OrderAddress;
  
  // Items
  items: OrderItem[];
  
  // Status history
  status_history: OrderStatusHistory[];
  
  notes: string;
  internal_notes: string;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

// Order Request Types
export interface OrderAddressRequest {
  first_name: string;
  last_name: string;
  company?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface OrderItemRequest {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderRequest {
  customer_id: string;
  payment_method?: string;
  discount_amount?: number;
  tax_amount?: number;
  shipping_amount?: number;
  notes?: string;
  internal_notes?: string;
  shipping_address: OrderAddressRequest;
  billing_address: OrderAddressRequest;
  items: OrderItemRequest[];
}

export interface UpdateOrderRequest {
  payment_method?: string;
  discount_amount?: number;
  tax_amount?: number;
  shipping_amount?: number;
  notes?: string;
  internal_notes?: string;
  shipping_address?: OrderAddressRequest;
  billing_address?: OrderAddressRequest;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
}

export interface AddOrderItemRequest {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface UpdateOrderItemRequest {
  quantity?: number;
  unit_price?: number;
}

// Order Stats
export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  refunded: number;
  total_revenue: number;
}

// Order Filters
export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  customer_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// Status Labels and Colors
export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const orderStatusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
};

export const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

// Valid Status Transitions
export const validStatusTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled', 'refunded'],
  confirmed: ['processing', 'cancelled', 'refunded'],
  processing: ['shipped', 'cancelled', 'refunded'],
  shipped: ['delivered', 'cancelled'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
};

export function canTransitionTo(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
  return validStatusTransitions[currentStatus]?.includes(newStatus) ?? false;
}

export function getAvailableTransitions(currentStatus: OrderStatus): OrderStatus[] {
  return validStatusTransitions[currentStatus] ?? [];
}
