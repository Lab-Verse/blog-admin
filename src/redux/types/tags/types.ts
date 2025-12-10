// Define the core structure of a Tag entity
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string; // Optional description for the tag
  color?: string; // Optional color for the tag
  isActive?: boolean; // Whether the tag is active
  posts_count: number;
  postCount?: number; // Alias for posts_count
  created_at: string; // Use string for Date objects coming from the API
  createdAt?: string; // Alias for created_at
  updated_at: string; // Use string for Date objects coming from the API
}

// DTO for creating a new Tag
export interface CreateTagDto {
  name: string;
  slug: string;
}

// DTO for updating an existing Tag (all fields are optional)
export type UpdateTagDto = Partial<CreateTagDto>;
