// Media Entity Types
export interface Media {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text: string;
  title: string;
  entity_type: string;
  entity_id: string;
  sort_order: number;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
}

// Media Upload Request (FormData)
export interface MediaUploadData {
  file: File;
  entity_type?: string;
  entity_id?: string;
  alt_text?: string;
  title?: string;
  sort_order?: number;
}

// Media Update Request
export interface UpdateMediaRequest {
  alt_text?: string;
  title?: string;
  entity_type?: string;
  entity_id?: string;
  sort_order?: number;
}

// Media Stats
export interface MediaStats {
  total: number;
  total_size: number;
  by_type: Record<string, number>;
}

// Media Filters
export interface MediaFilters {
  entity_type?: string;
  entity_id?: string;
  mime_type?: string;
  search?: string;
}

// Allowed MIME Types
export const AllowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/csv',
] as const;

export type AllowedMimeType = typeof AllowedMimeTypes[number];

// File Extension Mapping
export const MimeToExtension: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
};

// Constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_PER_REQUEST = 10;

// Helpers
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFullMediaUrl(url: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:8080';
  if (url.startsWith('http')) return url;
  return `${baseUrl}${url}`;
}

export function isAllowedFileType(mimeType: string): boolean {
  return AllowedMimeTypes.includes(mimeType as AllowedMimeType);
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds maximum limit of 10MB` };
  }
  if (!isAllowedFileType(file.type)) {
    return { valid: false, error: `File type '${file.type}' is not allowed` };
  }
  return { valid: true };
}
