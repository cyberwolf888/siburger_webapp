"use client";

import { useTelegramWebApp } from "../hooks/useTelegramWebApp";
import {
  UserProfile,
  LoadingPlaceholder,
} from "../components/TelegramComponents";
import { BurgerProducts } from "../components/BurgerProducts";

export default function Home() {
  const { user, isReady, isAvailable } = useTelegramWebApp();

  const isUserDataAvailable = user && isReady && isAvailable;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="grid grid-rows-[1fr_auto] items-center justify-items-center min-h-screen p-4 pb-20 gap-8 sm:p-8">
        <main className="flex flex-col gap-8 row-start-1 items-center justify-center w-full max-w-6xl mx-auto">
          {/* User Profile Section */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mx-auto">
            {isUserDataAvailable ? (
              <UserProfile user={user} />
            ) : (
              <LoadingPlaceholder
                message={
                  !isAvailable
                    ? "This app works only in Telegram WebApp"
                    : "Loading user data..."
                }
              />
            )}
          </div>

          {/* Burger Products Section */}
          {isUserDataAvailable && (
            <div className="w-full">
              <BurgerProducts />
            </div>
          )}

          {/* App Info Section */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Telegram WebApp
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-600">Status</span>
                  <span
                    className={`text-xs ${
                      isAvailable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isAvailable ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-600">Ready</span>
                  <span
                    className={`text-xs ${
                      isReady ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {isReady ? "Yes" : "Loading..."}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-600">User</span>
                  <span
                    className={`text-xs ${
                      user ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {user ? "Loaded" : "None"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="row-start-2 text-center text-xs text-gray-500">
          <p>Powered by Telegram WebApp API</p>
        </footer>
      </div>
    </div>
  );
}
