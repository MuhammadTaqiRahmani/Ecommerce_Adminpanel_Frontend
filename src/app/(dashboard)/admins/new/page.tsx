'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { AdminForm } from '@/components/forms/admin-form';

export default function NewAdminPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admins')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Add Administrator"
          description="Create a new admin account"
        />
      </div>

      <AdminForm />
    </div>
  );
}
