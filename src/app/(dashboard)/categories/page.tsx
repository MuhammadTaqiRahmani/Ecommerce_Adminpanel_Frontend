'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/tables/data-table';
import { getCategoryColumns } from '@/components/tables/columns/category-columns';
import { DeleteDialog } from '@/components/modals/delete-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { useCategories, useDeleteCategory } from '@/lib/hooks/use-categories';
import { Category } from '@/types/category';

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const { data: response, isLoading, error } = useCategories({ page, limit: pageSize });
  const deleteMutation = useDeleteCategory();

  const categories = response?.data || [];
  const pagination = response?.pagination;

  const handleDelete = async () => {
    if (!deleteCategory) return;
    await deleteMutation.mutateAsync(deleteCategory.id);
    setDeleteCategory(null);
  };

  const columns = getCategoryColumns({
    onDelete: setDeleteCategory,
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
        <PageHeader title="Categories" />
        <Card>
          <CardContent className="py-10">
            <EmptyState
              title="Error loading categories"
              description="There was a problem loading the categories. Please try again."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage your product categories"
        action={{
          label: 'Add Category',
          href: '/categories/new',
          icon: Plus,
        }}
      />

      <Card>
        <CardContent className="pt-6">
          {categories.length === 0 ? (
            <EmptyState
              title="No categories yet"
              description="Get started by creating your first category."
              action={
                <Button asChild>
                  <Link href="/categories/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Link>
                </Button>
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={categories}
              searchKey="name"
              searchPlaceholder="Search categories..."
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
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        itemName={deleteCategory?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
