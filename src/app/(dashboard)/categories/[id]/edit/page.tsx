'use client';

import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { CategoryForm } from '@/components/forms/category-form';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { useCategory } from '@/lib/hooks/use-categories';
import { Card, CardContent } from '@/components/ui/card';

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const { data: response, isLoading, error } = useCategory(categoryId);
  const category = response?.data;

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
        <PageHeader title="Edit Category" />
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
        title={`Edit ${category.name}`}
        description="Update category information"
      />
      <CategoryForm category={category} isEdit />
    </div>
  );
}
