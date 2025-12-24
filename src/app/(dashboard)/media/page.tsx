'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Image,
  Upload,
  Trash2,
  Search,
  Grid,
  List,
  Download,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { PageLoading } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMedia, useUploadMedia, useDeleteMedia } from '@/lib/hooks/use-media';
import {
  Media,
  isImage,
  formatFileSize,
  getFullMediaUrl,
  MAX_FILE_SIZE,
} from '@/types/media';
import { formatDateTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

export default function MediaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; media: Media | null }>({
    open: false,
    media: null,
  });
  const [page, setPage] = useState(1);

  // Queries and mutations
  const { data: mediaResponse, isLoading, refetch } = useMedia({
    page,
    limit: 24,
    search: search || undefined,
  });
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  const mediaItems = mediaResponse?.data || [];
  const pagination = mediaResponse?.pagination;

  // File upload handler
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File ${file.name} exceeds 10MB limit`);
          continue;
        }
        
        await uploadMutation.mutateAsync({ file });
      }
      refetch();
    },
    [uploadMutation, refetch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
      'application/pdf': ['.pdf'],
    },
    maxSize: MAX_FILE_SIZE,
  });

  const handleDelete = (media: Media) => {
    setDeleteDialog({ open: true, media });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.media) return;
    await deleteMutation.mutateAsync(deleteDialog.media.id);
    setDeleteDialog({ open: false, media: null });
    if (selectedMedia?.id === deleteDialog.media.id) {
      setSelectedMedia(null);
    }
    refetch();
  };

  const applySearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    router.push(`/media?${params.toString()}`);
    setPage(1);
  };

  if (isLoading) {
    return <PageLoading message="Loading media library..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Manage your uploaded images and files"
      />

      {/* Upload Area */}
      <Card>
        <CardContent className="p-4">
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-primary">Drop the files here...</p>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Drag & drop files here, or click to select files
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports: Images (JPEG, PNG, GIF, WebP, SVG) and PDF. Max 10MB per file.
                </p>
              </>
            )}
            {uploadMutation.isPending && (
              <p className="text-primary mt-2">Uploading...</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search and View Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={applySearch}>Search</Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Media Grid/List */}
      {mediaItems.length === 0 ? (
        <EmptyState
          icon={Image}
          title="No media files"
          description={
            search
              ? 'No files match your search criteria.'
              : 'Upload your first file using the area above.'
          }
          action={
            search
              ? { label: 'Clear Search', onClick: () => { setSearch(''); router.push('/media'); } }
              : undefined
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {mediaItems.map((media) => (
            <Card
              key={media.id}
              className={cn(
                'cursor-pointer overflow-hidden transition-all hover:shadow-lg',
                selectedMedia?.id === media.id && 'ring-2 ring-primary'
              )}
              onClick={() => setSelectedMedia(media)}
            >
              <div className="aspect-square bg-muted relative">
                {isImage(media.mime_type) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getFullMediaUrl(media.url)}
                    alt={media.alt_text || media.original_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Badge variant="secondary">
                      {media.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-2">
                <p className="text-xs truncate">{media.original_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(media.size)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {mediaItems.map((media) => (
                <div
                  key={media.id}
                  className={cn(
                    'flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer',
                    selectedMedia?.id === media.id && 'bg-muted'
                  )}
                  onClick={() => setSelectedMedia(media)}
                >
                  <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                    {isImage(media.mime_type) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getFullMediaUrl(media.url)}
                        alt={media.alt_text || media.original_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Badge variant="secondary" className="text-xs">
                          {media.mime_type.split('/')[1]?.toUpperCase()}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{media.original_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(media.size)} • {formatDateTime(media.created_at)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(getFullMediaUrl(media.url), '_blank');
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(media);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {pagination.total_pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
            disabled={page === pagination.total_pages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Media Detail Sidebar */}
      {selectedMedia && (
        <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>File Details</DialogTitle>
              <DialogDescription>{selectedMedia.original_name}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {isImage(selectedMedia.mime_type) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getFullMediaUrl(selectedMedia.url)}
                    alt={selectedMedia.alt_text || selectedMedia.original_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Badge variant="secondary" className="text-lg">
                      {selectedMedia.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">File Name</p>
                  <p className="font-medium">{selectedMedia.original_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedMedia.mime_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-medium">{formatFileSize(selectedMedia.size)}</p>
                </div>
                {selectedMedia.width && selectedMedia.height && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dimensions</p>
                    <p className="font-medium">
                      {selectedMedia.width} × {selectedMedia.height} px
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded</p>
                  <p className="font-medium">{formatDateTime(selectedMedia.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">URL</p>
                  <Input
                    value={getFullMediaUrl(selectedMedia.url)}
                    readOnly
                    className="mt-1"
                    onClick={(e) => {
                      (e.target as HTMLInputElement).select();
                      navigator.clipboard.writeText(getFullMediaUrl(selectedMedia.url));
                      toast.success('URL copied to clipboard');
                    }}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedMedia(null)}>
                Close
              </Button>
              <Button
                onClick={() => window.open(getFullMediaUrl(selectedMedia.url), '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedMedia(null);
                  handleDelete(selectedMedia);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, media: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteDialog.media?.original_name}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, media: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
