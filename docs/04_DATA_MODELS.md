# Data Models Documentation

This document describes all DTOs (Data Transfer Objects) used in API requests and responses.

---

## Admin

### Admin Response
```typescript
interface AdminResponse {
  id: string;            // UUID
  email: string;
  name: string;
  role: "super_admin" | "admin" | "moderator";
  is_active: boolean;
  last_login: string | null;  // ISO datetime
  created_at: string;         // ISO datetime
  updated_at: string;         // ISO datetime
}
```

### Create Admin Request
```typescript
interface CreateAdminRequest {
  email: string;         // required, valid email
  password: string;      // required, min 6 chars
  name: string;          // required
  role: string;          // required: super_admin, admin, moderator
}
```

### Update Admin Request
```typescript
interface UpdateAdminRequest {
  email?: string;
  name?: string;
  role?: string;
  is_active?: boolean;
}
```

---

## Product

### Product Response
```typescript
interface ProductResponse {
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
  weight_unit: "kg" | "g" | "lb" | "oz";
  status: "draft" | "active" | "archived";
  is_featured: boolean;
  is_taxable: boolean;
  tax_rate: number;
  meta_title: string;
  meta_description: string;
  category_id: string | null;
  category: CategoryResponse | null;
  tags: string[];
  images: MediaResponse[];
  
  // Computed fields
  in_stock: boolean;           // quantity > 0
  low_stock: boolean;          // quantity <= low_stock_threshold
  discount_percentage: number; // calculated from compare_at_price
  
  created_at: string;
  updated_at: string;
}
```

### Create Product Request
```typescript
interface CreateProductRequest {
  name: string;              // required, max 255
  slug?: string;             // auto-generated if empty
  description?: string;
  short_description?: string;
  sku: string;               // required, max 100, unique
  barcode?: string;
  price: number;             // required, min 0
  compare_at_price?: number; // min 0
  cost_price?: number;       // min 0
  quantity?: number;         // default 0, min 0
  low_stock_threshold?: number; // default 5, min 0
  weight?: number;           // min 0
  weight_unit?: string;      // kg, g, lb, oz
  status?: string;           // draft, active, archived
  is_featured?: boolean;
  is_taxable?: boolean;
  tax_rate?: number;         // 0-100
  meta_title?: string;
  meta_description?: string;
  category_id?: string;      // UUID
  tags?: string[];
  images?: string[];         // Array of media IDs
}
```

### Update Stock Request
```typescript
interface UpdateStockRequest {
  quantity: number;          // required, min 0
}
```

---

## Category

### Category Response
```typescript
interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  meta_title: string;
  meta_description: string;
  parent_id: string | null;
  parent: CategoryResponse | null;
  children: CategoryResponse[];
  product_count: number;
  created_at: string;
  updated_at: string;
}
```

### Create Category Request
```typescript
interface CreateCategoryRequest {
  name: string;              // required, max 255
  slug?: string;             // auto-generated if empty
  description?: string;
  image_url?: string;
  is_active?: boolean;       // default true
  sort_order?: number;       // min 0
  meta_title?: string;
  meta_description?: string;
  parent_id?: string;        // UUID for parent category
}
```

---

## Customer

### Customer Response
```typescript
interface CustomerResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  is_verified: boolean;
  notes: string;
  addresses: AddressResponse[];
  total_orders: number;
  total_spent: number;
  last_order_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AddressResponse {
  id: string;
  customer_id: string;
  type: "shipping" | "billing";
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
```

### Create Customer Request
```typescript
interface CreateCustomerRequest {
  email: string;             // required, valid email
  password: string;          // required, min 6 chars
  first_name: string;        // required
  last_name: string;         // required
  phone?: string;
  is_active?: boolean;
  notes?: string;
}
```

### Create Address Request
```typescript
interface CreateAddressRequest {
  type: string;              // required: shipping, billing
  is_default?: boolean;
  first_name: string;        // required
  last_name: string;         // required
  company?: string;
  address_line1: string;     // required
  address_line2?: string;
  city: string;              // required
  state?: string;
  postal_code: string;       // required
  country: string;           // required
  phone?: string;
}
```

---

## Order

### Order Response
```typescript
interface OrderResponse {
  id: string;
  order_number: string;
  customer_id: string;
  customer: CustomerResponse;
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
  shipping_address: OrderAddressResponse;
  billing_address: OrderAddressResponse;
  
  // Items
  items: OrderItemResponse[];
  
  // Status history
  status_history: OrderStatusHistoryResponse[];
  
  notes: string;
  internal_notes: string;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

interface OrderItemResponse {
  id: string;
  order_id: string;
  product_id: string;
  product: ProductResponse | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

interface OrderAddressResponse {
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

interface OrderStatusHistoryResponse {
  id: string;
  order_id: string;
  from_status: string;
  to_status: string;
  notes: string;
  created_by: string;  // Admin ID
  created_at: string;
}
```

### Create Order Request
```typescript
interface CreateOrderRequest {
  customer_id: string;       // required, UUID
  payment_method?: string;
  discount_amount?: number;  // min 0
  tax_amount?: number;       // min 0
  shipping_amount?: number;  // min 0
  notes?: string;
  internal_notes?: string;
  
  shipping_address: OrderAddressRequest;  // required
  billing_address: OrderAddressRequest;   // required
  items: OrderItemRequest[];              // required, min 1
}

interface OrderAddressRequest {
  first_name: string;        // required
  last_name: string;         // required
  company?: string;
  address_line1: string;     // required
  address_line2?: string;
  city: string;              // required
  state?: string;
  postal_code: string;       // required
  country: string;           // required
  phone?: string;
}

interface OrderItemRequest {
  product_id: string;        // required, UUID
  quantity: number;          // required, min 1
  unit_price: number;        // required, min 0
}
```

### Update Order Status Request
```typescript
interface UpdateOrderStatusRequest {
  status: string;            // required: pending, confirmed, etc.
  notes?: string;
}
```

---

## Media

### Media Response
```typescript
interface MediaResponse {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;              // bytes
  url: string;               // full URL path
  alt_text: string;
  title: string;
  entity_type: string;       // product, category, etc.
  entity_id: string;
  sort_order: number;
  width: number | null;      // for images
  height: number | null;     // for images
  created_at: string;
  updated_at: string;
}
```

### Media Upload (Multipart Form)
```typescript
// POST /api/v1/media/upload
// Content-Type: multipart/form-data

interface MediaUploadForm {
  file: File;                // required
  entity_type?: string;      // product, category, etc.
  entity_id?: string;        // UUID
  alt_text?: string;
  title?: string;
  sort_order?: number;
}
```

### Update Media Request
```typescript
interface UpdateMediaRequest {
  alt_text?: string;
  title?: string;
  entity_type?: string;
  entity_id?: string;
  sort_order?: number;
}
```

---

## Dashboard Stats

### Dashboard Stats Response
```typescript
interface DashboardStatsResponse {
  total_products: number;
  total_categories: number;
  total_customers: number;
  total_orders: number;
  total_revenue: number;
  orders_by_status: Record<OrderStatus, number>;
  recent_orders: OrderResponse[];
  low_stock_products: ProductResponse[];
}
```
