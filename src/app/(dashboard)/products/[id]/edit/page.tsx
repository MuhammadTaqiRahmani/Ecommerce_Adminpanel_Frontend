'use client';

import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { ProductForm } from '@/components/forms/product-form';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { useProduct } from '@/lib/hooks/use-products';
import { Card, CardContent } from '@/components/ui/card';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data: response, isLoading, error } = useProduct(productId);
  const product = response?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Product" />
        <Card>
          <CardContent className="py-10">
            <EmptyState
              title="Product not found"
              description="The product you're looking for doesn't exist or has been deleted."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${product.name}`}
        description="Update product information"
      />
      <ProductForm product={product} isEdit />
    </div>
  );
}
