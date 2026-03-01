export interface LeadershipMember {
  id: string;
  name: string;
  designation: string;
  bio?: string;
  photo_url?: string;
  email?: string;
  website_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  display_order: number;
  is_active: boolean;
  user_id?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    display_name?: string;
    email: string;
  };
}

export interface CreateLeadershipMemberPayload {
  name: string;
  designation: string;
  bio?: string;
  email?: string;
  website_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  display_order?: number;
  is_active?: boolean;
  user_id?: string;
  photo?: File;
}

export interface UpdateLeadershipMemberPayload
  extends Partial<Omit<CreateLeadershipMemberPayload, 'photo'>> {
  id: string;
  photo?: File;
}
