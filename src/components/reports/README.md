# Reports Components

A comprehensive moderation dashboard for managing content reports with status workflow and filtering.

## 🎨 Features

- ✨ Premium moderation dashboard design
- 🛡️ Status workflow (Open → In Review → Resolved/Rejected)
- 🎯 Multi-target support (post, question, comment, answer, user)
- 🔍 Real-time search and filtering
- 📊 Moderation statistics
- 👤 Moderator tracking
- 📝 Resolution notes
- ⚡ Quick actions (resolve/reject)
- 📱 Fully responsive design
- ⚡ Redux RTK Query integration

## 📦 Components

| Component | Description |
|-----------|-------------|
| `ReportsPage` | Main moderation dashboard with filters and stats |
| `ReportCard` | Individual report card with quick actions |
| `ReportDetailModal` | Detailed view with status update form |
| `ReportStatusBadge` | Color-coded status badges |
| `TargetTypeBadge` | Target type indicators |

## 🚀 Usage

```tsx
import { ReportsPage } from '@/components/reports';

export default function Page() {
  const moderatorId = 'current-moderator-id';
  return <ReportsPage moderatorId={moderatorId} />;
}
```

## 🎨 Report Statuses

| Status | Color | Description |
|--------|-------|-------------|
| Open | Red | New report, needs review |
| In Review | Yellow | Being investigated |
| Resolved | Green | Action taken, resolved |
| Rejected | Gray | No action needed |

## 📱 Target Types

- `post` - Blog posts
- `question` - Q&A questions
- `comment` - Comments
- `answer` - Answers to questions
- `user` - User profiles

## 🔗 Dependencies

- Redux Toolkit & RTK Query
- lucide-react (icons)
- Tailwind CSS v4
