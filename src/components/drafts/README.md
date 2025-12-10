# Drafts Components

A comprehensive drafts management system with full CRUD operations, status management, and modern design.

## 🎨 Features

- ✨ Premium glassmorphism design with gradient accents
- 📝 Full CRUD operations (Create, Read, Update, Delete)
- 🎯 Status management (Draft, Scheduled, Archived)
- 🔍 Real-time search and filtering
- 📄 Pagination controls
- 📅 Scheduled date picker for scheduled drafts
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Redux RTK Query integration
- 🎭 Loading skeletons and empty states
- 🎯 Modal detail and form views

## 📦 Components

| Component | Description |
|-----------|-------------|
| `DraftsPage` | Main page with full functionality |
| `DraftCard` | Individual draft card with status badges |
| `DraftsGrid` | Responsive grid layout |
| `DraftsHeader` | Header with search, filters, and create button |
| `DraftFormModal` | Create/edit modal with validation |
| `DraftDetailModal` | Modal for viewing full details |
| `StatusBadge` | Color-coded status badges |
| `EmptyDraftsState` | Beautiful empty state |
| `DraftsLoadingSkeleton` | Animated loading state |
| `PaginationControls` | Pagination navigation |

## 🚀 Usage

```tsx
import { DraftsPage } from '@/components/drafts';

export default function Page() {
  return <DraftsPage />;
}
```

## 🎨 Design System

Uses your existing Tailwind CSS v4 theme:
- **Primary**: Blue (#3b82f6)
- **Secondary**: Slate (#64748b)
- **Accent**: Purple (#a855f7)
- **Status Colors**:
  - Draft: Blue
  - Scheduled: Purple
  - Archived: Gray

## 📱 Responsive Breakpoints

- Mobile: < 768px (1 column)
- Tablet: 768px - 1023px (2 columns)
- Desktop: ≥ 1024px (3 columns)

## 🔗 Dependencies

- Redux Toolkit & RTK Query
- lucide-react (icons)
- Tailwind CSS v4
