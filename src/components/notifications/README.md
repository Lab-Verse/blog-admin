# Notifications Components

A comprehensive notification center for managing user notifications with read/unread status and filtering.

## 🎨 Features

- ✨ Premium notification center design
- 🔔 Unread count badge
- 📊 Read/unread status tracking
- ✅ Mark as read (individual & bulk)
- 🗑️ Delete notifications
- 🎯 Filter by all/unread
- ⏰ Relative timestamps (e.g., "2h ago")
- 🎨 Type-based color coding
- 📱 Fully responsive design
- ⚡ Redux RTK Query integration
- 🔄 Real-time updates

## 📦 Components

| Component | Description |
|-----------|-------------|
| `NotificationsPage` | Main notification center with filtering |
| `NotificationCard` | Individual notification card with actions |

## 🚀 Usage

```tsx
import { NotificationsPage } from '@/components/notifications';

export default function Page() {
  return <NotificationsPage />;
}
```

## 🎨 Notification Types

Each notification type has a distinct color:

| Type | Color | Description |
|------|-------|-------------|
| info | Blue | General information |
| success | Green | Success messages |
| warning | Yellow | Warning alerts |
| error | Red | Error notifications |

## 📊 Features

- **Unread Badge**: Shows count of unread notifications
- **Mark as Read**: Click individual notifications or use "Mark All as Read"
- **Filter**: Toggle between "All" and "Unread" notifications
- **Delete**: Remove notifications with confirmation
- **Timestamps**: Smart relative time display
- **Auto-mark**: Clicking a notification marks it as read

## 🔗 Dependencies

- Redux Toolkit & RTK Query
- lucide-react (icons)
- Tailwind CSS v4
