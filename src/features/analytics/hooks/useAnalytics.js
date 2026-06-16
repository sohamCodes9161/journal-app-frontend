import { useState, useEffect, useCallback } from "react";
import { fetchWorkspaceAnalytics } from "../api/analyticsApi";

export const useAnalytics = (initialRange = "week") => {
  const [range, setRange] = useState(initialRange);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await fetchWorkspaceAnalytics(range);
      setData(payload);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to parse analytical matrices."
      );
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    range,
    setRange,
    data,
    isLoading,
    error,
    refetch: loadAnalytics,
  };
};
