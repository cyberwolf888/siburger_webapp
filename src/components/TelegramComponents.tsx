import Image from "next/image";
import { TelegramUser } from "../types/telegram";

interface UserProfileProps {
  user: TelegramUser;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Image
          src={user.photo_url || "/default-avatar.png"}
          alt="User Avatar"
          width={100}
          height={100}
          className="rounded-full border-4 border-blue-100 shadow-lg"
        />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user.first_name} {user.last_name || ""}
        </h1>
        {user.username && (
          <p className="text-sm text-gray-500 mt-1">@{user.username}</p>
        )}
      </div>
    </div>
  );
};

interface MessageButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const MessageButton = ({
  onClick,
  disabled,
  isLoading,
}: MessageButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative rounded-full border border-solid transition-all duration-200 
        flex items-center justify-center font-medium text-sm sm:text-base 
        h-12 sm:h-14 px-6 sm:px-8 min-w-[160px]
        ${
          disabled || isLoading
            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border-blue-500 bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-600 active:transform active:scale-95 shadow-lg hover:shadow-xl"
        }
      `}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Sending...</span>
        </div>
      ) : (
        "Send Message"
      )}
    </button>
  );
};

interface StatusMessageProps {
  messageSent: boolean;
  error: string | null;
}

export const StatusMessage = ({ messageSent, error }: StatusMessageProps) => {
  if (error) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      </div>
    );
  }

  if (messageSent) {
    return (
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-600 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Message sent successfully!
        </p>
      </div>
    );
  }

  return null;
};

interface LoadingPlaceholderProps {
  message?: string;
}

export const LoadingPlaceholder = ({
  message = "Loading user data...",
}: LoadingPlaceholderProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};
