'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, UserPlus, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { DataTable } from '@/components/tables/data-table';
import { PageLoading } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { DeleteDialog } from '@/components/modals/delete-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAdminColumns } from '@/components/tables/columns/admin-columns';
import { useAdmins, useUpdateAdmin, useDeleteAdmin } from '@/lib/hooks/use-admins';
import { useAuthStore } from '@/store/auth-store';
import { Admin } from '@/types/admin';
import Link from 'next/link';

export default function AdminsPage() {
  const router = useRouter();
  const { admin: currentAdmin } = useAuthStore();

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; admin: Admin | null }>({
    open: false,
    admin: null,
  });
  const [page, setPage] = useState(1);

  const { data: adminsResponse, isLoading, refetch } = useAdmins({ page, limit: 10 });
  const updateMutation = useUpdateAdmin();
  const deleteMutation = useDeleteAdmin();

  const admins = adminsResponse?.data || [];
  const pagination = adminsResponse?.pagination;

  // Check if current user is super admin
  const isSuperAdmin = currentAdmin?.role === 'super_admin';

  const handleStatusChange = (adminId: string, isActive: boolean) => {
    updateMutation.mutate(
      { id: adminId, data: { is_active: isActive } },
      { onSuccess: () => refetch() }
    );
  };

  const handleDelete = (admin: Admin) => {
    setDeleteDialog({ open: true, admin });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.admin) return;
    await deleteMutation.mutateAsync(deleteDialog.admin.id);
    setDeleteDialog({ open: false, admin: null });
    refetch();
  };

  const columns = getAdminColumns({
    currentAdminId: currentAdmin?.id || '',
    onStatusChange: handleStatusChange,
    onDelete: handleDelete,
  });

  if (isLoading) {
    return <PageLoading message="Loading admins..." />;
  }

  // Only super admins can access this page
  if (!isSuperAdmin) {
    return (
      <EmptyState
        icon={Shield}
        title="Access Denied"
        description="Only Super Admins can manage administrators."
        action={{ label: 'Go to Dashboard', onClick: () => router.push('/dashboard') }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrators"
        description="Manage admin accounts and their roles"
        action={{
          label: 'Add Admin',
          href: '/admins/new',
          icon: UserPlus,
        }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{admins.length}</div>
            <p className="text-sm text-muted-foreground">Total Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {admins.filter((a) => a.is_active).length}
            </div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {admins.filter((a) => a.role === 'super_admin').length}
            </div>
            <p className="text-sm text-muted-foreground">Super Admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Admins Table */}
      {admins.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No administrators"
          description="Add your first administrator to get started."
          action={{ label: 'Add Admin', onClick: () => router.push('/admins/new') }}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={admins}
              pageCount={pagination?.total_pages}
              pageIndex={page - 1}
              onPaginationChange={(pageIndex) => setPage(pageIndex + 1)}
            />
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, admin: null })}
        onConfirm={confirmDelete}
        title="Delete Administrator"
        description={`Are you sure you want to delete "${deleteDialog.admin?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
