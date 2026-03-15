import { baseApi } from '../baseApi';

// Types
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
  }),
});

export const {
  useGetAgentStatsQuery,
  useGetAgentRunsQuery,
  useGetAgentRunQuery,
  useGetAgentArticlesQuery,
} = agentLogsApi;
