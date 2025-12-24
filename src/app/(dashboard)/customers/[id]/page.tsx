'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  DollarSign,
  Edit,
  Power,
  Check,
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
import { useCustomer, useUpdateCustomerStatus } from '@/lib/hooks/use-customers';
import { useCustomerOrders } from '@/lib/hooks/use-orders';
import { getCustomerFullName, formatAddress, Address } from '@/types/customer';
import { orderStatusLabels, orderStatusColors } from '@/types/order';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import Link from 'next/link';

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: customerResponse, isLoading, refetch } = useCustomer(id);
  const { data: ordersResponse } = useCustomerOrders(id, { limit: 5 });
  const updateStatusMutation = useUpdateCustomerStatus();

  const customer = customerResponse?.data;
  const orders = ordersResponse?.data || [];

  const handleToggleStatus = () => {
    if (!customer) return;
    updateStatusMutation.mutate(
      { id: customer.id, data: { is_active: !customer.is_active } },
      { onSuccess: () => refetch() }
    );
  };

  if (isLoading) {
    return <PageLoading message="Loading customer details..." />;
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Users className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Customer not found</h2>
        <p className="text-muted-foreground mb-4">
          The customer you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button onClick={() => router.push('/customers')}>Back to Customers</Button>
      </div>
    );
  }

  const AddressCard = ({ address, title }: { address: Address; title: string }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {title}
          </span>
          {address.is_default && (
            <Badge variant="outline">Default</Badge>
          )}
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

  const shippingAddresses = customer.addresses?.filter(a => a.type === 'shipping') || [];
  const billingAddresses = customer.addresses?.filter(a => a.type === 'billing') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/customers')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={getCustomerFullName(customer)}
          description={customer.email}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{customer.total_orders}</div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(customer.total_spent)}</div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-medium">
                {customer.last_order_at ? formatDateTime(customer.last_order_at) : 'Never'}
              </div>
              <p className="text-sm text-muted-foreground">Last Order</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded-full">
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm font-medium">{formatDateTime(customer.created_at)}</div>
              <p className="text-sm text-muted-foreground">Joined</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Info and Recent Orders */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/customers/${customer.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant={customer.is_active ? 'secondary' : 'default'}
                  size="sm"
                  onClick={handleToggleStatus}
                  disabled={updateStatusMutation.isPending}
                >
                  <Power className="mr-2 h-4 w-4" />
                  {customer.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{getCustomerFullName(customer)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
                {customer.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <div className="flex gap-2">
                    <Badge variant={customer.is_active ? 'default' : 'secondary'}>
                      {customer.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {customer.is_verified && (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                {customer.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{customer.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/orders?customer_id=${customer.id}`}>View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No orders yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {order.order_number}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge className={orderStatusColors[order.status]}>
                            {orderStatusLabels[order.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDateTime(order.created_at)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(order.total_amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Addresses */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Shipping Addresses</h3>
            {shippingAddresses.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                  No shipping addresses
                </CardContent>
              </Card>
            ) : (
              shippingAddresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  title="Shipping"
                />
              ))
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Billing Addresses</h3>
            {billingAddresses.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                  No billing addresses
                </CardContent>
              </Card>
            ) : (
              billingAddresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  title="Billing"
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
