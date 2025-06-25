import { useState, useCallback } from "react";
import { useTelegramWebApp } from "./useTelegramWebApp";

interface MessageData {
  action: string;
  target_user_id?: number;
  message?: string;
  [key: string]: unknown;
}

interface UseTelegramMessagingReturn {
  sendMessage: (targetUserId: number, message: string) => void;
  sendCustomData: (data: MessageData) => void;
  messageSent: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useTelegramMessaging = (): UseTelegramMessagingReturn => {
  const { sendData, isAvailable } = useTelegramWebApp();
  const [messageSent, setMessageSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    (targetUserId: number, message: string) => {
      if (!isAvailable) {
        setError("Telegram WebApp not available");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        sendData({
          action: "send_message",
          target_user_id: targetUserId,
          message: message,
        });

        setMessageSent(true);
        console.log(`Message sent to user ${targetUserId}: ${message}`);

        // Reset messageSent after 3 seconds
        setTimeout(() => setMessageSent(false), 3000);
      } catch (err) {
        setError("Failed to send message");
        console.error("Error sending message:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [sendData, isAvailable]
  );

  const sendCustomData = useCallback(
    (data: MessageData) => {
      if (!isAvailable) {
        setError("Telegram WebApp not available");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        sendData(data);
        setMessageSent(true);
        console.log("Custom data sent:", data);

        // Reset messageSent after 3 seconds
        setTimeout(() => setMessageSent(false), 3000);
      } catch (err) {
        setError("Failed to send data");
        console.error("Error sending data:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [sendData, isAvailable]
  );

  return {
    sendMessage,
    sendCustomData,
    messageSent,
    isLoading,
    error,
  };
};
