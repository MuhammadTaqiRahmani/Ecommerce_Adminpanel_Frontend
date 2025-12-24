'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { PageLoading } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OrderStatusDialog } from '@/components/modals/order-status-dialog';
import { useOrder, useOrderHistory, useUpdateOrderStatus } from '@/lib/hooks/use-orders';
import {
  OrderStatus,
  OrderAddress,
  orderStatusLabels,
  orderStatusColors,
  paymentStatusLabels,
  paymentStatusColors,
  getAvailableTransitions,
} from '@/types/order';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import Link from 'next/link';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: orderResponse, isLoading, refetch } = useOrder(id);
  const { data: historyResponse } = useOrderHistory(id);
  const updateStatusMutation = useUpdateOrderStatus();

  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    newStatus: OrderStatus;
  }>({
    open: false,
    newStatus: 'confirmed',
  });

  const order = orderResponse?.data;
  const history = historyResponse?.data || [];

  const handleStatusChange = (newStatus: OrderStatus) => {
    setStatusDialog({
      open: true,
      newStatus,
    });
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

  if (isLoading) {
    return <PageLoading message="Loading order details..." />;
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Order not found</h2>
        <p className="text-muted-foreground mb-4">
          The order you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button onClick={() => router.push('/orders')}>Back to Orders</Button>
      </div>
    );
  }

  const availableTransitions = getAvailableTransitions(order.status);

  const AddressCard = ({
    title,
    address,
    icon: Icon,
  }: {
    title: string;
    address: OrderAddress;
    icon: React.ElementType;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <p className="font-medium">
          {address.first_name} {address.last_name}
        </p>
        {address.company && <p>{address.company}</p>}
        <p>{address.address_line1}</p>
        {address.address_line2 && <p>{address.address_line2}</p>}
        <p>
          {address.city}, {address.state} {address.postal_code}
        </p>
        <p>{address.country}</p>
        {address.phone && <p className="mt-2">Phone: {address.phone}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/orders')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={`Order ${order.order_number}`}
          description={`Placed on ${formatDateTime(order.created_at)}`}
        />
      </div>

      {/* Status and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Status</p>
                <Badge className={orderStatusColors[order.status]}>
                  {orderStatusLabels[order.status]}
                </Badge>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                <Badge className={paymentStatusColors[order.payment_status]}>
                  {paymentStatusLabels[order.payment_status]}
                </Badge>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <span className="font-medium">{order.payment_method || 'N/A'}</span>
              </div>
            </div>

            {availableTransitions.length > 0 && (
              <div className="flex gap-2">
                {availableTransitions.includes('confirmed') && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange('confirmed')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                )}
                {availableTransitions.includes('processing') && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange('processing')}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Process
                  </Button>
                )}
                {availableTransitions.includes('shipped') && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange('shipped')}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Ship
                  </Button>
                )}
                {availableTransitions.includes('delivered') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange('delivered')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Deliver
                  </Button>
                )}
                {availableTransitions.includes('cancelled') && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleStatusChange('cancelled')}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Items */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <Link
                            href={`/products/${item.product_id}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {item.product_name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.product_sku}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(order.tax_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(order.shipping_amount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground text-sm">No history available</p>
              ) : (
                <div className="space-y-4">
                  {history.map((entry, index) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        {index < history.length - 1 && (
                          <div className="absolute top-4 left-1/2 w-px h-full -translate-x-1/2 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium">
                          Status changed from {orderStatusLabels[entry.from_status as OrderStatus]}{' '}
                          to {orderStatusLabels[entry.to_status as OrderStatus]}
                        </p>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateTime(entry.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer and Addresses */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <Link
                href={`/customers/${order.customer_id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {order.customer?.first_name} {order.customer?.last_name}
              </Link>
              <p className="text-muted-foreground">{order.customer?.email}</p>
              {order.customer?.phone && <p className="mt-1">{order.customer?.phone}</p>}
            </CardContent>
          </Card>

          {/* Addresses */}
          <AddressCard
            title="Shipping Address"
            address={order.shipping_address}
            icon={Truck}
          />
          <AddressCard
            title="Billing Address"
            address={order.billing_address}
            icon={CreditCard}
          />

          {/* Notes */}
          {(order.notes || order.internal_notes) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4">
                {order.notes && (
                  <div>
                    <p className="font-medium mb-1">Customer Notes</p>
                    <p className="text-muted-foreground">{order.notes}</p>
                  </div>
                )}
                {order.internal_notes && (
                  <div>
                    <p className="font-medium mb-1">Internal Notes</p>
                    <p className="text-muted-foreground">{order.internal_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Status Change Dialog */}
      <OrderStatusDialog
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog((prev) => ({ ...prev, open }))}
        orderId={order.id}
        currentStatus={order.status}
        newStatus={statusDialog.newStatus}
        onConfirm={handleConfirmStatusChange}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
