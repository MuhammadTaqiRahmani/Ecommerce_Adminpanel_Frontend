import { LucideIcon, Package, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  } | ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const isActionObject = action && typeof action === 'object' && 'label' in action && 'onClick' in action;

  return (
    <div
      className={cn(
        'flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center',
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      {action && (
        <div className="mt-4">
          {isActionObject ? (
            <Button onClick={(action as { label: string; onClick: () => void }).onClick}>
              {(action as { label: string; onClick: () => void }).label}
            </Button>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
}

// Preset empty states for common use cases
export function NoProductsEmpty({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={Package}
      title="No products found"
      description="Get started by creating your first product."
      action={onAdd ? { label: 'Add Product', onClick: onAdd } : undefined}
    />
  );
}

export function NoResultsEmpty() {
  return (
    <EmptyState
      icon={FileQuestion}
      title="No results found"
      description="Try adjusting your search or filter criteria."
    />
  );
}
