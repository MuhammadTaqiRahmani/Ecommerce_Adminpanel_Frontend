# Admin Panel Frontend - Development Plan

## Project Overview

**Project:** E-commerce Admin Panel Frontend  
**Framework:** Next.js 14 (App Router)  
**Backend API:** `http://localhost:8080/api/v1`  
**Timeline:** 4 Phases

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| State Management | Zustand (global) + TanStack Query (server) |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Icons | Lucide React |
| Charts | Recharts |
| Tables | TanStack Table |
| Date Handling | date-fns |
| Notifications | Sonner (toast) |

---

# Phase 1: Foundation & Architecture

## 1.1 Project Setup & Configuration

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 1.1.1 | Initialize Next.js Project | Create Next.js 14 app with TypeScript, Tailwind CSS, ESLint | High |
| 1.1.2 | Install Dependencies | Install all required packages (shadcn/ui, axios, zustand, react-query, etc.) | High |
| 1.1.3 | Configure Tailwind | Custom theme colors, fonts, extend utilities | High |
| 1.1.4 | Setup shadcn/ui | Initialize and install base components | High |
| 1.1.5 | Environment Variables | Setup `.env.local` for API URL, other configs | High |
| 1.1.6 | ESLint & Prettier | Configure linting and formatting rules | Medium |

### Deliverables
- [ ] Working Next.js project with all dependencies
- [ ] Configured Tailwind with custom theme
- [ ] Base shadcn/ui components installed
- [ ] Environment configuration

---

## 1.2 Project Architecture & Structure

### Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes group (no layout)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Dashboard routes group (with sidebar)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx          # List
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # Create
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # View/Edit
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── media/
│   │   ├── admins/               # super_admin only
│   │   ├── profile/
│   │   └── layout.tsx            # Dashboard layout with sidebar
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Redirect to dashboard
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── breadcrumbs.tsx
│   │   └── page-header.tsx
│   ├── forms/
│   │   ├── product-form.tsx
│   │   ├── category-form.tsx
│   │   ├── customer-form.tsx
│   │   ├── order-form.tsx
│   │   └── admin-form.tsx
│   ├── tables/
│   │   ├── data-table.tsx        # Reusable table component
│   │   ├── columns/              # Column definitions
│   │   │   ├── product-columns.tsx
│   │   │   ├── order-columns.tsx
│   │   │   └── ...
│   │   └── table-pagination.tsx
│   ├── modals/
│   │   ├── confirm-modal.tsx
│   │   ├── media-picker-modal.tsx
│   │   └── status-update-modal.tsx
│   ├── cards/
│   │   ├── stats-card.tsx
│   │   ├── product-card.tsx
│   │   └── order-card.tsx
│   └── shared/
│       ├── loading-spinner.tsx
│       ├── empty-state.tsx
│       ├── error-boundary.tsx
│       ├── status-badge.tsx
│       └── image-upload.tsx
│
├── lib/
│   ├── api/
│   │   ├── client.ts             # Axios instance with interceptors
│   │   ├── auth.ts               # Auth API calls
│   │   ├── products.ts           # Product API calls
│   │   ├── categories.ts
│   │   ├── orders.ts
│   │   ├── customers.ts
│   │   ├── media.ts
│   │   ├── admins.ts
│   │   └── dashboard.ts
│   ├── validations/
│   │   ├── auth.ts               # Zod schemas for auth
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── order.ts
│   │   ├── customer.ts
│   │   └── admin.ts
│   ├── utils/
│   │   ├── cn.ts                 # Tailwind class merger
│   │   ├── format.ts             # Date, currency formatters
│   │   ├── helpers.ts
│   │   └── constants.ts
│   └── hooks/
│       ├── use-auth.ts
│       ├── use-products.ts
│       ├── use-categories.ts
│       ├── use-orders.ts
│       ├── use-customers.ts
│       ├── use-media.ts
│       ├── use-admins.ts
│       └── use-debounce.ts
│
├── store/
│   ├── auth-store.ts             # Zustand auth store
│   └── ui-store.ts               # UI state (sidebar, modals)
│
├── types/
│   ├── api.ts                    # API response types
│   ├── auth.ts
│   ├── product.ts
│   ├── category.ts
│   ├── order.ts
│   ├── customer.ts
│   ├── media.ts
│   ├── admin.ts
│   └── index.ts                  # Re-exports
│
├── providers/
│   ├── query-provider.tsx        # TanStack Query provider
│   ├── auth-provider.tsx         # Auth context
│   └── theme-provider.tsx
│
└── middleware.ts                 # Auth middleware for protected routes
```

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 1.2.1 | Create Folder Structure | Set up all directories as per architecture | High |
| 1.2.2 | Setup Route Groups | Create (auth) and (dashboard) route groups | High |
| 1.2.3 | Configure Path Aliases | Setup `@/` alias in tsconfig | High |

---

## 1.3 Core Infrastructure

### 1.3.1 API Client Setup

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 1.3.1.1 | Create Axios Instance | Base URL, default headers, timeout | High |
| 1.3.1.2 | Request Interceptor | Attach JWT token to requests | High |
| 1.3.1.3 | Response Interceptor | Handle 401, auto-refresh token | High |
| 1.3.1.4 | Error Handler | Unified error handling | High |

### 1.3.2 Authentication System

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 1.3.2.1 | Auth Store (Zustand) | Store token, admin data, auth state | High |
| 1.3.2.2 | Auth API Functions | login, refresh, logout, getProfile | High |
| 1.3.2.3 | Auth Provider | Context for auth state | High |
| 1.3.2.4 | Auth Middleware | Protect dashboard routes | High |
| 1.3.2.5 | Token Management | Store in cookies, auto-refresh | High |

### 1.3.3 TanStack Query Setup

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 1.3.3.1 | Query Provider | Configure QueryClient | High |
| 1.3.3.2 | Default Options | Stale time, retry, refetch settings | Medium |

---

## 1.4 TypeScript Types

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 1.4.1 | API Response Types | ApiResponse, PaginatedResponse, ValidationError | High |
| 1.4.2 | Entity Types | Admin, Product, Category, Order, Customer, Media | High |
| 1.4.3 | Request Types | All create/update request interfaces | High |
| 1.4.4 | Enum Types | OrderStatus, PaymentStatus, ProductStatus, etc. | High |

---

## 1.5 Validation Schemas (Zod)

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 1.5.1 | Auth Schemas | loginSchema, changePasswordSchema | High |
| 1.5.2 | Product Schemas | createProductSchema, updateProductSchema | High |
| 1.5.3 | Category Schemas | createCategorySchema, updateCategorySchema | High |
| 1.5.4 | Order Schemas | createOrderSchema, updateStatusSchema | High |
| 1.5.5 | Customer Schemas | createCustomerSchema, addressSchema | High |
| 1.5.6 | Admin Schemas | createAdminSchema, updateAdminSchema | High |

---

## 1.6 Base UI Components

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 1.6.1 | Install shadcn Components | Button, Input, Card, Table, Dialog, Form, Select, Badge, etc. | High |
| 1.6.2 | Create Loading Spinner | Global loading component | High |
| 1.6.3 | Create Empty State | "No data" component | High |
| 1.6.4 | Create Error Boundary | Error fallback UI | High |
| 1.6.5 | Create Status Badge | Dynamic status badges with colors | Medium |
| 1.6.6 | Create Page Header | Title + actions component | Medium |
| 1.6.7 | Create Breadcrumbs | Navigation breadcrumbs | Medium |

---

## 1.7 Layout Components

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 1.7.1 | Auth Layout | Centered card layout for login | High |
| 1.7.2 | Dashboard Layout | Sidebar + Header + Main content | High |
| 1.7.3 | Sidebar Component | Navigation menu with role-based items | High |
| 1.7.4 | Header Component | User dropdown, notifications placeholder | High |
| 1.7.5 | Mobile Responsive | Collapsible sidebar for mobile | Medium |

---

## 1.8 Phase 1 Testing

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 1.8.1 | API Client Test | Test axios interceptors, error handling | High |
| 1.8.2 | Auth Flow Test | Test login, token storage, refresh | High |
| 1.8.3 | Protected Routes Test | Test middleware redirects | High |
| 1.8.4 | Layout Render Test | Test sidebar, header render | Medium |
| 1.8.5 | Type Validation Test | Ensure types match API responses | Medium |

### Testing Checklist
- [ ] Login works and stores token
- [ ] Protected routes redirect to login if not authenticated
- [ ] Token refresh works before expiration
- [ ] Sidebar shows role-based menu items
- [ ] API errors are handled gracefully
- [ ] Loading states display correctly

---

# Phase 2: Feature Implementation

## 2.1 Authentication Features

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 2.1.1 | Login Page | Email/password form, validation, error display | High |
| 2.1.2 | Logout Functionality | Clear tokens, redirect to login | High |
| 2.1.3 | Profile Page | View/edit profile, change password | High |
| 2.1.4 | Session Persistence | Remember login across browser refresh | High |

---

## 2.2 Dashboard Features

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 2.2.1 | Stats Cards | Total orders, products, customers, revenue | High |
| 2.2.2 | Recent Orders Widget | Last 5-10 orders with status | High |
| 2.2.3 | Low Stock Alert | Products with low stock warning | Medium |
| 2.2.4 | Quick Actions | Links to common actions | Medium |

---

## 2.3 Products Module

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 2.3.1 | Products List Page | DataTable with search, filter, pagination | High |
| 2.3.2 | Product Detail Page | View product details, images | High |
| 2.3.3 | Create Product Page | Form with all fields, image upload | High |
| 2.3.4 | Edit Product Page | Pre-filled form, update functionality | High |
| 2.3.5 | Delete Product | Confirmation modal, delete API | High |
| 2.3.6 | Stock Update | Quick stock update modal/inline | High |
| 2.3.7 | Bulk Actions | Select multiple, bulk delete | Medium |
| 2.3.8 | Search & Filter | By name, SKU, status, category | Medium |
| 2.3.9 | Product Stats | Stats from API | Low |

### API Hooks
```typescript
useProducts()        // List with pagination
useProduct(id)       // Single product
useCreateProduct()   // Create mutation
useUpdateProduct()   // Update mutation
useDeleteProduct()   // Delete mutation
useUpdateStock()     // Stock update mutation
useProductStats()    // Statistics
```

---

## 2.4 Categories Module

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 2.4.1 | Categories List Page | Table view with parent/child info | High |
| 2.4.2 | Category Tree View | Hierarchical tree display | High |
| 2.4.3 | Create Category Page | Form with parent selection | High |
| 2.4.4 | Edit Category Page | Update category details | High |
| 2.4.5 | Delete Category | With child handling warning | High |
| 2.4.6 | Reorder Categories | Drag-drop or sort_order input | Low |

### API Hooks
```typescript
useCategories()       // List with pagination
useCategoryTree()     // Tree structure
useCategory(id)       // Single category
useCreateCategory()   // Create mutation
useUpdateCategory()   // Update mutation
useDeleteCategory()   // Delete mutation
```

---

## 2.5 Orders Module

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 2.5.1 | Orders List Page | Table with status badges, filters | High |
| 2.5.2 | Order Detail Page | Full order info, items, addresses, history | High |
| 2.5.3 | Create Order Page | Customer select, add items, addresses | High |
| 2.5.4 | Update Order Status | Status dropdown with notes | High |
| 2.5.5 | Order Status History | Timeline display | High |
| 2.5.6 | Add/Edit Order Items | Modify order items | Medium |
| 2.5.7 | Order Filters | By status, date range, customer | Medium |
| 2.5.8 | Recent Orders | Dashboard widget data | Medium |
| 2.5.9 | Order Stats | Statistics from API | Low |

### API Hooks
```typescript
useOrders()           // List with pagination
useRecentOrders()     // Recent orders
useOrder(id)          // Single order
useOrderHistory(id)   // Status history
useCreateOrder()      // Create mutation
useUpdateOrder()      // Update mutation
useUpdateOrderStatus() // Status update mutation
useDeleteOrder()      // Delete mutation
useOrderStats()       // Statistics
```

---

## 2.6 Customers Module

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 2.6.1 | Customers List Page | Table with total orders, spent | High |
| 2.6.2 | Customer Detail Page | Profile, addresses, order history | High |
| 2.6.3 | Create Customer Page | Form with validation | High |
| 2.6.4 | Edit Customer Page | Update customer info | High |
| 2.6.5 | Delete Customer | With order check warning | High |
| 2.6.6 | Manage Addresses | CRUD for customer addresses | High |
| 2.6.7 | Toggle Status | Activate/deactivate customer | Medium |
| 2.6.8 | Customer Stats | Statistics from API | Low |

### API Hooks
```typescript
useCustomers()        // List with pagination
useCustomer(id)       // Single customer
useCreateCustomer()   // Create mutation
useUpdateCustomer()   // Update mutation
useDeleteCustomer()   // Delete mutation
useCustomerAddresses(customerId) // Addresses
useCreateAddress()    // Create address mutation
useUpdateAddress()    // Update address mutation
useDeleteAddress()    // Delete address mutation
useCustomerStats()    // Statistics
```

---

## 2.7 Media Module

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 2.7.1 | Media Library Page | Grid view of all media | High |
| 2.7.2 | Upload Single File | Drag-drop or click upload | High |
| 2.7.3 | Upload Multiple Files | Batch upload | High |
| 2.7.4 | Media Detail Modal | View, edit alt/title | Medium |
| 2.7.5 | Delete Media | With usage warning | Medium |
| 2.7.6 | Media Picker Component | Reusable for product/category forms | High |
| 2.7.7 | Filter by Entity | Filter by product, category | Low |
| 2.7.8 | Media Stats | Statistics from API | Low |

### API Hooks
```typescript
useMedia()            // List with pagination
useMediaByEntity()    // By entity type/id
useUploadMedia()      // Upload mutation
useUploadMultiple()   // Multiple upload mutation
useUpdateMedia()      // Update mutation
useDeleteMedia()      // Delete mutation
useMediaStats()       // Statistics
```

---

## 2.8 Admin Management Module (super_admin only)

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 2.8.1 | Admins List Page | Table with role, status | High |
| 2.8.2 | Admin Detail Page | View admin info | High |
| 2.8.3 | Create Admin Page | Form with role selection | High |
| 2.8.4 | Edit Admin Page | Update admin, change role | High |
| 2.8.5 | Delete Admin | With confirmation | High |
| 2.8.6 | Toggle Admin Status | Activate/deactivate | Medium |

### API Hooks
```typescript
useAdmins()           // List with pagination
useAdmin(id)          // Single admin
useCreateAdmin()      // Create mutation
useUpdateAdmin()      // Update mutation
useDeleteAdmin()      // Delete mutation
```

---

## 2.9 Reusable Components for Phase 2

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 2.9.1 | DataTable Component | Generic table with sorting, pagination | High |
| 2.9.2 | Form Components | Input, Select, Textarea wrappers | High |
| 2.9.3 | Confirm Modal | Reusable delete confirmation | High |
| 2.9.4 | Status Update Modal | Status change with notes | High |
| 2.9.5 | Image Upload | Single/multiple image upload | High |
| 2.9.6 | Media Picker | Select from library modal | High |
| 2.9.7 | Address Form | Reusable address form | Medium |
| 2.9.8 | Customer Select | Searchable customer dropdown | Medium |
| 2.9.9 | Product Select | Searchable product dropdown | Medium |
| 2.9.10 | Category Select | With tree hierarchy | Medium |

---

## 2.10 Phase 2 Testing

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 2.10.1 | Auth Flow E2E | Login → Dashboard → Logout | High |
| 2.10.2 | Products CRUD Test | Create, Read, Update, Delete | High |
| 2.10.3 | Categories CRUD Test | With parent-child relationships | High |
| 2.10.4 | Orders CRUD Test | Including status transitions | High |
| 2.10.5 | Customers CRUD Test | Including addresses | High |
| 2.10.6 | Media Upload Test | Single and multiple files | High |
| 2.10.7 | Admin CRUD Test | With role restrictions | High |
| 2.10.8 | Form Validation Test | All validation rules | Medium |
| 2.10.9 | Pagination Test | All list pages | Medium |
| 2.10.10 | Error Handling Test | API errors, validation errors | Medium |

### Testing Checklist
- [ ] All CRUD operations work for each module
- [ ] Form validations match API requirements
- [ ] Pagination works correctly
- [ ] Search and filters work
- [ ] Status updates with valid transitions
- [ ] File uploads work (single and multiple)
- [ ] Role-based access control works
- [ ] Error messages display correctly
- [ ] Success notifications show
- [ ] Data refreshes after mutations

---

# Phase 3: UI/UX Enhancement & Interactive Design

## 3.1 Design System Refinement

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.1.1 | Color Palette | Define primary, secondary, accent, status colors | High |
| 3.1.2 | Typography Scale | Heading, body, caption styles | High |
| 3.1.3 | Spacing System | Consistent padding/margin scale | High |
| 3.1.4 | Shadow System | Elevation levels | Medium |
| 3.1.5 | Border Radius | Consistent rounding | Medium |
| 3.1.6 | Dark Mode | Full dark mode support | Medium |

---

## 3.2 Enhanced Sidebar & Navigation

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.2.1 | Collapsible Sidebar | Expand/collapse with icons only mode | High |
| 3.2.2 | Active State Styling | Clear indication of current page | High |
| 3.2.3 | Submenu Support | Expandable menu groups | Medium |
| 3.2.4 | Sidebar Animations | Smooth transitions | Medium |
| 3.2.5 | Mobile Drawer | Slide-out drawer for mobile | High |
| 3.2.6 | Keyboard Navigation | Arrow keys, Enter to navigate | Low |

---

## 3.3 Dashboard Enhancements

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.3.1 | Animated Stats Cards | Count-up animations | Medium |
| 3.3.2 | Revenue Chart | Line/area chart with Recharts | High |
| 3.3.3 | Orders by Status Chart | Pie/donut chart | Medium |
| 3.3.4 | Recent Activity Feed | Timeline of recent actions | Medium |
| 3.3.5 | Quick Stats Comparison | vs. last week/month | Low |
| 3.3.6 | Dashboard Widgets | Customizable widget layout | Low |

---

## 3.4 Table Enhancements

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.4.1 | Column Visibility Toggle | Show/hide columns | Medium |
| 3.4.2 | Column Resizing | Drag to resize columns | Low |
| 3.4.3 | Row Selection UI | Checkbox with bulk action bar | High |
| 3.4.4 | Inline Editing | Edit cells inline (where applicable) | Medium |
| 3.4.5 | Row Hover Actions | Action buttons on hover | High |
| 3.4.6 | Skeleton Loading | Table skeleton during load | High |
| 3.4.7 | Empty State Design | Illustrated empty states | Medium |
| 3.4.8 | Export to CSV/Excel | Download data | Low |

---

## 3.5 Form Enhancements

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.5.1 | Floating Labels | Animated label transitions | Medium |
| 3.5.2 | Input Validation UI | Real-time validation feedback | High |
| 3.5.3 | Rich Text Editor | For product descriptions | High |
| 3.5.4 | Drag-Drop Image Upload | With preview and reorder | High |
| 3.5.5 | Image Crop/Resize | Before upload | Medium |
| 3.5.6 | Auto-save Draft | Save form progress | Low |
| 3.5.7 | Form Progress Indicator | Multi-step form progress | Medium |
| 3.5.8 | Keyboard Shortcuts | Ctrl+S to save, etc. | Low |

---

## 3.6 Modal & Dialog Enhancements

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.6.1 | Modal Animations | Slide/fade transitions | Medium |
| 3.6.2 | Drawer Component | Side panel for quick edits | High |
| 3.6.3 | Command Palette | Ctrl+K quick search/actions | Medium |
| 3.6.4 | Confirmation Variants | Warning, danger, info styles | Medium |
| 3.6.5 | Full-screen Modal | For complex forms | Low |

---

## 3.7 Status & Feedback Enhancements

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.7.1 | Toast Notifications | Success, error, info, warning | High |
| 3.7.2 | Progress Indicators | Upload progress, save progress | High |
| 3.7.3 | Optimistic Updates | Instant UI feedback | Medium |
| 3.7.4 | Error Boundaries | Graceful error UI | High |
| 3.7.5 | Offline Indicator | Connection status | Low |
| 3.7.6 | Undo Actions | Undo delete with toast | Low |

---

## 3.8 Interactive Features

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.8.1 | Drag-Drop Ordering | Reorder products, categories | Medium |
| 3.8.2 | Category Tree DnD | Drag to restructure tree | Low |
| 3.8.3 | Kanban Order Board | Orders by status columns | Medium |
| 3.8.4 | Quick View Panels | Preview without navigation | High |
| 3.8.5 | Bulk Edit Mode | Edit multiple items at once | Medium |
| 3.8.6 | Infinite Scroll Option | Alternative to pagination | Low |

---

## 3.9 Order-Specific Enhancements

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.9.1 | Order Timeline | Visual status progression | High |
| 3.9.2 | Status Transition UI | Clear allowed transitions | High |
| 3.9.3 | Print Order | Print-friendly order view | Medium |
| 3.9.4 | Order Summary Card | At-a-glance order info | Medium |
| 3.9.5 | Address Map Preview | Google Maps integration | Low |

---

## 3.10 Product-Specific Enhancements

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.10.1 | Image Gallery | Lightbox for product images | High |
| 3.10.2 | Stock Indicator | Visual stock level bar | Medium |
| 3.10.3 | Price Comparison | Show discount percentage | Medium |
| 3.10.4 | SEO Preview | Meta title/description preview | Medium |
| 3.10.5 | Variant Support UI | (If backend supports variants) | Low |

---

## 3.11 Responsive Design Polish

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.11.1 | Mobile Table Views | Cards or responsive tables | High |
| 3.11.2 | Touch-Friendly UI | Larger tap targets | High |
| 3.11.3 | Mobile Form Layout | Single column, optimized | High |
| 3.11.4 | Tablet Layout | Optimized for medium screens | Medium |
| 3.11.5 | Landscape Mobile | Handle orientation | Low |

---

## 3.12 Accessibility Improvements

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.12.1 | ARIA Labels | All interactive elements | High |
| 3.12.2 | Keyboard Navigation | Full keyboard support | High |
| 3.12.3 | Focus Indicators | Visible focus states | High |
| 3.12.4 | Screen Reader Support | Semantic HTML, labels | High |
| 3.12.5 | Color Contrast | WCAG AA compliance | Medium |
| 3.12.6 | Skip Links | Skip to main content | Low |

---

## 3.13 Performance Optimizations

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.13.1 | Image Optimization | Next.js Image component | High |
| 3.13.2 | Code Splitting | Dynamic imports for pages | High |
| 3.13.3 | Lazy Load Components | Below-fold content | Medium |
| 3.13.4 | Memoization | React.memo for expensive renders | Medium |
| 3.13.5 | Virtual Lists | For long lists | Low |
| 3.13.6 | Prefetching | Prefetch likely next pages | Low |

---

## 3.14 Phase 3 Testing

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.14.1 | Visual Regression Test | Screenshot comparisons | Medium |
| 3.14.2 | Animation Performance | No jank in transitions | High |
| 3.14.3 | Mobile Responsiveness | All breakpoints | High |
| 3.14.4 | Dark Mode Test | All components in dark mode | Medium |
| 3.14.5 | Accessibility Audit | Lighthouse, axe-core | High |
| 3.14.6 | Cross-Browser Test | Chrome, Firefox, Safari, Edge | High |
| 3.14.7 | Touch Device Test | iPad, mobile devices | Medium |

### Testing Checklist
- [ ] All animations are smooth (60fps)
- [ ] No layout shift during loading
- [ ] Dark mode works throughout
- [ ] Mobile experience is fully functional
- [ ] All interactive features work on touch
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Charts display correctly
- [ ] Drag-drop features work
- [ ] Print styles work for orders

---

# Phase 4: Comprehensive Testing & QA

## 4.1 Unit Testing

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.1.1 | Setup Jest + RTL | Configure testing environment | High |
| 4.1.2 | Utility Function Tests | Format, helpers, validators | High |
| 4.1.3 | Zod Schema Tests | All validation schemas | High |
| 4.1.4 | Hook Tests | Custom hooks with mock API | Medium |
| 4.1.5 | Store Tests | Zustand store actions | Medium |

---

## 4.2 Component Testing

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.2.1 | UI Component Tests | Button, Input, Card, etc. | High |
| 4.2.2 | Form Component Tests | All form types | High |
| 4.2.3 | Table Component Tests | Sorting, pagination, selection | High |
| 4.2.4 | Modal Component Tests | Open, close, actions | Medium |
| 4.2.5 | Layout Component Tests | Sidebar, header | Medium |

---

## 4.3 Integration Testing

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.3.1 | Auth Flow Integration | Login → Protected Route | High |
| 4.3.2 | Products CRUD Integration | Full workflow | High |
| 4.3.3 | Orders CRUD Integration | With status transitions | High |
| 4.3.4 | File Upload Integration | Upload → Display | High |
| 4.3.5 | Form Submission Integration | Validation → API → Response | High |

---

## 4.4 End-to-End Testing

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.4.1 | Setup Playwright/Cypress | E2E testing framework | High |
| 4.4.2 | Auth E2E | Login, logout, token refresh | High |
| 4.4.3 | Products E2E | Full CRUD journey | High |
| 4.4.4 | Categories E2E | With tree operations | High |
| 4.4.5 | Orders E2E | Create, status flow, complete | High |
| 4.4.6 | Customers E2E | With addresses | High |
| 4.4.7 | Admin Management E2E | Role-restricted actions | High |
| 4.4.8 | Media E2E | Upload, manage, delete | High |
| 4.4.9 | Cross-Page Navigation E2E | Full app navigation | Medium |

---

## 4.5 Performance Testing

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.5.1 | Lighthouse Audit | Performance score > 90 | High |
| 4.5.2 | Core Web Vitals | LCP, FID, CLS checks | High |
| 4.5.3 | Bundle Size Analysis | Identify large chunks | Medium |
| 4.5.4 | Load Time Testing | Page load times | Medium |
| 4.5.5 | Memory Leak Detection | Long session testing | Low |

---

## 4.6 Security Testing

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.6.1 | XSS Prevention | User input sanitization | High |
| 4.6.2 | CSRF Protection | Token handling | High |
| 4.6.3 | Auth Token Security | Storage, transmission | High |
| 4.6.4 | Role Bypass Testing | Attempt unauthorized access | High |
| 4.6.5 | Input Validation | Malicious input handling | Medium |

---

## 4.7 Accessibility Testing

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.7.1 | Automated A11y Audit | axe-core, Lighthouse | High |
| 4.7.2 | Keyboard-Only Navigation | Complete flows | High |
| 4.7.3 | Screen Reader Testing | NVDA, VoiceOver | High |
| 4.7.4 | Color Contrast Check | All text elements | Medium |
| 4.7.5 | Focus Management | Modal, navigation focus | Medium |

---

## 4.8 Cross-Browser & Device Testing

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.8.1 | Chrome Testing | Latest version | High |
| 4.8.2 | Firefox Testing | Latest version | High |
| 4.8.3 | Safari Testing | Latest version | High |
| 4.8.4 | Edge Testing | Latest version | Medium |
| 4.8.5 | Mobile Chrome/Safari | iOS & Android | High |
| 4.8.6 | Tablet Testing | iPad, Android tablet | Medium |

---

## 4.9 User Acceptance Testing (UAT)

### Tasks

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.9.1 | Admin User Scenarios | Common admin workflows | High |
| 4.9.2 | Super Admin Scenarios | Admin management workflows | High |
| 4.9.3 | Edge Cases | Error handling, empty states | Medium |
| 4.9.4 | Feedback Collection | Document issues found | High |
| 4.9.5 | Bug Fixes | Address UAT findings | High |

---

## 4.10 Pre-Launch Checklist

### Final Verification

- [ ] All CRUD operations work correctly
- [ ] Authentication flow is secure
- [ ] Role-based access is enforced
- [ ] All forms validate correctly
- [ ] Error messages are user-friendly
- [ ] Loading states are present
- [ ] Empty states are handled
- [ ] 404 pages work
- [ ] Responsive on all devices
- [ ] Dark mode works (if implemented)
- [ ] Accessibility standards met
- [ ] Performance benchmarks met
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Build completes without errors
- [ ] All tests pass

---

# Appendix

## A. Dependency List

```json
{
  "dependencies": {
    "next": "^14.x",
    "@tanstack/react-query": "^5.x",
    "@tanstack/react-table": "^8.x",
    "axios": "^1.x",
    "zustand": "^4.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^3.x",
    "date-fns": "^3.x",
    "recharts": "^2.x",
    "lucide-react": "^0.x",
    "sonner": "^1.x",
    "class-variance-authority": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@types/node": "^20.x",
    "@types/react": "^18.x",
    "eslint": "^8.x",
    "prettier": "^3.x",
    "@playwright/test": "^1.x",
    "jest": "^29.x",
    "@testing-library/react": "^14.x"
  }
}
```

## B. API Endpoints Quick Reference

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/login`, `POST /auth/refresh` |
| Profile | `GET /profile`, `PUT /profile/password` |
| Admins | `GET/POST /admins`, `GET/PUT/DELETE /admins/:id` |
| Dashboard | `GET /dashboard/stats` |
| Products | `GET/POST /products`, `GET/PUT/DELETE /products/:id`, `PATCH /products/:id/stock` |
| Categories | `GET/POST /categories`, `GET /categories/tree`, `GET/PUT/DELETE /categories/:id` |
| Orders | `GET/POST /orders`, `GET/PUT/DELETE /orders/:id`, `PATCH /orders/:id/status` |
| Customers | `GET/POST /customers`, `GET/PUT/DELETE /customers/:id`, addresses sub-routes |
| Media | `POST /media/upload`, `POST /media/upload/multiple`, `GET/PUT/DELETE /media/:id` |

## C. Estimated Timeline

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | 1-2 weeks | Foundation, architecture, base components |
| Phase 2 | 3-4 weeks | All feature implementation |
| Phase 3 | 2-3 weeks | UI/UX enhancement, polish |
| Phase 4 | 1-2 weeks | Comprehensive testing |
| **Total** | **7-11 weeks** | Complete admin panel |

---

*Document Version: 1.0*  
*Created: December 2024*  
*Project: E-commerce Admin Panel Frontend*
