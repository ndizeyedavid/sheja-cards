import { ClientResponseError } from 'pocketbase';

export interface ApiError extends Partial<ClientResponseError> {
  message: string;
  data?: Record<string, string[]>;
  status?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export type ApiResult<T> = ApiResponse<T> | ErrorResponse;

export interface BaseRecord {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
}

export interface UploadProgress {
  progress: number;
  state: 'uploading' | 'error' | 'success';
  error?: string;
}

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}