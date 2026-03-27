import { baseApi } from '../baseApi';

// Types
export interface AgentConfig {
  id: number;
  enabled: boolean;
  max_posts_per_session: number;
  pipeline_interval_minutes: number;
  stagger_delay_seconds: number;
  max_article_age_hours: number;
  max_articles_per_category: number;
  require_featured_image: boolean;
  image_strategy: string;
  image_ai_provider: string;
  auto_publish: boolean;
  categories_enabled: string[];
  categories_requiring_review: string[];
  publisher_admin_id: string | null;
  allowed_categories: string[];
  feed_sources: FeedSource[];
  category_tiers: Record<string, CategoryTier> | null;
  updated_at: string;
}

export interface CategoryTier {
  max_articles: number;
  interval_hours: number;
  categories: string[];
}

export interface FeedSource {
  category_key: string;
  feed_url: string;
  feed_type: 'rss' | 'newsapi_keywords';
  label?: string;
  is_active?: boolean;
}

export interface UpdateAgentConfigPayload {
  enabled?: boolean;
  max_posts_per_session?: number;
  pipeline_interval_minutes?: number;
  stagger_delay_seconds?: number;
  max_article_age_hours?: number;
  max_articles_per_category?: number;
  require_featured_image?: boolean;
  image_strategy?: string;
  image_ai_provider?: string;
  auto_publish?: boolean;
  categories_enabled?: string[];
  categories_requiring_review?: string[];
  publisher_admin_id?: string | null;
  allowed_categories?: string[];
  feed_sources?: FeedSource[];
  category_tiers?: Record<string, CategoryTier> | null;
}

export interface AgentRun {
  id: string;
  started_at: string;
  finished_at: string | null;
  status: 'running' | 'completed' | 'failed';
  trigger: 'scheduled' | 'manual' | 'retry';
  articles_fetched: number;
  articles_rewritten: number;
  articles_published: number;
  articles_failed: number;
  images_generated: number;
  categories_processed: Record<string, { fetched: number; rewritten: number; published: number; failed: number }> | null;
  error_log: string | null;
  duration_seconds: number | null;
  cost_summary?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    api_calls?: number;
    image_generations?: number;
    estimated_cost_usd?: number;
    seo_report?: SEORunReport;
  } | null;
}

export interface SEORunReport {
  source_urls: string[];
  seo_summary: {
    total_internal_links_added: number;
    total_external_links_added: number;
    avg_keyword_density_pct: number;
    category_routing: {
      successes: number;
      failures: number;
    };
  };
  articles: SEOArticleReport[];
  errors: string[];
}

export interface SEOArticleReport {
  article_id: string;
  source_urls: string[];
  internal_links: Array<{ anchor: string; url: string; name: string }>;
  external_links: Array<{ anchor: string; url: string; name: string }>;
  category_target: string;
  category_status: string;
  category_fallback: string;
  keyword_density_pct: number;
  primary_keyword: string;
  word_count: number;
  readability_grade: string;
}

