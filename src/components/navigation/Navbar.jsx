import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui";
import { AuthContext } from "@/features/auth/providers/AuthProvider";
import useLogout from "@/features/auth/hooks/useLogout";
import NotificationHub from "./NotificationHub";

export default function Navbar() {
  const { user } = React.useContext(AuthContext);
  const logoutMutation = useLogout();

  const username = user?.username || "Explorer";
  const avatarUrl =
    user?.profilePicture ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
  const journalingStreak = user?.streaks?.journalingStreak || 0;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--surface-primary)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Side */}
        <div className="hidden sm:block">
          <h1 className="text-sm font-medium text-[var(--text-secondary)]">
            Welcome back,{" "}
            <span className="text-[var(--text-primary)] font-semibold">
              {username}
            </span>
          </h1>
        </div>

        {/* Mobile Logo Title */}
        <div className="block sm:hidden text-lg font-bold text-[var(--text-primary)]">
          Journal App
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationHub />

          {journalingStreak > 0 && (
            <div
              className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse"
              title="Your daily consecutive journaling streak!"
            >
              🔥 {journalingStreak}
            </div>
          )}

          <Link
            to="/app/settings"
            className="flex items-center gap-2.5 bg-[var(--surface-subtle)] border border-[var(--border-default)] hover:border-[var(--accent-primary)]/50 sm:pl-3 pr-2 py-1 p-1 rounded-xl transition-all group"
          >
            <span className="text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition hidden sm:inline-block">
              {username}
            </span>
            <img
              src={avatarUrl}
              alt={username}
              className="w-7 h-7 rounded-lg border border-[var(--border-subtle)] bg-[var(--background-secondary)] object-cover transition"
            />
          </Link>

          <div className="h-4 w-px bg-[var(--border-default)] hidden sm:block" />

          <Button
            variant="secondary"
            size="sm"
            isLoading={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            className="text-xs font-medium px-2 sm:px-3 h-8 rounded-lg"
            title="Logout"
          >
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">🚪</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
