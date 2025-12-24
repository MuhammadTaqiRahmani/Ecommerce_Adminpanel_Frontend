'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit, Power, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Customer, getCustomerFullName } from '@/types/customer';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import Link from 'next/link';

interface CustomerColumnsProps {
  onStatusChange: (customerId: string, isActive: boolean) => void;
}

export function getCustomerColumns({
  onStatusChange,
}: CustomerColumnsProps): ColumnDef<Customer>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Customer',
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div>
            <Link
              href={`/customers/${customer.id}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {getCustomerFullName(customer)}
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              {customer.email}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string;
        return phone ? (
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-3 w-3" />
            {phone}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active') as boolean;
        const isVerified = row.original.is_verified;
        return (
          <div className="flex flex-col gap-1">
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
            {isVerified && (
              <Badge variant="outline" className="text-green-600">
                Verified
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'total_orders',
      header: 'Orders',
      cell: ({ row }) => <span>{row.getValue('total_orders')}</span>,
    },
    {
      accessorKey: 'total_spent',
      header: 'Total Spent',
      cell: ({ row }) => (
        <span className="font-medium">
          {formatCurrency(row.getValue('total_spent'))}
        </span>
      ),
    },
    {
      accessorKey: 'last_order_at',
      header: 'Last Order',
      cell: ({ row }) => {
        const date = row.getValue('last_order_at') as string | null;
        return date ? (
          <span className="text-sm">{formatDateTime(date)}</span>
        ) : (
          <span className="text-muted-foreground">Never</span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Joined',
      cell: ({ row }) => (
        <span className="text-sm">{formatDateTime(row.getValue('created_at'))}</span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const customer = row.original;

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
                <Link href={`/customers/${customer.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/customers/${customer.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onStatusChange(customer.id, !customer.is_active)}
              >
                <Power className="mr-2 h-4 w-4" />
                {customer.is_active ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
