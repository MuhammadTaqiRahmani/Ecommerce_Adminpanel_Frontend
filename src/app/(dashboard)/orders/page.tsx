'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Package, Filter, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { DataTable } from '@/components/tables/data-table';
import { PageLoading } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { getOrderColumns } from '@/components/tables/columns/order-columns';
import { OrderStatusDialog } from '@/components/modals/order-status-dialog';
import { useOrders, useOrderStats, useUpdateOrderStatus } from '@/lib/hooks/use-orders';
import {
  OrderStatus,
  PaymentStatus,
  OrderStatuses,
  PaymentStatuses,
  orderStatusLabels,
  paymentStatusLabels,
} from '@/types/order';
import { formatCurrency } from '@/lib/utils/format';

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState<OrderStatus | 'all'>(
    (searchParams.get('status') as OrderStatus) || 'all'
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | 'all'>(
    (searchParams.get('payment_status') as PaymentStatus) || 'all'
  );
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Status change dialog
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    orderId: string;
    currentStatus: OrderStatus;
    newStatus: OrderStatus;
  }>({
    open: false,
    orderId: '',
    currentStatus: 'pending',
    newStatus: 'confirmed',
  });

  // Build query params
  const queryParams = {
    page,
    limit: 10,
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
    payment_status: paymentStatus !== 'all' ? paymentStatus : undefined,
  };

  const { data: ordersResponse, isLoading, refetch } = useOrders(queryParams);
  const { data: statsResponse } = useOrderStats();
  const updateStatusMutation = useUpdateOrderStatus();

  const orders = ordersResponse?.data || [];
  const pagination = ordersResponse?.pagination;
  const stats = statsResponse?.data;

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setStatusDialog({
        open: true,
        orderId,
        currentStatus: order.status,
        newStatus,
      });
    }
  };

  const handleConfirmStatusChange = (orderId: string, status: OrderStatus, notes: string) => {
    updateStatusMutation.mutate(
      { id: orderId, data: { status, notes } },
      {
        onSuccess: () => {
          setStatusDialog((prev) => ({ ...prev, open: false }));
          refetch();
        },
      }
    );
  };

  const columns = getOrderColumns({ onStatusChange: handleStatusChange });

  // Update URL with filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status !== 'all') params.set('status', status);
    if (paymentStatus !== 'all') params.set('payment_status', paymentStatus);
    params.set('page', '1');
    router.push(`/orders?${params.toString()}`);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setPaymentStatus('all');
    setPage(1);
    router.push('/orders');
  };

  if (isLoading) {
    return <PageLoading message="Loading orders..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Manage customer orders and fulfillment"
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.processing}</div>
              <p className="text-sm text-muted-foreground">Processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.total_revenue)}
              </div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>

            <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.values(OrderStatuses).map((s) => (
                  <SelectItem key={s} value={s}>
                    {orderStatusLabels[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={paymentStatus}
              onValueChange={(value) => setPaymentStatus(value as PaymentStatus | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                {Object.values(PaymentStatuses).map((s) => (
                  <SelectItem key={s} value={s}>
                    {paymentStatusLabels[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={applyFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Apply
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders found"
          description={
            search || status !== 'all' || paymentStatus !== 'all'
              ? 'Try adjusting your filters to find what you\'re looking for.'
              : 'Orders will appear here when customers place them.'
          }
          action={
            search || status !== 'all' || paymentStatus !== 'all' ? (
              <Button onClick={clearFilters}>Clear Filters</Button>
            ) : undefined
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={orders}
              pageCount={pagination?.total_pages}
              pageIndex={page - 1}
              onPaginationChange={(pageIndex) => setPage(pageIndex + 1)}
            />
          </CardContent>
        </Card>
      )}

      {/* Status Change Dialog */}
      <OrderStatusDialog
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog((prev) => ({ ...prev, open }))}
        orderId={statusDialog.orderId}
        currentStatus={statusDialog.currentStatus}
        newStatus={statusDialog.newStatus}
        onConfirm={handleConfirmStatusChange}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
