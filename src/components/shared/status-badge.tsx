import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        purple: 'bg-purple-100 text-purple-800',
        indigo: 'bg-indigo-100 text-indigo-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ children, variant, className }: StatusBadgeProps) {
  return <span className={cn(statusBadgeVariants({ variant }), className)}>{children}</span>;
}

// Order Status Badge
type OrderStatusType = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

const orderStatusVariants: Record<OrderStatusType, VariantProps<typeof statusBadgeVariants>['variant']> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'purple',
  shipped: 'indigo',
  delivered: 'success',
  cancelled: 'error',
  refunded: 'default',
};

const orderStatusLabels: Record<OrderStatusType, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export function OrderStatusBadge({ status, className }: { status: OrderStatusType; className?: string }) {
  return (
    <StatusBadge variant={orderStatusVariants[status]} className={className}>
      {orderStatusLabels[status]}
    </StatusBadge>
  );
}

// Payment Status Badge
type PaymentStatusType = 'pending' | 'paid' | 'failed' | 'refunded';

const paymentStatusVariants: Record<PaymentStatusType, VariantProps<typeof statusBadgeVariants>['variant']> = {
  pending: 'warning',
  paid: 'success',
  failed: 'error',
  refunded: 'default',
};

const paymentStatusLabels: Record<PaymentStatusType, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
};

export function PaymentStatusBadge({ status, className }: { status: PaymentStatusType; className?: string }) {
  return (
    <StatusBadge variant={paymentStatusVariants[status]} className={className}>
      {paymentStatusLabels[status]}
    </StatusBadge>
  );
}

// Product Status Badge
type ProductStatusType = 'draft' | 'active' | 'archived';

const productStatusVariants: Record<ProductStatusType, VariantProps<typeof statusBadgeVariants>['variant']> = {
  draft: 'warning',
  active: 'success',
  archived: 'default',
};

const productStatusLabels: Record<ProductStatusType, string> = {
  draft: 'Draft',
  active: 'Active',
  archived: 'Archived',
};

export function ProductStatusBadge({ status, className }: { status: ProductStatusType; className?: string }) {
  return (
    <StatusBadge variant={productStatusVariants[status]} className={className}>
      {productStatusLabels[status]}
    </StatusBadge>
  );
}

// Active/Inactive Badge
export function ActiveBadge({ active, className }: { active: boolean; className?: string }) {
  return (
    <StatusBadge variant={active ? 'success' : 'default'} className={className}>
      {active ? 'Active' : 'Inactive'}
    </StatusBadge>
  );
}

// Role Badge
type AdminRoleType = 'super_admin' | 'admin' | 'moderator';

const roleVariants: Record<AdminRoleType, VariantProps<typeof statusBadgeVariants>['variant']> = {
  super_admin: 'purple',
  admin: 'info',
  moderator: 'default',
};

const roleLabels: Record<AdminRoleType, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
};

export function RoleBadge({ role, className }: { role: AdminRoleType; className?: string }) {
  return (
    <StatusBadge variant={roleVariants[role]} className={className}>
      {roleLabels[role]}
    </StatusBadge>
  );
}
