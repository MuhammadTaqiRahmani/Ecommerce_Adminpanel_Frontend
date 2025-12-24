'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
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
import {
  Order,
  OrderStatus,
  orderStatusLabels,
  orderStatusColors,
  paymentStatusLabels,
  paymentStatusColors,
  getAvailableTransitions,
} from '@/types/order';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import Link from 'next/link';

interface OrderColumnsProps {
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

export function getOrderColumns({ onStatusChange }: OrderColumnsProps): ColumnDef<Order>[] {
  return [
    {
      accessorKey: 'order_number',
      header: 'Order #',
      cell: ({ row }) => (
        <Link
          href={`/orders/${row.original.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {row.getValue('order_number')}
        </Link>
      ),
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => {
        const customer = row.original.customer;
        return (
          <div>
            <div className="font-medium">
              {customer?.first_name} {customer?.last_name}
            </div>
            <div className="text-sm text-muted-foreground">{customer?.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as OrderStatus;
        return (
          <Badge className={orderStatusColors[status]}>
            {orderStatusLabels[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'payment_status',
      header: 'Payment',
      cell: ({ row }) => {
        const status = row.original.payment_status;
        return (
          <Badge className={paymentStatusColors[status]}>
            {paymentStatusLabels[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'total_amount',
      header: 'Total',
      cell: ({ row }) => (
        <span className="font-medium">{formatCurrency(row.getValue('total_amount'))}</span>
      ),
    },
    {
      accessorKey: 'items',
      header: 'Items',
      cell: ({ row }) => {
        const items = row.original.items || [];
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        return <span>{totalQuantity} item(s)</span>;
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => formatDateTime(row.getValue('created_at')),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const order = row.original;
        const availableTransitions = getAvailableTransitions(order.status);

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
                <Link href={`/orders/${order.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>

              {availableTransitions.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Update Status
                  </DropdownMenuLabel>
                  
                  {availableTransitions.includes('confirmed') && (
                    <DropdownMenuItem onClick={() => onStatusChange(order.id, 'confirmed')}>
                      <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                      Confirm Order
                    </DropdownMenuItem>
                  )}
                  
                  {availableTransitions.includes('processing') && (
                    <DropdownMenuItem onClick={() => onStatusChange(order.id, 'processing')}>
                      <Package className="mr-2 h-4 w-4 text-purple-600" />
                      Start Processing
                    </DropdownMenuItem>
                  )}
                  
                  {availableTransitions.includes('shipped') && (
                    <DropdownMenuItem onClick={() => onStatusChange(order.id, 'shipped')}>
                      <Truck className="mr-2 h-4 w-4 text-indigo-600" />
                      Mark as Shipped
                    </DropdownMenuItem>
                  )}
                  
                  {availableTransitions.includes('delivered') && (
                    <DropdownMenuItem onClick={() => onStatusChange(order.id, 'delivered')}>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      Mark as Delivered
                    </DropdownMenuItem>
                  )}
                  
                  {availableTransitions.includes('cancelled') && (
                    <DropdownMenuItem onClick={() => onStatusChange(order.id, 'cancelled')}>
                      <XCircle className="mr-2 h-4 w-4 text-red-600" />
                      Cancel Order
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
