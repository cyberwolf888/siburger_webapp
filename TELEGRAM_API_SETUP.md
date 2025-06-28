# Telegram Bot API Setup

## Environment Configuration

To use the Telegram Bot API for sending messages, you need to configure your bot token:

1. **Create a Telegram Bot**:

   - Message @BotFather on Telegram
   - Use `/newbot` command to create a new bot
   - Follow the instructions to get your bot token

2. **Configure Environment Variables**:
   - Copy `.env.local` and set your bot token:
   ```bash
   NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
   ```

## API Usage

The `useTelegramMessaging` hook now uses the Telegram Bot API directly:

```typescript
const { sendMessage, isLoading, error, messageSent } = useTelegramMessaging();

// Send a message (now async)
await sendMessage(chatId, "Hello from your bot!");
```

## Features

- **Direct API Integration**: Uses axios to call Telegram Bot API
- **Async Support**: Properly handles async operations
- **Error Handling**: Comprehensive error handling with Telegram API error messages
- **Type Safety**: Full TypeScript support with proper error types
- **HTML Formatting**: Supports HTML parse mode for rich text messages

## Security Notes

- Bot token is exposed as `NEXT_PUBLIC_*` for client-side usage
- Consider implementing a backend API endpoint for production use
- The current setup is suitable for development and WebApp contexts
