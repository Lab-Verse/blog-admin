# Questions Components

A comprehensive questions management system with full CRUD operations, status management, and modern design.

## 🎨 Features

- ✨ Premium glassmorphism design with gradient accents
- 📝 Full CRUD operations (Create, Read, Update, Delete)
- 🎯 Status management (Open, Closed, Archived)
- 🔍 Real-time search and filtering
- 🏷️ Category badges and filtering
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Redux RTK Query integration
- 🎭 Loading skeletons and empty states
- 🎯 Modal detail and form views

## 📦 Components

| Component | Description |
|-----------|-------------|
| `QuestionsPage` | Main page with full functionality |
| `QuestionCard` | Individual question card with status badges |
| `QuestionsGrid` | Responsive grid layout |
| `QuestionsHeader` | Header with search, filters, and create button |
| `QuestionFormModal` | Create/edit modal with validation |
| `QuestionDetailModal` | Modal for viewing full details |
| `QuestionStatusBadge` | Color-coded status badges |
| `CategoryBadge` | Category display badge |
| `EmptyQuestionsState` | Beautiful empty state |
| `QuestionsLoadingSkeleton` | Animated loading state |

## 🚀 Usage

```tsx
import { QuestionsPage } from '@/components/questions';

export default function Page() {
  const userId = 'current-user-id';
  return <QuestionsPage userId={userId} />;
}
```

## 🎨 Design System

Uses your existing Tailwind CSS v4 theme:
- **Primary**: Blue (#3b82f6)
- **Secondary**: Slate (#64748b)
- **Accent**: Emerald (#10b981)
- **Status Colors**:
  - Open: Emerald (Green)
  - Closed: Blue
  - Archived: Gray

## 📱 Responsive Breakpoints

- Mobile: < 768px (1 column)
- Tablet: 768px - 1023px (2 columns)
- Desktop: ≥ 1024px (3 columns)

## 🔗 Dependencies

- Redux Toolkit & RTK Query
- lucide-react (icons)
- Tailwind CSS v4
