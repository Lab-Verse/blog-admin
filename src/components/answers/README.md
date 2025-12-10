# Answers Components

A streamlined answers management system with voting, accepted answers, and modern design.

## 🎨 Features

- ✨ Premium glassmorphism design with gradient accents
- 📝 Full CRUD operations (Create, Read, Update, Delete)
- 🎯 Status management (Published, Draft, Deleted)
- 👍 Voting system (upvotes/downvotes)
- ✅ Accepted answer marking
- 📱 Fully responsive design
- ⚡ Redux RTK Query integration
- 🎭 Loading states and error handling

## 📦 Components

| Component | Description |
|-----------|-------------|
| `AnswersPage` | Main page with inline form and full functionality |
| `AnswerCard` | Individual answer card with voting and actions |
| `AnswerStatusBadge` | Color-coded status badges |

## 🚀 Usage

```tsx
import { AnswersPage } from '@/components/answers';

export default function Page() {
  const questionId = 'question-123';
  return <AnswersPage questionId={questionId} />;
}
```

## 🎨 Design System

Uses your existing Tailwind CSS v4 theme:
- **Primary**: Blue (#3b82f6)
- **Secondary**: Slate (#64748b)
- **Accent**: Emerald (#10b981)
- **Status Colors**:
  - Published: Emerald (Green)
  - Draft: Blue
  - Deleted: Red

## 📱 Responsive Breakpoints

- Mobile: < 768px (stacked layout)
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

## 🔗 Dependencies

- Redux Toolkit & RTK Query
- lucide-react (icons)
- Tailwind CSS v4
