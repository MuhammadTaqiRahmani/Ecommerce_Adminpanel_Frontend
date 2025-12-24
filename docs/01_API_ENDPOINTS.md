# API Endpoints Documentation

Base URL: `/api/v1`

## Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Admin login | No |

## Profile (Any authenticated admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get current admin profile |
| PUT | `/profile/password` | Change password |

## Admin Management (super_admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admins` | List all admins |
| POST | `/admins` | Create new admin |
| GET | `/admins/:id` | Get admin by ID |
| PUT | `/admins/:id` | Update admin |
| DELETE | `/admins/:id` | Delete admin |

## Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get dashboard statistics |

## Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/categories` | Create category |
| GET | `/categories` | List categories (paginated) |
| GET | `/categories/tree` | Get category tree structure |
| GET | `/categories/:id` | Get category by ID |
| GET | `/categories/slug/:slug` | Get category by slug |
| PUT | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |

## Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create product |
| GET | `/products` | List products (paginated) |
| GET | `/products/stats` | Get product statistics |
| GET | `/products/:id` | Get product by ID |
| GET | `/products/slug/:slug` | Get product by slug |
| PUT | `/products/:id` | Update product |
| PATCH | `/products/:id/stock` | Update product stock |
| DELETE | `/products/:id` | Delete product |

## Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customers` | Create customer |
| GET | `/customers` | List customers (paginated) |
| GET | `/customers/stats` | Get customer statistics |
| GET | `/customers/:id` | Get customer by ID |
| PUT | `/customers/:id` | Update customer |
| PATCH | `/customers/:id/status` | Update customer status |
| DELETE | `/customers/:id` | Delete customer |
| GET | `/customers/:id/addresses` | Get customer addresses |
| POST | `/customers/:id/addresses` | Create address |
| PUT | `/customers/:id/addresses/:addressId` | Update address |
| DELETE | `/customers/:id/addresses/:addressId` | Delete address |

## Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create order |
| GET | `/orders` | List orders (paginated) |
| GET | `/orders/stats` | Get order statistics |
| GET | `/orders/recent` | Get recent orders |
| GET | `/orders/:id` | Get order by ID |
| GET | `/orders/:id/history` | Get order status history |
| PUT | `/orders/:id` | Update order |
| PATCH | `/orders/:id/status` | Update order status |
| DELETE | `/orders/:id` | Delete order |
| POST | `/orders/:id/items` | Add item to order |
| PUT | `/orders/:id/items/:itemId` | Update order item |
| DELETE | `/orders/:id/items/:itemId` | Remove order item |

## Media

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/media/upload` | Upload single file |
| POST | `/media/upload/multiple` | Upload multiple files |
| GET | `/media` | List media (paginated) |
| GET | `/media/stats` | Get media statistics |
| GET | `/media/:id` | Get media by ID |
| GET | `/media/entity/:entityType/:entityId` | Get media by entity |
| PUT | `/media/:id` | Update media |
| DELETE | `/media/:id` | Delete media |

## Static Files

| Path | Description |
|------|-------------|
| `/uploads/*` | Serve uploaded files (public) |
| `/health` | Health check endpoint (public) |
