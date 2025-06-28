import { useState, useCallback } from "react";
import axios from "axios";
import { TelegramApiResponse, SendMessageParams } from "../types/telegram";

interface UseTelegramApiReturn {
  sendMessage: (params: SendMessageParams) => Promise<TelegramApiResponse>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useTelegramApi = (): UseTelegramApiReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async ({
      chatId,
      text,
      parseMode = "HTML",
    }: SendMessageParams): Promise<TelegramApiResponse> => {
      // Get bot token from environment variables
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;

      if (!botToken) {
        const errorMsg = "Telegram bot token not configured";
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      setIsLoading(true);
      setError(null);

      try {
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const response = await axios.post<TelegramApiResponse>(telegramApiUrl, {
          chat_id: chatId,
          text,
          parse_mode: parseMode,
        });

        if (response.data.ok) {
          console.log(`Message sent to chat ${chatId}: ${text}`);
          return response.data;
        } else {
          const errorMsg =
            response.data.description || "Failed to send message";
          setError(errorMsg);
          throw new Error(errorMsg);
        }
      } catch (err: unknown) {
        let errorMessage: string;

        if (err && typeof err === "object" && "response" in err) {
          // This is likely an axios error
          const axiosErr = err as {
            response?: { data?: TelegramApiResponse };
            message?: string;
          };
          const errorData = axiosErr.response?.data;
          errorMessage =
            errorData?.description || axiosErr.message || "Network error";
          console.error("Telegram API error:", axiosErr.response?.data);
        } else {
          errorMessage = err instanceof Error ? err.message : "Unknown error";
          console.error("Error sending message:", err);
        }

        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    sendMessage,
    isLoading,
    error,
    clearError,
  };
};
