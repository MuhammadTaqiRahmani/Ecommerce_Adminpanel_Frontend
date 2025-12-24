import { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { CategoryForm } from '@/components/forms/category-form';

export const metadata: Metadata = {
  title: 'New Category',
};

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Category"
        description="Add a new product category"
      />
      <CategoryForm />
    </div>
  );
}
