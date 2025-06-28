# 🚀 TeleApp Messaging Optimization

## Overview

The messaging system has been completely refactored to improve separation of concerns, maintainability, and extensibility. The optimization includes creating a dedicated API hook for Telegram Bot API interactions.

## 📁 New Architecture

### Core Hooks

#### 1. `useTelegramApi` - **NEW**

**Purpose**: Low-level Telegram Bot API communication layer

**Features**:

- ✅ Direct axios-based Telegram Bot API calls
- ✅ Centralized error handling and loading states
- ✅ Type-safe API responses
- ✅ Configurable parse modes (HTML, Markdown, MarkdownV2)
- ✅ Environment-based bot token management
- ✅ Comprehensive error reporting with Telegram API error details

**API**:

```typescript
const { sendMessage, isLoading, error, clearError } = useTelegramApi();

// Send a message with full control
await sendMessage({
  chatId: 123456789,
  text: "Hello from your bot!",
  parseMode: "HTML", // Optional: HTML, Markdown, or MarkdownV2
});
```

#### 2. `useTelegramMessaging` - **OPTIMIZED**

**Purpose**: High-level messaging interface with user-friendly abstractions

**Features**:

- ✅ Simplified message sending interface
- ✅ Automatic success state management (3-second auto-reset)
- ✅ Enhanced error handling through delegated API hook
- ✅ Support for custom WebApp data sending
- ✅ Parse mode support for rich text formatting
- ✅ Backward compatibility with existing components

**API**:

```typescript
const {
  sendMessage,
  sendCustomData,
  messageSent,
  isLoading,
  error,
  clearError,
} = useTelegramMessaging();

// Simple message sending (async)
await sendMessage(targetUserId, "Your message", "HTML");

// Send custom WebApp data
sendCustomData({
  action: "user_action",
  data: { key: "value" },
});
```

#### 3. `useTelegramBot` - **EXAMPLE EXTENSION**

**Purpose**: Demonstrates how to extend the API hook for additional bot features

**Features**:

- ✅ Shows extensibility pattern for future bot API methods
- ✅ Maintains consistent interface with other hooks
- ✅ Ready for expansion (sendPhoto, sendDocument, etc.)

## 🎯 Key Improvements

### 1. **Separation of Concerns**

- **API Layer** (`useTelegramApi`): Handles raw Telegram Bot API communication
- **Business Logic** (`useTelegramMessaging`): Manages user-facing messaging features
- **Extension Layer** (`useTelegramBot`): Shows how to add more bot capabilities

### 2. **Enhanced Error Handling**

- Centralized error management in the API layer
- Detailed Telegram API error messages passed through
- Consistent error interface across all messaging hooks
- Manual error clearing capability

### 3. **Better Type Safety**

- Moved all API types to `src/types/telegram.ts`
- Exported types for reuse across hooks
- Type-safe API responses and parameters
- Optional parse mode parameter with proper typing

### 4. **Improved Performance**

- Eliminated duplicate axios imports
- Reduced code duplication between messaging functions
- More efficient error state management
- Optimized re-render patterns

### 5. **Enhanced Maintainability**

- Clear hook responsibilities and boundaries
- Reusable API layer for future bot features
- Centralized configuration and types
- Easier testing with separated concerns

## 🔧 Migration Guide

### For Existing Components

**No changes required!** The `useTelegramMessaging` hook maintains backward compatibility:

```typescript
// This still works exactly the same
const { sendMessage, messageSent, isLoading, error } = useTelegramMessaging();
await sendMessage(userId, message);
```

### For New Features

Use the lower-level `useTelegramApi` hook for more control:

```typescript
import { useTelegramApi } from "../hooks/useTelegramApi";

const { sendMessage, isLoading, error } = useTelegramApi();

const handleSend = async () => {
  try {
    await sendMessage({
      chatId: targetId,
      text: "**Bold text** in Markdown",
      parseMode: "Markdown",
    });
  } catch (err) {
    console.error("Send failed:", err);
  }
};
```

## 📚 Usage Examples

### Basic Messaging

```typescript
const MessageComponent = () => {
  const { sendMessage, messageSent, isLoading, error } = useTelegramMessaging();

  const handleSend = () => {
    sendMessage(123456789, "Hello World!");
  };

  return (
    <button onClick={handleSend} disabled={isLoading}>
      {isLoading ? "Sending..." : "Send Message"}
    </button>
  );
};
```

### Advanced Formatting

```typescript
const RichMessageComponent = () => {
  const { sendMessage } = useTelegramMessaging();

  const sendFormattedMessage = () => {
    sendMessage(
      123456789,
      "<b>Bold</b> and <i>italic</i> text with <a href='https://example.com'>link</a>",
      "HTML"
    );
  };

  return <button onClick={sendFormattedMessage}>Send Rich Message</button>;
};
```

### Direct API Usage

```typescript
const APIComponent = () => {
  const api = useTelegramApi();

  const sendDirectly = async () => {
    try {
      const response = await api.sendMessage({
        chatId: 123456789,
        text: "Direct API call",
        parseMode: "HTML",
      });
      console.log("Success:", response);
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  return <button onClick={sendDirectly}>Send via API</button>;
};
```

## 🚀 Future Extensions

The new architecture makes it easy to add more Telegram Bot API features:

### Extending useTelegramApi

```typescript
// Add to useTelegramApi hook
const sendPhoto = useCallback(async ({ chatId, photo, caption }) => {
  const response = await axios.post(`${baseUrl}/sendPhoto`, {
    chat_id: chatId,
    photo,
    caption,
  });
  return response.data;
}, []);
```

### Creating Specialized Hooks

```typescript
// New hook for media operations
export const useTelegramMedia = () => {
  const api = useTelegramApi();

  const sendPhoto = useCallback(
    async (chatId, photoUrl, caption) => {
      // Implementation using api.sendMessage base functionality
    },
    [api]
  );

  return { sendPhoto, ...api };
};
```

## 📊 Performance Benefits

- **Reduced Bundle Size**: Eliminated duplicate axios imports
- **Better Caching**: Centralized API responses
- **Fewer Re-renders**: Optimized state management
- **Enhanced Error Recovery**: Better error boundary handling

## 🔒 Security Considerations

- Bot token still uses `NEXT_PUBLIC_*` for WebApp context
- Consider backend proxy for production deployments
- API hook ready for server-side implementation
- Centralized token management for easy security updates

---

This optimization provides a solid foundation for scaling the Telegram integration while maintaining clean, maintainable code architecture.
