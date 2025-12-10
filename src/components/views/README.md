# Views Analytics Components

A comprehensive analytics dashboard for tracking and visualizing content views with detailed statistics and insights.

## 🎨 Features

- ✨ Premium analytics dashboard design
- 📊 Comprehensive statistics (total, unique, today, week, month)
- 📈 View type breakdown with progress bars
- 👥 Authenticated vs anonymous tracking
- 🕐 Recent views activity feed
- 📅 Peak performance metrics
- 🎯 Filter by content type and ID
- 📱 Fully responsive design
- ⚡ Redux RTK Query integration
- 🔄 Real-time data updates

## 📦 Components

| Component | Description |
|-----------|-------------|
| `ViewsAnalyticsPage` | Main analytics dashboard with all metrics |
| `ViewsStatsGrid` | Grid of key statistics cards |
| `StatsCard` | Individual metric card with icon and trend |
| `ViewTypeBreakdown` | Distribution chart by content type |
| `RecentViewsList` | Activity feed of recent views |

## 🚀 Usage

### Overall Platform Analytics

```tsx
import { ViewsAnalyticsPage } from '@/components/views';

export default function Page() {
  return <ViewsAnalyticsPage />;
}
```

### Filtered by Content

```tsx
import { ViewsAnalyticsPage } from '@/components/views';

export default function PostAnalytics() {
  return (
    <ViewsAnalyticsPage
      viewableType="post"
      viewableId="post-123"
    />
  );
}
```

## 📊 Metrics Tracked

- **Total Views**: All-time view count
- **Unique Visitors**: Distinct users/IPs
- **Today**: Views in last 24 hours
- **This Week**: Views in last 7 days
- **This Month**: Views in last 30 days
- **Authenticated**: Logged-in user views
- **Anonymous**: Guest views
- **Average/Day**: Daily average
- **Peak Day**: Highest traffic day

## 🎯 Content Types

- `post` - Blog posts
- `question` - Q&A questions
- `answer` - Answers
- `draft` - Draft content
- `media` - Media files

## 🔗 Dependencies

- Redux Toolkit & RTK Query
- lucide-react (icons)
- Tailwind CSS v4
