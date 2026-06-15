import { useQuery } from "@tanstack/react-query";

import { getTodos } from "../api/todoApi";
// Fetch and automatically sort into categories for easy mapping
export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
    select: (data) => {
      const list = data || [];
      const active = list.filter((t) => t.status === "pending");

      // Filter out items checked off within the last 24 hours for reflection
      const completedToday = list.filter((t) => {
        if (t.status !== "completed" || !t.completedAt) return false;
        const completionDate = new Date(t.completedAt);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return completionDate > twentyFourHoursAgo;
      });

      return {
        today: active.filter((t) => t.horizonType === "today"),
        week: active.filter((t) => t.horizonType === "week"),
        later: active.filter((t) => t.horizonType === "later"),
        completedToday, // Easily importable anywhere in your app!
      };
    },
  });
}
