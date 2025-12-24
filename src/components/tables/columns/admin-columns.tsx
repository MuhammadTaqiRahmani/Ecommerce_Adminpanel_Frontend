'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Power, Trash2, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Admin, AdminRole, roleLabels } from '@/types/admin';
import { formatDateTime } from '@/lib/utils/format';
import Link from 'next/link';

interface AdminColumnsProps {
  currentAdminId: string;
  onStatusChange: (adminId: string, isActive: boolean) => void;
  onDelete: (admin: Admin) => void;
}

const roleIcons: Record<AdminRole, React.ElementType> = {
  super_admin: ShieldAlert,
  admin: ShieldCheck,
  moderator: Shield,
};

const roleBadgeColors: Record<AdminRole, string> = {
  super_admin: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800',
  moderator: 'bg-gray-100 text-gray-800',
};

export function getAdminColumns({
  currentAdminId,
  onStatusChange,
  onDelete,
}: AdminColumnsProps): ColumnDef<Admin>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const admin = row.original;
        const RoleIcon = roleIcons[admin.role];
        return (
          <div className="flex items-center gap-2">
            <RoleIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{admin.name}</div>
              <div className="text-sm text-muted-foreground">{admin.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as AdminRole;
        return (
          <Badge className={roleBadgeColors[role]}>
            {roleLabels[role]}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active') as boolean;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'last_login',
      header: 'Last Login',
      cell: ({ row }) => {
        const date = row.getValue('last_login') as string | null;
        return date ? (
          <span className="text-sm">{formatDateTime(date)}</span>
        ) : (
          <span className="text-muted-foreground">Never</span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm">{formatDateTime(row.getValue('created_at'))}</span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const admin = row.original;
        const isSelf = admin.id === currentAdminId;
        const isSuperAdmin = admin.role === 'super_admin';

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/admins/${admin.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {!isSelf && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onStatusChange(admin.id, !admin.is_active)}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    {admin.is_active ? 'Deactivate' : 'Activate'}
                  </DropdownMenuItem>
                  {!isSuperAdmin && (
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(admin)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
