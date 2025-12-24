'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Users, Filter, RefreshCw, UserPlus } from 'lucide-react';
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
import { getCustomerColumns } from '@/components/tables/columns/customer-columns';
import { useCustomers, useCustomerStats, useUpdateCustomerStatus } from '@/lib/hooks/use-customers';
import Link from 'next/link';

export default function CustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeFilter, setActiveFilter] = useState<string>(
    searchParams.get('is_active') || 'all'
  );
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Build query params
  const queryParams = {
    page,
    limit: 10,
    search: search || undefined,
    is_active: activeFilter !== 'all' ? activeFilter === 'true' : undefined,
  };

  const { data: customersResponse, isLoading, refetch } = useCustomers(queryParams);
  const { data: statsResponse } = useCustomerStats();
  const updateStatusMutation = useUpdateCustomerStatus();

  const customers = customersResponse?.data || [];
  const pagination = customersResponse?.pagination;
  const stats = statsResponse?.data;

  const handleStatusChange = (customerId: string, isActive: boolean) => {
    updateStatusMutation.mutate(
      { id: customerId, data: { is_active: isActive } },
      {
        onSuccess: () => refetch(),
      }
    );
  };

  const columns = getCustomerColumns({ onStatusChange: handleStatusChange });

  // Update URL with filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (activeFilter !== 'all') params.set('is_active', activeFilter);
    params.set('page', '1');
    router.push(`/customers?${params.toString()}`);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setActiveFilter('all');
    setPage(1);
    router.push('/customers');
  };

  if (isLoading) {
    return <PageLoading message="Loading customers..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer base and their information"
        action={{
          label: 'Add Customer',
          href: '/customers/new',
          icon: UserPlus,
        }}
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
              <p className="text-sm text-muted-foreground">Verified</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.new_this_month}</div>
              <p className="text-sm text-muted-foreground">New This Month</p>
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
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>

            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
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

      {/* Customers Table */}
      {customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers found"
          description={
            search || activeFilter !== 'all'
              ? 'Try adjusting your filters to find what you\'re looking for.'
              : 'Customers will appear here when they sign up.'
          }
          action={
            search || activeFilter !== 'all' ? (
              <Button onClick={clearFilters}>Clear Filters</Button>
            ) : (
              <Button asChild>
                <Link href="/customers/new">Add Customer</Link>
              </Button>
            )
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={customers}
              pageCount={pagination?.total_pages}
              pageIndex={page - 1}
              onPaginationChange={(pageIndex) => setPage(pageIndex + 1)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
