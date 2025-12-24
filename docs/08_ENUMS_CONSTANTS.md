# Enums & Constants Documentation

This document lists all enumerated values and constants used in the API.

---

## Admin Roles

```typescript
type AdminRole = 'super_admin' | 'admin' | 'moderator';

const AdminRoles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;
```

---

## Order Status

```typescript
type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

const OrderStatuses = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;
```

### Order Status Flow

```
                    ┌─────────────┐
                    │   pending   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
       ┌──────────┐  ┌───────────┐  ┌───────────┐
       │confirmed │  │ cancelled │  │  refunded │
       └────┬─────┘  └───────────┘  └───────────┘
            │
            ▼
      ┌───────────┐
      │processing │
      └─────┬─────┘
            │
            ▼
      ┌───────────┐
      │  shipped  │──────────────────┐
      └─────┬─────┘                  │
            │                        ▼
            ▼                 ┌───────────┐
      ┌───────────┐          │ cancelled │
      │ delivered │          └───────────┘
      └───────────┘
```

### Valid Status Transitions

| From | Allowed Transitions |
|------|---------------------|
| `pending` | confirmed, cancelled, refunded |
| `confirmed` | processing, cancelled, refunded |
| `processing` | shipped, cancelled, refunded |
| `shipped` | delivered, cancelled |
| `delivered` | refunded |
| `cancelled` | (none - final) |
| `refunded` | (none - final) |

---

## Payment Status

```typescript
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

const PaymentStatuses = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;
```

---

## Product Status

```typescript
type ProductStatus = 'draft' | 'active' | 'archived';

const ProductStatuses = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;
```

| Status | Description |
|--------|-------------|
| `draft` | Not visible, work in progress |
| `active` | Published and available |
| `archived` | Hidden from listings but data retained |

---

## Weight Units

```typescript
type WeightUnit = 'kg' | 'g' | 'lb' | 'oz';

const WeightUnits = {
  KILOGRAM: 'kg',
  GRAM: 'g',
  POUND: 'lb',
  OUNCE: 'oz',
} as const;
```

### Conversion Reference

| From | To kg |
|------|-------|
| 1 kg | 1 |
| 1 g | 0.001 |
| 1 lb | 0.453592 |
| 1 oz | 0.0283495 |

---

## Address Types

```typescript
type AddressType = 'shipping' | 'billing';

const AddressTypes = {
  SHIPPING: 'shipping',
  BILLING: 'billing',
} as const;
```

---

## Allowed Media Types

```typescript
const AllowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/csv',
] as const;

type AllowedMimeType = typeof AllowedMimeTypes[number];
```

### File Extensions Mapping

```typescript
const MimeToExtension: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
};
```

---

## Pagination Defaults

```typescript
const PaginationDefaults = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
```

---

## UI Display Helpers

### Order Status Colors

```typescript
const OrderStatusColors: Record<OrderStatus, string> = {
  pending: 'yellow',
  confirmed: 'blue',
  processing: 'indigo',
  shipped: 'purple',
  delivered: 'green',
  cancelled: 'red',
  refunded: 'orange',
};
```

### Order Status Labels

```typescript
const OrderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};
```

### Payment Status Colors

```typescript
const PaymentStatusColors: Record<PaymentStatus, string> = {
  pending: 'yellow',
  paid: 'green',
  failed: 'red',
  refunded: 'orange',
};
```

### Payment Status Labels

```typescript
const PaymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'Awaiting Payment',
  paid: 'Paid',
  failed: 'Payment Failed',
  refunded: 'Refunded',
};
```

### Product Status Colors

```typescript
const ProductStatusColors: Record<ProductStatus, string> = {
  draft: 'gray',
  active: 'green',
  archived: 'orange',
};
```

---

## Complete TypeScript Enums File

Create this file in your frontend project:

```typescript
// src/types/enums.ts

export const AdminRoles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;
export type AdminRole = typeof AdminRoles[keyof typeof AdminRoles];

export const OrderStatuses = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;
export type OrderStatus = typeof OrderStatuses[keyof typeof OrderStatuses];

export const PaymentStatuses = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;
export type PaymentStatus = typeof PaymentStatuses[keyof typeof PaymentStatuses];

export const ProductStatuses = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;
export type ProductStatus = typeof ProductStatuses[keyof typeof ProductStatuses];

export const WeightUnits = {
  KILOGRAM: 'kg',
  GRAM: 'g',
  POUND: 'lb',
  OUNCE: 'oz',
} as const;
export type WeightUnit = typeof WeightUnits[keyof typeof WeightUnits];

export const AddressTypes = {
  SHIPPING: 'shipping',
  BILLING: 'billing',
} as const;
export type AddressType = typeof AddressTypes[keyof typeof AddressTypes];
```

---

## Dropdown Options Helper

```typescript
// Convert enum to dropdown options
function enumToOptions<T extends Record<string, string>>(
  enumObj: T,
  labels?: Record<string, string>
): { value: string; label: string }[] {
  return Object.values(enumObj).map(value => ({
    value,
    label: labels?.[value] ?? value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' '),
  }));
}

// Usage
const orderStatusOptions = enumToOptions(OrderStatuses, OrderStatusLabels);
// [
//   { value: 'pending', label: 'Pending' },
//   { value: 'confirmed', label: 'Confirmed' },
//   ...
// ]
```
