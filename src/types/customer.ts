// Address Types
export type AddressType = 'shipping' | 'billing';

export const AddressTypes = {
  SHIPPING: 'shipping',
  BILLING: 'billing',
} as const;

// Address Entity
export interface Address {
  id: string;
  customer_id: string;
  type: AddressType;
  is_default: boolean;
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
  created_at: string;
  updated_at: string;
}

// Customer Entity
export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  is_verified: boolean;
  notes: string;
  addresses: Address[];
  total_orders: number;
  total_spent: number;
  last_order_at: string | null;
  created_at: string;
  updated_at: string;
}

// Customer Request Types
export interface CreateCustomerRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active?: boolean;
  notes?: string;
}

export interface UpdateCustomerRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
  is_verified?: boolean;
  notes?: string;
}

export interface UpdateCustomerStatusRequest {
  is_active: boolean;
}

// Address Request Types
export interface CreateAddressRequest {
  type: AddressType;
  is_default?: boolean;
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

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

// Customer Stats
export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  new_this_month: number;
}

// Customer Filters
export interface CustomerFilters {
  is_active?: boolean;
  is_verified?: boolean;
  search?: string;
}

// Helpers
export function getCustomerFullName(customer: Customer): string {
  return `${customer.first_name} ${customer.last_name}`.trim();
}

export function getAddressFullName(address: Address): string {
  return `${address.first_name} ${address.last_name}`.trim();
}

export function formatAddress(address: Address): string {
  const parts = [
    address.address_line1,
    address.address_line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ].filter(Boolean);
  return parts.join(', ');
}
