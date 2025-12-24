// Base API Response Types

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | ValidationError;
  timestamp: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export interface ValidationError {
  fields: ValidationFieldError[];
}

export interface ValidationFieldError {
  field: string;
  message: string;
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  search?: string;
}

// Type guards
export function isSuccess<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
  return response.success === true && response.data !== undefined;
}

export function isValidationError(error: string | ValidationError | undefined): error is ValidationError {
  return typeof error === 'object' && error !== null && 'fields' in error;
}

export function getErrorMessage(error: string | ValidationError | undefined): string {
  if (!error) return 'An unknown error occurred';
  if (typeof error === 'string') return error;
  return error.fields.map(f => `${f.field}: ${f.message}`).join(', ');
}
