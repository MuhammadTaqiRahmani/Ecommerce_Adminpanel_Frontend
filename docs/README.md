# Admin Panel API Documentation

Complete backend documentation for frontend development.

---

## Documentation Index

| # | Document | Description |
|---|----------|-------------|
| 1 | [API Endpoints](01_API_ENDPOINTS.md) | Complete list of all API routes with methods |
| 2 | [Authentication](02_AUTHENTICATION.md) | Login flow, JWT tokens, refresh mechanism |
| 3 | [Response Formats](03_RESPONSE_FORMATS.md) | Success, error, and paginated response structures |
| 4 | [Data Models](04_DATA_MODELS.md) | All DTOs (request/response) with TypeScript interfaces |
| 5 | [Validation Rules](05_VALIDATION_RULES.md) | Field validation requirements |
| 6 | [File Uploads](06_FILE_UPLOADS.md) | Upload endpoints, allowed types, size limits |
| 7 | [Roles & Permissions](07_ROLES_PERMISSIONS.md) | Admin roles and access control |
| 8 | [Enums & Constants](08_ENUMS_CONSTANTS.md) | All status values, types, and constants |

---

## Quick Start

### 1. Base URL
```
http://localhost:8080/api/v1
```

### 2. Authentication
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### 3. Use Token in Requests
```http
GET /api/v1/products
Authorization: Bearer <your-token>
```

---

## Key Information Summary

### Roles
- `super_admin` - Full access including admin management
- `admin` - All features except admin management
- `moderator` - All features except admin management

### Order Statuses
`pending` → `confirmed` → `processing` → `shipped` → `delivered`
(Can be `cancelled` or `refunded` at various stages)

### Payment Statuses
`pending`, `paid`, `failed`, `refunded`

### Product Statuses
`draft`, `active`, `archived`

### File Uploads
- Max size: 10MB
- Allowed: JPEG, PNG, GIF, WebP, SVG, PDF, TXT, CSV

---

## Response Format

```json
{
  "success": true,
  "message": "Description",
  "data": { },
  "timestamp": 1705315800
}
```

With pagination:
```json
{
  "success": true,
  "message": "Description",
  "data": [ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_items": 100,
    "total_pages": 10
  },
  "timestamp": 1705315800
}
```

---

## Backend Tech Stack
- **Language:** Go 1.21+
- **Framework:** Gin
- **Database:** PostgreSQL
- **Authentication:** JWT (access + refresh tokens)
