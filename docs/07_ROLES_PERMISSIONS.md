# Roles & Permissions Documentation

## Admin Roles

The system has three hierarchical admin roles:

| Role | Level | Description |
|------|-------|-------------|
| `super_admin` | Highest | Full system access |
| `admin` | Middle | Most management operations |
| `moderator` | Lowest | Limited management operations |

---

## Role Hierarchy

```
super_admin
    └── admin
         └── moderator
```

Higher roles inherit all permissions from lower roles.

---

## Permissions by Endpoint

### Public (No Auth Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/uploads/*` | GET | Static file access |
| `/auth/login` | POST | Admin login |

### Any Authenticated Admin

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/profile` | GET | Get own profile |
| `/profile/password` | PUT | Change own password |
| `/dashboard/stats` | GET | View dashboard |
| `/categories/*` | ALL | Full category management |
| `/products/*` | ALL | Full product management |
| `/customers/*` | ALL | Full customer management |
| `/orders/*` | ALL | Full order management |
| `/media/*` | ALL | Full media management |

### Super Admin Only

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admins` | GET | List all admins |
| `/admins` | POST | Create new admin |
| `/admins/:id` | GET | View admin details |
| `/admins/:id` | PUT | Update admin |
| `/admins/:id` | DELETE | Delete admin |

---

## Role-Based UI Recommendations

### Super Admin Dashboard
- Full admin management section
- User activity logs
- System settings
- All other sections

### Admin Dashboard
- Product management
- Category management
- Customer management
- Order management
- Media management

### Moderator Dashboard
- Product management
- Category management
- Customer management
- Order management
- Media management

---

## Checking User Role in Frontend

```typescript
interface AdminResponse {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  is_active: boolean;
  // ...
}

// Role checking utilities
const isSuperAdmin = (admin: AdminResponse) => admin.role === 'super_admin';
const isAdmin = (admin: AdminResponse) => admin.role === 'admin';
const isModerator = (admin: AdminResponse) => admin.role === 'moderator';

const isAdminOrAbove = (admin: AdminResponse) => 
  ['super_admin', 'admin'].includes(admin.role);

const hasAdminAccess = (admin: AdminResponse) => 
  ['super_admin', 'admin', 'moderator'].includes(admin.role);
```

---

## Protected Route Component

```tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'moderator';
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { admin, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!admin) {
    return <Navigate to="/login" />;
  }
  
  if (!admin.is_active) {
    return <Navigate to="/account-disabled" />;
  }
  
  if (requiredRole && !hasRequiredRole(admin.role, requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
}

function hasRequiredRole(
  userRole: string, 
  requiredRole: string
): boolean {
  const roleHierarchy = ['moderator', 'admin', 'super_admin'];
  const userLevel = roleHierarchy.indexOf(userRole);
  const requiredLevel = roleHierarchy.indexOf(requiredRole);
  return userLevel >= requiredLevel;
}
```

---

## Menu Configuration by Role

```typescript
interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles: string[]; // Empty = all roles
}

const menuItems: MenuItem[] = [
  { 
    label: 'Dashboard', 
    path: '/dashboard', 
    icon: 'home',
    roles: [] 
  },
  { 
    label: 'Products', 
    path: '/products', 
    icon: 'package',
    roles: [] 
  },
  { 
    label: 'Categories', 
    path: '/categories', 
    icon: 'folder',
    roles: [] 
  },
  { 
    label: 'Orders', 
    path: '/orders', 
    icon: 'shopping-cart',
    roles: [] 
  },
  { 
    label: 'Customers', 
    path: '/customers', 
    icon: 'users',
    roles: [] 
  },
  { 
    label: 'Media', 
    path: '/media', 
    icon: 'image',
    roles: [] 
  },
  { 
    label: 'Admin Users', 
    path: '/admins', 
    icon: 'shield',
    roles: ['super_admin'] 
  },
];

function getMenuForRole(role: string): MenuItem[] {
  return menuItems.filter(item => 
    item.roles.length === 0 || item.roles.includes(role)
  );
}
```

---

## Permission Error Handling

When a non-super_admin tries to access admin endpoints:

```json
{
  "success": false,
  "message": "Forbidden",
  "error": "Insufficient permissions",
  "timestamp": 1705315800
}
```

**HTTP Status:** 403 Forbidden

### Frontend Handling

```typescript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      // Show access denied message
      toast.error('You do not have permission to perform this action');
      // Optionally redirect
      // router.push('/dashboard');
    }
    return Promise.reject(error);
  }
);
```

---

## Role Display in UI

```typescript
const roleDisplayNames: Record<string, string> = {
  'super_admin': 'Super Admin',
  'admin': 'Administrator',
  'moderator': 'Moderator',
};

const roleColors: Record<string, string> = {
  'super_admin': 'red',    // Highest privilege
  'admin': 'blue',
  'moderator': 'green',
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`badge badge-${roleColors[role]}`}>
      {roleDisplayNames[role]}
    </span>
  );
}
```
