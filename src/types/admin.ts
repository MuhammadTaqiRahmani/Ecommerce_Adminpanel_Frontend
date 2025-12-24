// Admin Role Types
export type AdminRole = 'super_admin' | 'admin' | 'moderator';

export const AdminRoles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;

// Admin Entity
export interface Admin {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

// Admin Request Types
export interface CreateAdminRequest {
  email: string;
  password: string;
  name: string;
  role: AdminRole;
}

export interface UpdateAdminRequest {
  email?: string;
  name?: string;
  role?: AdminRole;
  is_active?: boolean;
}

// Role Helpers
export function isSuperAdmin(admin: Admin): boolean {
  return admin.role === 'super_admin';
}

export function isAdminOrAbove(admin: Admin): boolean {
  return ['super_admin', 'admin'].includes(admin.role);
}

export function hasRequiredRole(userRole: AdminRole, requiredRole: AdminRole): boolean {
  const roleHierarchy: AdminRole[] = ['moderator', 'admin', 'super_admin'];
  const userLevel = roleHierarchy.indexOf(userRole);
  const requiredLevel = roleHierarchy.indexOf(requiredRole);
  return userLevel >= requiredLevel;
}

export const roleLabels: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
};
