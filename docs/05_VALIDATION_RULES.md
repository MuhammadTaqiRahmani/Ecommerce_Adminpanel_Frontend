# Validation Rules Documentation

This document lists all field validation rules enforced by the backend.

---

## General Rules

| Rule | Description |
|------|-------------|
| `required` | Field must be present and non-empty |
| `email` | Must be a valid email format |
| `min=N` | Minimum length (string) or value (number) |
| `max=N` | Maximum length (string) or value (number) |
| `uuid` | Must be a valid UUID v4 |
| `oneof=a b c` | Must be one of the listed values |

---

## Authentication

### Login Request
| Field | Rules |
|-------|-------|
| `email` | required, email |
| `password` | required |

### Change Password Request
| Field | Rules |
|-------|-------|
| `current_password` | required |
| `new_password` | required, min=6 |
| `confirm_password` | required, must match new_password |

### Refresh Token Request
| Field | Rules |
|-------|-------|
| `refresh_token` | required |

---

## Admin

### Create Admin
| Field | Rules |
|-------|-------|
| `email` | required, email, unique |
| `password` | required, min=6 |
| `name` | required |
| `role` | required, oneof=super_admin admin moderator |

### Update Admin
| Field | Rules |
|-------|-------|
| `email` | email (if provided), unique |
| `name` | - |
| `role` | oneof=super_admin admin moderator |
| `is_active` | boolean |

---

## Product

### Create Product
| Field | Rules |
|-------|-------|
| `name` | required, max=255 |
| `slug` | max=255, unique (auto-generated if empty) |
| `sku` | required, max=100, unique |
| `barcode` | max=100 |
| `price` | required, min=0 |
| `compare_at_price` | min=0 |
| `cost_price` | min=0 |
| `quantity` | min=0 |
| `low_stock_threshold` | min=0 |
| `weight` | min=0 |
| `weight_unit` | oneof=kg g lb oz |
| `status` | oneof=draft active archived |
| `tax_rate` | min=0, max=100 |
| `category_id` | uuid (if provided) |
| `tags` | array of strings |
| `images` | array of uuids |

### Update Stock
| Field | Rules |
|-------|-------|
| `quantity` | required, min=0 |

---

## Category

### Create Category
| Field | Rules |
|-------|-------|
| `name` | required, max=255 |
| `slug` | max=255, unique (auto-generated if empty) |
| `description` | - |
| `image_url` | valid URL (if provided) |
| `is_active` | boolean |
| `sort_order` | min=0 |
| `parent_id` | uuid (if provided), cannot be self |

---

## Customer

### Create Customer
| Field | Rules |
|-------|-------|
| `email` | required, email, unique |
| `password` | required, min=6 |
| `first_name` | required |
| `last_name` | required |
| `phone` | valid phone (if provided) |

### Update Customer Status
| Field | Rules |
|-------|-------|
| `is_active` | required, boolean |

---

## Address

### Create/Update Address
| Field | Rules |
|-------|-------|
| `type` | required, oneof=shipping billing |
| `first_name` | required |
| `last_name` | required |
| `address_line1` | required |
| `city` | required |
| `postal_code` | required |
| `country` | required |
| `is_default` | boolean |

---

## Order

### Create Order
| Field | Rules |
|-------|-------|
| `customer_id` | required, uuid |
| `discount_amount` | min=0 |
| `tax_amount` | min=0 |
| `shipping_amount` | min=0 |
| `shipping_address` | required, valid address object |
| `billing_address` | required, valid address object |
| `items` | required, min=1 item |

### Order Item
| Field | Rules |
|-------|-------|
| `product_id` | required, uuid |
| `quantity` | required, min=1 |
| `unit_price` | required, min=0 |

### Update Order Status
| Field | Rules |
|-------|-------|
| `status` | required, valid status transition |

---

## Media

### Upload
| Field | Rules |
|-------|-------|
| `file` | required, max 10MB |
| `entity_type` | - |
| `entity_id` | uuid (if provided) |
| `sort_order` | min=0 |

---

## Validation Error Response

When validation fails, you receive:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "fields": [
      { "field": "email", "message": "Email is required" },
      { "field": "password", "message": "Password must be at least 6 characters" }
    ]
  },
  "timestamp": 1705315800
}
```

---

## Frontend Validation Tips

### 1. Match Backend Rules
```typescript
const validationSchema = {
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
};
```

### 2. Handle Server Errors
```typescript
function handleValidationError(error: ValidationError) {
  const fieldErrors: Record<string, string> = {};
  error.fields.forEach(f => {
    fieldErrors[f.field] = f.message;
  });
  return fieldErrors;
}
```

### 3. Unique Field Validation
For unique fields (email, sku, slug), backend will return:
```json
{
  "success": false,
  "message": "Email already exists",
  "error": "duplicate key value",
  "timestamp": 1705315800
}
```

### 4. Slug Auto-generation
If `slug` is not provided for products/categories, it's auto-generated from `name`:
- "Product Name" → "product-name"
- Uniqueness is ensured with numeric suffix if needed: "product-name-2"
