import { useCallback } from "react";
import { useTelegramApi } from "./useTelegramApi";

interface UseTelegramBotReturn {
  sendMessage: (
    chatId: number,
    text: string,
    parseMode?: "HTML" | "Markdown" | "MarkdownV2"
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Extended hook for additional Telegram Bot API operations
 * This demonstrates how the useTelegramApi hook can be extended
 * for more complex bot interactions beyond basic messaging
 */
export const useTelegramBot = (): UseTelegramBotReturn => {
  const telegramApi = useTelegramApi();

  const sendMessage = useCallback(
    async (
      chatId: number,
      text: string,
      parseMode: "HTML" | "Markdown" | "MarkdownV2" = "HTML"
    ) => {
      await telegramApi.sendMessage({ chatId, text, parseMode });
    },
    [telegramApi]
  );

  return {
    sendMessage,
    isLoading: telegramApi.isLoading,
    error: telegramApi.error,
    clearError: telegramApi.clearError,
  };
};
