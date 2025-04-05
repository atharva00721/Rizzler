import { useState, useEffect } from "react";

interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetsIn: number | null; // seconds until reset
  isLoading: boolean;
  error: string | null;
}

export function useRateLimit() {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
    remaining: 0,
    limit: 0,
    resetsIn: null,
    isLoading: true,
    error: null,
  });

  const fetchRateLimitInfo = async () => {
    try {
      setRateLimitInfo((prev) => ({ ...prev, isLoading: true, error: null }));
      const res = await fetch("/api/rate-limit-info");

      if (!res.ok) {
        throw new Error("Failed to fetch rate limit information");
      }

      const data = await res.json();
      setRateLimitInfo({
        remaining: data.remaining,
        limit: data.limit,
        resetsIn: data.resetsIn,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setRateLimitInfo((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  };

  useEffect(() => {
    fetchRateLimitInfo();
  }, []);

  return {
    ...rateLimitInfo,
    refresh: fetchRateLimitInfo,
  };
}