export interface AggregatedArticle {
  id: string;
  source_url: string;
  source_title: string;
  source_name: string | null;
  category_slug: string;
  status: string;
  blog_post_id: string | null;
  source_image_url: string | null;
  generated_image_url: string | null;
  error_message: string | null;
  retry_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ReviewQueueArticle extends AggregatedArticle {
  rewritten_content: string | null;
  seo_metadata: Record<string, unknown> | null;
  article_status: string;
  post_title: string | null;
  post_status: string | null;
  post_slug: string | null;
}

export interface CostSummary {
  period_days: number;
  totals: {
    total_runs: string;
    total_prompt_tokens: string;
    total_completion_tokens: string;
    total_tokens: string;
    total_api_calls: string;
    total_image_generations: string;
    total_cost_usd: string;
  };
  daily: Array<{
    date: string;
    runs: string;
    cost_usd: string;
    tokens: string;
  }>;
}

export interface SocialMediaPostItem {
  id: string;
  article_id: string;
  blog_post_id: string | null;
  platform: 'twitter' | 'linkedin' | 'facebook';
  status: 'pending' | 'posted' | 'failed' | 'skipped';
  post_text: string | null;
  post_url: string | null;
  platform_post_id: string | null;
  error_message: string | null;
  created_at: string;
  posted_at: string | null;
  source_title: string | null;
}

export interface SocialStats {
  byPlatform: Array<{ platform: string; status: string; count: string }>;
  recent: SocialMediaPostItem[];
}

interface SocialPostsQuery {
  page?: number;
  limit?: number;
  platform?: string;
  status?: string;
}

export interface AgentStats {
  runs: {
    total_runs: string;
    completed_runs: string;
    failed_runs: string;
    running_runs: string;
    total_fetched: string;
    total_rewritten: string;
    total_published: string;
    total_failed: string;
    total_images: string;
    avg_duration: string;
    last_run_at: string | null;
  };
  articlesByStatus: Array<{ status: string; count: string }>;
  articlesByCategory: Array<{ category_slug: string; status: string; count: string }>;
  dailyPublished: Array<{ date: string; count: string }>;
  recentRuns: AgentRun[];
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

interface RunsQuery {
  page?: number;
  limit?: number;
  status?: string;
  trigger?: string;
  start_date?: string;
  end_date?: string;
}

interface ArticlesQuery {
  page?: number;
  limit?: number;
  status?: string;
  category_slug?: string;
  start_date?: string;
  end_date?: string;
}

export const agentLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgentConfig: builder.query<AgentConfig, void>({
      query: () => '/agent-logs/config',
      providesTags: ['AgentLogs'],
    }),
    updateAgentConfig: builder.mutation<AgentConfig, UpdateAgentConfigPayload>({
      query: (body) => ({
        url: '/agent-logs/config',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AgentLogs'],
    }),
    getAgentStats: builder.query<AgentStats, void>({
      query: () => '/agent-logs/stats',
      providesTags: ['AgentLogs'],
    }),
    getAgentRuns: builder.query<PaginatedResponse<AgentRun>, RunsQuery>({
      query: (params) => ({
        url: '/agent-logs/runs',
        params,
      }),
      providesTags: ['AgentLogs'],
    }),
    getAgentRun: builder.query<AgentRun, string>({
      query: (id) => `/agent-logs/runs/${id}`,
      providesTags: ['AgentLogs'],
    }),
    getAgentArticles: builder.query<PaginatedResponse<AggregatedArticle>, ArticlesQuery>({
      query: (params) => ({
        url: '/agent-logs/articles',
        params,
      }),
      providesTags: ['AgentLogs'],
    }),
    getReviewQueue: builder.query<PaginatedResponse<ReviewQueueArticle>, ArticlesQuery>({
      query: (params) => ({
        url: '/agent-logs/review-queue',
        params,
      }),
      providesTags: ['AgentLogs'],
    }),
    approveArticle: builder.mutation<{ success: boolean; articleId: string }, string>({
      query: (id) => ({
        url: `/agent-logs/articles/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['AgentLogs'],
    }),
    rejectArticle: builder.mutation<{ success: boolean; articleId: string }, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/agent-logs/articles/${id}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['AgentLogs'],
    }),
    getCostSummary: builder.query<CostSummary, number | void>({
      query: (days) => ({
        url: '/agent-logs/cost-summary',
        params: { days: days || 7 },
      }),
      providesTags: ['AgentLogs'],
    }),
    getSocialPosts: builder.query<PaginatedResponse<SocialMediaPostItem>, SocialPostsQuery>({
      query: (params) => ({
        url: '/agent-logs/social-posts',
        params,
      }),
      providesTags: ['AgentLogs'],
    }),
    getSocialStats: builder.query<SocialStats, void>({
      query: () => '/agent-logs/social-stats',
      providesTags: ['AgentLogs'],
    }),
    validatePublisher: builder.query<
      { valid: boolean; error?: string; user?: { id: string; username: string; email: string; display_name: string | null; role: string } },
      string
    >({
      query: (userId) => `/agent-logs/validate-publisher/${userId}`,
    }),
  }),
});

export const {
  useGetAgentConfigQuery,
  useUpdateAgentConfigMutation,
  useGetAgentStatsQuery,
  useGetAgentRunsQuery,
  useGetAgentRunQuery,
  useGetAgentArticlesQuery,
  useGetReviewQueueQuery,
  useApproveArticleMutation,
  useRejectArticleMutation,
  useGetCostSummaryQuery,
  useGetSocialPostsQuery,
  useGetSocialStatsQuery,
  useLazyValidatePublisherQuery,
} = agentLogsApi;
