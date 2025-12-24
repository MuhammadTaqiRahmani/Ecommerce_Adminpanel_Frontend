'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/tables/data-table';
import { getProductColumns } from '@/components/tables/columns/product-columns';
import { DeleteDialog } from '@/components/modals/delete-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { useProducts, useDeleteProduct } from '@/lib/hooks/use-products';
import { Product } from '@/types/product';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const { data: response, isLoading, error } = useProducts({ page, limit: pageSize });
  const deleteMutation = useDeleteProduct();

  const products = response?.data || [];
  const pagination = response?.pagination;

  const handleDelete = async () => {
    if (!deleteProduct) return;
    await deleteMutation.mutateAsync(deleteProduct.id);
    setDeleteProduct(null);
  };

  const columns = getProductColumns({
    onDelete: setDeleteProduct,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Products" />
        <Card>
          <CardContent className="py-10">
            <EmptyState
              title="Error loading products"
              description="There was a problem loading the products. Please try again."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        action={{
          label: 'Add Product',
          href: '/products/new',
          icon: Plus,
        }}
      />

      <Card>
        <CardContent className="pt-6">
          {products.length === 0 ? (
            <EmptyState
              title="No products yet"
              description="Get started by creating your first product."
              action={
                <Button asChild>
                  <Link href="/products/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Link>
                </Button>
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={products}
              searchKey="name"
              searchPlaceholder="Search products..."
              pageSize={pageSize}
              pageCount={pagination?.total_pages || 1}
              pageIndex={page - 1}
              onPaginationChange={(newPageIndex, newPageSize) => {
                setPage(newPageIndex + 1);
                setPageSize(newPageSize);
              }}
            />
          )}
        </CardContent>
      </Card>

      <DeleteDialog
        open={!!deleteProduct}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        itemName={deleteProduct?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
