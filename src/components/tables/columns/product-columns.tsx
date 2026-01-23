'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2, Eye, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { getProductStatusLabel, getProductStatusColor } from '@/types/product';

interface ProductColumnsProps {
  onDelete: (product: Product) => void;
}

export function getProductColumns({ onDelete }: ProductColumnsProps): ColumnDef<Product>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Product',
      cell: ({ row }) => {
        const product = row.original;
        const imageUrl = product.images?.[0]?.url;

        return (
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.sku}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const price = row.original.price;
        const compareAtPrice = row.original.compare_at_price;

        return (
          <div>
            <p className="font-medium">{formatCurrency(price)}</p>
            {compareAtPrice && compareAtPrice > price && (
              <p className="text-xs text-muted-foreground line-through">
                {formatCurrency(compareAtPrice)}
              </p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'stock_quantity',
      header: 'Stock',
      cell: ({ row }) => {
        // Backend returns stock_quantity, not quantity
        const quantity = row.original.stock_quantity ?? row.original.quantity ?? 0;
        const lowStock = row.original.low_stock_threshold ?? 10;
        const isOutOfStock = quantity === 0;
        const isLowStock = quantity > 0 && quantity <= lowStock;

        return (
          <div className="flex items-center gap-2">
            <span className={isOutOfStock ? 'text-destructive font-medium' : isLowStock ? 'text-orange-600 font-medium' : ''}>
              {quantity}
            </span>
            {isOutOfStock ? (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                Low Stock
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                In Stock
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => {
        // Backend returns is_active boolean, convert to status display
        const isActive = row.original.is_active;
        const status = row.original.status;

        // Support both is_active boolean and status string
        if (typeof isActive === 'boolean') {
          return (
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          );
        }

        // Fallback to status string if available
        if (status) {
          return (
            <Badge variant={getProductStatusColor(status) as 'default' | 'secondary' | 'destructive'}>
              {getProductStatusLabel(status)}
            </Badge>
          );
        }

        return <span className="text-muted-foreground">—</span>;
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.original.category;
        if (!category) return <span className="text-muted-foreground">—</span>;
        return <span className="text-sm">{category.name}</span>;
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.created_at)}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/products/${product.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/products/${product.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(product)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
