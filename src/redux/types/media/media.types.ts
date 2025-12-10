// src/app/redux/types/media.types.ts

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';

export interface Media {
  id: string;
  url: string;
  type: MediaType;
  filename: string;
  mimeType: string;
  size: number; // bytes
  title?: string;
  altText?: string;
  description?: string;
  folder?: string | null;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedMediaResponse {
  items: Media[];
  total: number;
  page: number;
  limit: number;
}

export interface GetMediaQuery {
  search?: string;
  type?: MediaType;
  folder?: string;
  ownerId?: string;
  page?: number;
  limit?: number;
}

export interface CreateMediaDto {
  // For non-file metadata if your API supports JSON-only create
  title?: string;
  altText?: string;
  description?: string;
  folder?: string;
}

export interface UpdateMediaDto {
  title?: string;
  altText?: string;
  description?: string;
  folder?: string | null;
}

export interface UploadMediaPayload {
  file: File;
  data?: CreateMediaDto; // optional extra metadata
}

export interface MediaState {
  list: Media[];
  total: number;
  page: number;
  limit: number;
  selectedMedia: Media | null;
  isLoading: boolean;
  error: string | null;
}
