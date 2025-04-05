"use client";
import { useState, useEffect } from "react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { AlertCircle, Clock, Zap, BatteryCharging } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function RateLimitInfo() {
  const [rateLimitInfo, setRateLimitInfo] = useState({
    remaining: 0,
    limit: 0,
    resetsIn: null as number | null,
    isLoading: true,
    error: null as string | null,
  });
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Format time remaining as mm:ss
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

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

  // Initial fetch
  useEffect(() => {
    fetchRateLimitInfo();
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(fetchRateLimitInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  // Store rate limit info in localStorage for other components to access
  useEffect(() => {
    if (!rateLimitInfo.isLoading && rateLimitInfo.limit > 0) {
      localStorage.setItem(
        "rateLimitInfo",
        JSON.stringify({
          remaining: rateLimitInfo.remaining,
          limit: rateLimitInfo.limit,
          resetsIn: timeLeft,
        })
      );
    }
  }, [rateLimitInfo, timeLeft]);

  // Set up countdown timer
  useEffect(() => {
    if (rateLimitInfo.resetsIn === null) {
      setTimeLeft(null);
      return;
    }

    setTimeLeft(rateLimitInfo.resetsIn);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setTimeout(() => fetchRateLimitInfo(), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rateLimitInfo.resetsIn]);

  const { remaining, limit } = rateLimitInfo;
  const percentage = limit > 0 ? (remaining / limit) * 100 : 0;

  let badgeVariant: "outline" | "secondary" | "destructive" = "outline";
  if (remaining <= 1) {
    badgeVariant = "destructive";
  } else if (remaining <= Math.floor(limit / 2)) {
    badgeVariant = "secondary";
  }

  // Fun messages based on remaining API calls
  const getFunMessage = () => {
    if (remaining === 0) return "Rizz battery drained! Time to recharge...";
    if (remaining === 1) return "Last shot at rizz glory!";
    if (remaining <= Math.floor(limit / 4)) return "Rizz running low!";
    if (remaining <= Math.floor(limit / 2)) return "Still got some rizz juice!";
    return "Rizz power fully charged!";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={`overflow-hidden shadow-md border-opacity-50 hover:shadow-lg transition-shadow ${
              remaining === 0 ? "animate-pulse border-red-500" : ""
            }`}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {remaining === 0 ? (
                    <BatteryCharging className="h-4 w-4 text-red-500" />
                  ) : (
                    <Zap
                      className={`h-4 w-4 ${
                        remaining <= Math.floor(limit / 4)
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }`}
                    />
                  )}
                  <span className="text-sm font-medium">Rizz Power</span>
                  <Badge variant={badgeVariant} className="text-xs font-medium">
                    {remaining}/{limit}
                  </Badge>
                </div>
              </div>

              <Progress
                value={percentage}
                className="h-1.5"
                indicatorClassName={
                  remaining <= 1
                    ? "bg-red-500"
                    : remaining <= Math.floor(limit / 2)
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }
              />

              <div className="flex items-center text-xs mt-1.5 justify-between">
                <span
                  className={`${
                    remaining === 0
                      ? "text-destructive font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {getFunMessage()}
                </span>

                {timeLeft !== null && timeLeft > 0 && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1 inline" />
                    <span>Recharges in {formatTimeRemaining(timeLeft)}</span>
                  </div>
                )}
              </div>

              {rateLimitInfo.isLoading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{getFunMessage()}</p>
          {remaining === 0 ? (
            <p className="text-xs text-destructive">
              Your rizz powers need time to recharge!
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {remaining} rizz attempt{remaining !== 1 ? "s" : ""} remaining
            </p>
          )}
          {timeLeft !== null && timeLeft > 0 && (
            <p className="text-xs text-muted-foreground">
              Power recharges in {formatTimeRemaining(timeLeft)}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const isRateLimitReached = () => {
  // This is a client component, so we need to use localStorage to share state
  // between components without prop drilling
  const rateLimitData = localStorage.getItem("rateLimitInfo");
  if (!rateLimitData) return false;

  try {
    const { remaining } = JSON.parse(rateLimitData);
    return remaining === 0;
  } catch (e) {
    return false;
  }
};
