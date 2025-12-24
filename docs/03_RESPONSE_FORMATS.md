# Response Formats Documentation

All API responses follow a consistent structure for predictable frontend handling.

## Success Response

### Standard Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* payload */ },
  "timestamp": 1705315800
}
```

### Example: Get Product
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Product Name",
    "sku": "PROD-001",
    "price": 99.99
  },
  "timestamp": 1705315800
}
```

## Paginated Response

Used for list endpoints (GET `/products`, `/orders`, `/customers`, etc.)

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    { "id": "...", "name": "Product 1" },
    { "id": "...", "name": "Product 2" }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_items": 156,
    "total_pages": 16
  },
  "timestamp": 1705315800
}
```

### Pagination Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Current page number |
| `limit` | integer | 10 | Items per page (max 100) |
| `sort` | string | varies | Sort field |
| `order` | string | desc | Sort order (asc/desc) |

### Example Request
```http
GET /api/v1/products?page=2&limit=20&sort=created_at&order=desc
```

## Error Response

### Standard Error
```json
{
  "success": false,
  "message": "Operation failed",
  "error": "Detailed error description",
  "timestamp": 1705315800
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "fields": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 6 characters"
      }
    ]
  },
  "timestamp": 1705315800
}
```

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (create) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate entry (email, sku, slug) |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## TypeScript Interfaces

```typescript
// Base response interface
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | ValidationError;
  timestamp: number;
}

// Paginated response
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

// Validation error structure
interface ValidationError {
  fields: Array<{
    field: string;
    message: string;
  }>;
}

// Type guards
function isSuccess<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
  return response.success === true && response.data !== undefined;
}

function isValidationError(error: string | ValidationError): error is ValidationError {
  return typeof error === 'object' && 'fields' in error;
}
```

## Frontend Implementation Tips

### 1. Generic API Handler
```typescript
async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, options);
  const data: ApiResponse<T> = await response.json();
  
  if (!data.success) {
    throw new ApiError(data.message, data.error);
  }
  
  return data;
}
```

### 2. Pagination Hook
```typescript
function usePagination<T>(fetchFn: (page: number, limit: number) => Promise<PaginatedResponse<T>>) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total_items: 0, total_pages: 0 });
  const [loading, setLoading] = useState(false);

  const fetchPage = async (page: number) => {
    setLoading(true);
    const response = await fetchFn(page, pagination.limit);
    setData(response.data);
    setPagination(response.pagination);
    setLoading(false);
  };

  return { data, pagination, loading, fetchPage };
}
```

### 3. Error Display
```typescript
function getErrorMessage(error: string | ValidationError): string {
  if (typeof error === 'string') {
    return error;
  }
  return error.fields.map(f => `${f.field}: ${f.message}`).join(', ');
}
```
