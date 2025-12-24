'use client';

import { useParams, useRouter } from 'next/navigation';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { DeleteDialog } from '@/components/modals/delete-dialog';
import { useCategory, useDeleteCategory } from '@/lib/hooks/use-categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils/format';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const [showDelete, setShowDelete] = useState(false);

  const { data: response, isLoading, error } = useCategory(categoryId);
  const deleteMutation = useDeleteCategory();
  const category = response?.data;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(categoryId);
    router.push('/categories');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="space-y-6">
        <PageHeader title="Category Details" />
        <Card>
          <CardContent className="py-10">
            <EmptyState
              title="Category not found"
              description="The category you're looking for doesn't exist or has been deleted."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={category.name}
        description={category.description || 'No description'}
        action={{
          label: 'Edit',
          href: `/categories/${category.id}/edit`,
          icon: Pencil,
        }}
        secondaryAction={{
          label: 'Delete',
          onClick: () => setShowDelete(true),
          icon: Trash2,
        }}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{category.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Slug</p>
                  <p className="text-sm font-mono">/{category.slug}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm mt-1">
                  {category.description || 'No description provided'}
                </p>
              </div>
            </CardContent>
          </Card>

          {(category.meta_title || category.meta_description) && (
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.meta_title && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Meta Title</p>
                    <p className="text-sm">{category.meta_title}</p>
                  </div>
                )}
                {category.meta_description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Meta Description</p>
                    <p className="text-sm">{category.meta_description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <Badge variant={category.is_active ? 'default' : 'secondary'}>
                  {category.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sort Order</span>
                <span className="text-sm">{category.sort_order}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Parent</span>
                <span className="text-sm">
                  {category.parent_id ? 'Has Parent' : 'Root'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{formatDate(category.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm">{formatDate(category.updated_at)}</p>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        </div>
      </div>

      <DeleteDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        title="Delete Category"
        itemName={category.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
