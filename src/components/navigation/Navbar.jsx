import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui";
import { AuthContext } from "@/features/auth/providers/AuthProvider";
import useLogout from "@/features/auth/hooks/useLogout";
import NotificationHub from "./NotificationHub"; // Imported seamlessly right here!

export default function Navbar() {
  const { user } = React.useContext(AuthContext);
  const logoutMutation = useLogout();

  const username = user?.username || "Explorer";
  const avatarUrl =
    user?.profilePicture ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
  const journalingStreak = user?.streaks?.journalingStreak || 0;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Side: Personal Greeting context */}
        <div>
          <h1 className="text-sm font-medium text-slate-400">
            Welcome back,{" "}
            <span className="text-slate-100 font-semibold">{username}</span>
          </h1>
        </div>

        {/* Right Side: Identity Layout & Hub Indicators */}
        <div className="flex items-center gap-4">
          {/* SYSTEM INTEGRATION: Mounted notification hub center */}
          <NotificationHub />

          {/* Dynamic Streak Badge */}
          {journalingStreak > 0 && (
            <div
              className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse"
              title="Your daily consecutive journaling streak!"
            >
              🔥 {journalingStreak} Day Streak
            </div>
          )}

          {/* Interactive User Settings Link Anchor */}
          <Link
            to="/app/settings"
            className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 hover:border-violet-500/30 pl-3 pr-2 py-1 rounded-xl transition group"
          >
            <span className="text-xs font-semibold text-slate-300 group-hover:text-slate-100 transition hidden sm:inline-block">
              {username}
            </span>
            <img
              src={avatarUrl}
              alt={username}
              className="w-7 h-7 rounded-lg border border-white/10 group-hover:border-violet-400/50 bg-slate-900 object-cover transition"
            />
          </Link>

          {/* Divider line split strip */}
          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Exit Access System Trigger Button */}
          <Button
            variant="secondary"
            size="sm"
            isLoading={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            className="bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-medium"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
