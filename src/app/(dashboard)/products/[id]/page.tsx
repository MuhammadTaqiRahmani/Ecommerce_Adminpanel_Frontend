'use client';

import { useParams, useRouter } from 'next/navigation';
import { Pencil, Trash2, ArrowLeft, Package, Tag } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/layout/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { DeleteDialog } from '@/components/modals/delete-dialog';
import { useProduct, useDeleteProduct } from '@/lib/hooks/use-products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { getProductStatusLabel, getProductStatusColor } from '@/types/product';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [showDelete, setShowDelete] = useState(false);

  const { data: response, isLoading, error } = useProduct(productId);
  const deleteMutation = useDeleteProduct();
  const product = response?.data;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(productId);
    router.push('/products');
  };

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
        <PageHeader title="Product Details" />
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

  const mainImage = product.images?.[0]?.url;

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        description={product.short_description || 'No description'}
        action={{
          label: 'Edit',
          href: `/products/${product.id}/edit`,
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
          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              {mainImage ? (
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center rounded-lg bg-muted">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SKU</p>
                  <p className="text-sm font-mono">{product.sku}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm mt-1 whitespace-pre-wrap">
                  {product.description || 'No description provided'}
                </p>
              </div>

              {product.tags && product.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
                </div>
                {product.compare_at_price && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Compare at</p>
                    <p className="text-sm line-through text-muted-foreground">
                      {formatCurrency(product.compare_at_price)}
                    </p>
                  </div>
                )}
                {product.cost_price && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cost</p>
                    <p className="text-sm">{formatCurrency(product.cost_price)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getProductStatusColor(product.status) as 'default' | 'secondary' | 'destructive'}>
                  {getProductStatusLabel(product.status)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Featured</span>
                <Badge variant={product.is_featured ? 'default' : 'secondary'}>
                  {product.is_featured ? 'Yes' : 'No'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <span className={`text-sm font-medium ${product.quantity <= product.low_stock_threshold ? 'text-destructive' : ''}`}>
                  {product.quantity}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Low Stock Alert</span>
                <span className="text-sm">{product.low_stock_threshold}</span>
              </div>
              {product.barcode && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Barcode</span>
                  <span className="text-sm font-mono">{product.barcode}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="text-sm">{product.category?.name || '—'}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{formatDate(product.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm">{formatDate(product.updated_at)}</p>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>

      <DeleteDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        title="Delete Product"
        itemName={product.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
