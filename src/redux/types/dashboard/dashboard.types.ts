// Dashboard Statistics Types
export interface DashboardStats {
    totalPosts: number;
    totalUsers: number;
    totalCategories: number;
    totalComments: number;
    totalViews: number;
    totalReactions: number;
    postsGrowth: number;
    usersGrowth: number;
    categoriesGrowth: number;
    commentsGrowth: number;
    viewsGrowth: number;
    reactionsGrowth: number;
}

// Recent Activity Types
export enum ActivityType {
    POST_CREATED = 'post_created',
    POST_UPDATED = 'post_updated',
    POST_DELETED = 'post_deleted',
    USER_REGISTERED = 'user_registered',
    COMMENT_ADDED = 'comment_added',
    CATEGORY_CREATED = 'category_created',
    REACTION_ADDED = 'reaction_added',
}

export interface ActivityItem {
    id: string;
    type: ActivityType;
    user: {
        id: string;
        username: string;
        avatar?: string;
    };
    action: string;
    target?: string;
    targetId?: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

// Recent Content Types
export interface RecentPost {
    id: string;
    title: string;
    author: {
        id: string;
        username: string;
        avatar?: string;
    };
    createdAt: string;
    views: number;
    comments: number;
    reactions: number;
    category?: string;
    status: 'published' | 'draft' | 'archived';
}

export interface RecentUser {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    joinedAt: string;
    postsCount: number;
    commentsCount: number;
    role: string;
}

export interface RecentComment {
    id: string;
    content: string;
    author: {
        id: string;
        username: string;
        avatar?: string;
    };
    post: {
        id: string;
        title: string;
    };
    createdAt: string;
    reactions: number;
}

// Analytics Types
export interface CategoryAnalytics {
    id: string;
    name: string;
    postsCount: number;
    viewsCount: number;
    growth: number;
    color?: string;
}

export interface EngagementMetrics {
    averageViewsPerPost: number;
    averageCommentsPerPost: number;
    averageReactionsPerPost: number;
    engagementRate: number;
    activeUsersToday: number;
    activeUsersThisWeek: number;
}

export interface TrendingContent {
    posts: RecentPost[];
    categories: CategoryAnalytics[];
    tags: Array<{
        id: string;
        name: string;
        count: number;
        growth: number;
    }>;
}

// Chart Data Types
export interface ChartDataPoint {
    label: string;
    value: number;
    date?: string;
}

export interface TimeSeriesData {
    period: 'day' | 'week' | 'month' | 'year';
    data: ChartDataPoint[];
}

// Dashboard Response Type
export interface DashboardData {
    stats: DashboardStats;
    recentActivity: ActivityItem[];
    recentPosts: RecentPost[];
    recentUsers: RecentUser[];
    recentComments: RecentComment[];
    engagement: EngagementMetrics;
    trending: TrendingContent;
    chartData?: {
        postsOverTime: TimeSeriesData;
        usersOverTime: TimeSeriesData;
        viewsOverTime: TimeSeriesData;
    };
}

// Query Parameters
export interface GetDashboardDataQuery {
    timeRange?: '24h' | '7d' | '30d' | '90d' | '1y';
    includeCharts?: boolean;
}
