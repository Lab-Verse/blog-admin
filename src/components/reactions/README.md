# Reactions Components

A streamlined reactions system with emoji-based UI and real-time counts for posts, questions, comments, and answers.

## 🎨 Features

- ✨ Emoji-based reaction system (like, love, clap, smile, star)
- 🎯 Multi-target support (post, question, comment, answer)
- 👤 User-specific reaction tracking
- 📊 Real-time reaction counts
- 🔄 Toggle reactions on/off
- 📱 Fully responsive design
- ⚡ Redux RTK Query integration
- 🎨 Color-coded reaction types

## 📦 Components

| Component | Description |
|-----------|-------------|
| `ReactionsPage` | Main component with reactions bar and list |
| `ReactionsBar` | Interactive bar with all reaction types |
| `ReactionButton` | Individual reaction button with count |
| `ReactionIcon` | Icon helper for different reaction types |

## 🚀 Usage

### As a Standalone Page

```tsx
import { ReactionsPage } from '@/components/reactions';

export default function Page() {
  return (
    <ReactionsPage
      userId="current-user-id"
      targetType="post"
      targetId="post-123"
    />
  );
}
```

### As an Embedded Component

```tsx
import { ReactionsBar } from '@/components/reactions';

function PostCard({ post, reactions, userId }) {
  return (
    <div>
      <h2>{post.title}</h2>
      <ReactionsBar
        reactions={reactions}
        currentUserId={userId}
        targetType="post"
        targetId={post.id}
        onReact={handleReact}
        onUnreact={handleUnreact}
      />
    </div>
  );
}
```

## 🎨 Reaction Types

| Type | Icon | Color |
|------|------|-------|
| like | 👍 ThumbsUp | Blue |
| love | ❤️ Heart | Red |
| clap | ⚡ Zap | Green |
| smile | 😊 Smile | Yellow |
| star | ⭐ Star | Purple |

## 📱 Target Types

- `post` - Blog posts
- `question` - Q&A questions
- `comment` - Comments
- `answer` - Answers to questions

## 🔗 Dependencies

- Redux Toolkit & RTK Query
- lucide-react (icons)
- Tailwind CSS v4
