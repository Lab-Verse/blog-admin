# Bookmarks Components

A complete, modern bookmarks management system with premium design and comprehensive functionality.

## 🎨 Features

- ✨ Premium glassmorphism design with gradient accents
- 🔍 Real-time search and filtering
- 📊 Sort by recent/oldest
- 🗑️ Delete with confirmation
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Redux RTK Query integration
- 🎭 Loading skeletons and empty states
- 🎯 Modal detail view

## 📦 Components

| Component | Description |
|-----------|-------------|
| `BookmarksPage` | Main page with full functionality |
| `BookmarkCard` | Individual bookmark card with hover effects |
| `BookmarksGrid` | Responsive grid layout |
| `BookmarksHeader` | Header with search and filters |
| `BookmarkDetailModal` | Modal for viewing full details |
| `EmptyBookmarksState` | Beautiful empty state |
| `BookmarksLoadingSkeleton` | Animated loading state |

## 🚀 Usage

```tsx
import { BookmarksPage } from '@/components/bookmarks';

export default function Page() {
  return <BookmarksPage userId="user-123" />;
}
```

## 🎨 Design System

Uses your existing Tailwind CSS v4 theme:
- **Primary**: Blue (#3b82f6)
- **Secondary**: Slate (#64748b)
- **Accent**: Emerald (#10b981)

## 📱 Responsive Breakpoints

- Mobile: < 768px (1 column)
- Tablet: 768px - 1023px (2 columns)
- Desktop: ≥ 1024px (3 columns)

## 🔗 Dependencies

- Redux Toolkit & RTK Query
- lucide-react (icons)
- Tailwind CSS v4
