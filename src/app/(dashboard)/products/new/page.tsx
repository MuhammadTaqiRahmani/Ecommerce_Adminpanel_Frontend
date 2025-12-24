import { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { ProductForm } from '@/components/forms/product-form';

export const metadata: Metadata = {
  title: 'New Product',
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Product"
        description="Add a new product to your catalog"
      />
      <ProductForm />
    </div>
  );
}
