# Authentication Documentation

## Login Flow

### Request
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "admin": {
      "id": "uuid-string",
      "email": "admin@example.com",
      "name": "Admin Name",
      "role": "super_admin",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  },
  "timestamp": 1705315800
}
```

## JWT Token Usage

All protected endpoints require the JWT token in the Authorization header:

```http
GET /api/v1/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Token Expiration

| Token Type | Default Expiration |
|------------|-------------------|
| Access Token | 1 hour (3600 seconds) |
| Refresh Token | 7 days |

## Token Refresh Flow

### Request
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "token": "new-access-token...",
    "refresh_token": "new-refresh-token...",
    "expires_in": 3600
  },
  "timestamp": 1705315800
}
```

## Change Password

### Request
```http
PUT /api/v1/profile/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "oldpassword123",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

## Authentication Errors

### 401 Unauthorized
- Missing Authorization header
- Invalid or expired token
- User account deactivated

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Invalid or expired token",
  "timestamp": 1705315800
}
```

### 403 Forbidden
- Valid token but insufficient permissions

```json
{
  "success": false,
  "message": "Forbidden",
  "error": "Insufficient permissions",
  "timestamp": 1705315800
}
```

## Frontend Implementation Tips

### 1. Token Storage
Store tokens securely:
- **Access Token**: Memory or secure cookie (short-lived)
- **Refresh Token**: HttpOnly cookie or secure storage

### 2. Axios Interceptor Example
```javascript
// Request interceptor - add token
axios.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios.request(error.config);
      }
      // Redirect to login
      logout();
    }
    return Promise.reject(error);
  }
);
```

### 3. Auto Logout
Set a timer based on `expires_in` to refresh token before expiration:
```javascript
const scheduleTokenRefresh = (expiresIn) => {
  // Refresh 5 minutes before expiration
  const refreshTime = (expiresIn - 300) * 1000;
  setTimeout(refreshToken, refreshTime);
};
```
