import { useEffect, useState, useCallback } from "react";

export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
  photo_url?: string;
};

interface UseTelegramWebAppReturn {
  user: TelegramUser | null;
  isReady: boolean;
  isAvailable: boolean;
  sendData: (data: object) => void;
  webApp: unknown;
}

export const useTelegramWebApp = (): UseTelegramWebAppReturn => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const sendData = useCallback((data: object) => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify(data));
    } else {
      console.warn("Telegram WebApp not available");
    }
  }, []);

  useEffect(() => {
    const initializeTelegramWebApp = () => {
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;
        setIsAvailable(true);

        // Initialize WebApp
        webApp.ready();
        setIsReady(true);

        // Get user data
        if (webApp.initDataUnsafe?.user) {
          setUser(webApp.initDataUnsafe.user);
          console.log("Telegram WebApp User Data:", webApp.initDataUnsafe.user);
        } else {
          console.log("No user data available");
        }

        // Expand the WebApp to full height if available
        if ("expand" in webApp && typeof webApp.expand === "function") {
          webApp.expand();
        }

        return true;
      }
      return false;
    };

    // Try to initialize immediately
    if (initializeTelegramWebApp()) {
      return;
    }

    // If not available, poll until it becomes available
    const checkInterval = setInterval(() => {
      if (initializeTelegramWebApp()) {
        clearInterval(checkInterval);
      }
    }, 100);

    // Cleanup interval after 10 seconds to avoid infinite polling
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      console.log("Telegram WebApp script not loaded within timeout period");
    }, 10000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  return {
    user,
    isReady,
    isAvailable,
    sendData,
    webApp:
      typeof window !== "undefined" ? window.Telegram?.WebApp || null : null,
  };
};
