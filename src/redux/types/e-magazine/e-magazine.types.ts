export interface EMagazine {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  pdf_url: string;
  issue_number: number;
  published_date?: string;
  status: 'draft' | 'published';
  page_count?: number;
  file_size?: number;
  category_id?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    display_name?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export interface PaginatedEMagazineResponse {
  data: EMagazine[];
  total: number;
  page: number;
  limit: number;
}

export interface GetEMagazineQuery {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
}

export interface CreateEMagazinePayload {
  title: string;
  description?: string;
  issue_number: number;
  published_date?: string;
  status?: string;
  page_count?: number;
  category_id?: string;
  tag_ids?: string[];
  pdf_file: File;
  cover_image?: File;
}

export interface UpdateEMagazinePayload {
  id: string;
  title?: string;
  description?: string;
  issue_number?: number;
  published_date?: string;
  status?: string;
  page_count?: number;
  category_id?: string;
  tag_ids?: string[];
  pdf_file?: File;
  cover_image?: File;
}
