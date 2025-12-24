import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from './breadcrumbs';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: LucideIcon;
  };
  showBreadcrumbs?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  action,
  secondaryAction,
  showBreadcrumbs = true,
  className,
  children,
}: PageHeaderProps) {
  const ActionIcon = action?.icon;
  const SecondaryIcon = secondaryAction?.icon;

  const ActionButton = action && (
    <Button
      onClick={action.onClick}
      asChild={!!action.href}
    >
      {action.href ? (
        <a href={action.href}>
          {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
          {action.label}
        </a>
      ) : (
        <>
          {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
          {action.label}
        </>
      )}
    </Button>
  );

  const SecondaryButton = secondaryAction && (
    <Button
      variant="outline"
      onClick={secondaryAction.onClick}
      asChild={!!secondaryAction.href}
    >
      {secondaryAction.href ? (
        <a href={secondaryAction.href}>
          {SecondaryIcon && <SecondaryIcon className="mr-2 h-4 w-4" />}
          {secondaryAction.label}
        </a>
      ) : (
        <>
          {SecondaryIcon && <SecondaryIcon className="mr-2 h-4 w-4" />}
          {secondaryAction.label}
        </>
      )}
    </Button>
  );

  return (
    <div className={cn('space-y-4', className)}>
      {showBreadcrumbs && <Breadcrumbs />}
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {SecondaryButton}
          {ActionButton}
          {children}
        </div>
      </div>
    </div>
  );
}
