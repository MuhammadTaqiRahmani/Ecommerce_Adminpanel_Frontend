'use client';

import { use } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import { PageLoading } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import { AdminForm } from '@/components/forms/admin-form';
import { useAdmin } from '@/lib/hooks/use-admins';

interface EditAdminPageProps {
  params: Promise<{ id: string }>;
}

export default function EditAdminPage({ params }: EditAdminPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: adminResponse, isLoading } = useAdmin(id);

  const admin = adminResponse?.data;

  if (isLoading) {
    return <PageLoading message="Loading admin..." />;
  }

  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Shield className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Admin not found</h2>
        <p className="text-muted-foreground mb-4">
          The administrator you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button onClick={() => router.push('/admins')}>Back to Admins</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admins')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Edit Administrator"
          description={`Editing ${admin.name}`}
        />
      </div>

      <AdminForm admin={admin} isEdit />
    </div>
  );
}
