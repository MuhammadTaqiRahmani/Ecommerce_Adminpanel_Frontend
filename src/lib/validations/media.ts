import { z } from 'zod';
import { AllowedMimeTypes, MAX_FILE_SIZE } from '@/types/media';

export const mediaUploadSchema = z.object({
  entity_type: z.string().optional(),
  entity_id: z.string().uuid('Invalid entity ID').optional().or(z.literal('')),
  alt_text: z.string().optional(),
  title: z.string().optional(),
  sort_order: z
    .number()
    .int('Sort order must be a whole number')
    .min(0, 'Sort order must be 0 or greater')
    .optional()
    .default(0),
});

export const updateMediaSchema = z.object({
  alt_text: z.string().optional(),
  title: z.string().optional(),
  entity_type: z.string().optional(),
  entity_id: z.string().uuid('Invalid entity ID').optional().or(z.literal('')),
  sort_order: z
    .number()
    .int('Sort order must be a whole number')
    .min(0, 'Sort order must be 0 or greater')
    .optional(),
});

// File validation schema (for use with file inputs)
export const fileValidationSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, 'Please select a file')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 10MB')
    .refine(
      (file) => AllowedMimeTypes.includes(file.type as typeof AllowedMimeTypes[number]),
      'File type not allowed'
    ),
});

export const multipleFilesValidationSchema = z.object({
  files: z
    .array(z.custom<File>((val) => val instanceof File, 'Please select files'))
    .min(1, 'Please select at least one file')
    .max(10, 'Maximum 10 files allowed')
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      'All files must be less than 10MB'
    )
    .refine(
      (files) => files.every((file) => 
        AllowedMimeTypes.includes(file.type as typeof AllowedMimeTypes[number])
      ),
      'Some files have unsupported types'
    ),
});

export type MediaUploadFormData = z.infer<typeof mediaUploadSchema>;
export type UpdateMediaFormData = z.infer<typeof updateMediaSchema>;
