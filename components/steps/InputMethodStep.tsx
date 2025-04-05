"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RateLimitInfo } from "../RateLimitInfo";
import { BatteryCharging, Cat } from "lucide-react";

interface InputMethodStepProps {
  onSelectMethod: (method: "text" | "image") => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputMethodStep({
  onSelectMethod,
  onFileSelect,
}: InputMethodStepProps) {
  const cardHeight = "h-[150px] sm:h-[200px]";
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Check rate limit status more frequently and immediately on component mount
  useEffect(() => {
    const checkRateLimit = () => {
      try {
        const rateLimitData = localStorage.getItem("rateLimitInfo");
        if (rateLimitData) {
          const { remaining, resetsIn } = JSON.parse(rateLimitData);
          setIsRateLimited(remaining <= 0);
          setTimeLeft(resetsIn);
        }
      } catch (e) {
        console.error("Error checking rate limit:", e);
      }
    };

    // Check immediately
    checkRateLimit();

    // And set up regular checks
    const interval = setInterval(checkRateLimit, 1000);
    return () => clearInterval(interval);
  }, []);

  // Safe onSelectMethod that respects rate limit
  const handleSelectMethod = (method: "text" | "image") => {
    if (isRateLimited) return;
    onSelectMethod(method);
  };

  // Safe file select handler that respects rate limit
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isRateLimited) return;
    onFileSelect(e);
  };

  // Format time remaining as mm:ss
  const formatTimeRemaining = (seconds: number) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Fun recharge messages
  const rechargeMessages = [
    "Recharging rizz powers...",
    "Rizz machine cooling down...",
    "Getting your smooth lines ready...",
    "Rizz battery needs a moment...",
    "Rizz-o-meter recharging...",
  ];

  const getRandomRechargeMessage = () => {
    const index = Math.floor(Math.random() * rechargeMessages.length);
    return rechargeMessages[index];
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col items-center justify-center px-4"
    >
      <div className="max-w-xl w-full text-center space-y-4 sm:space-y-6">
        {isRateLimited ? (
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground px-4">
            <Cat className="inline-block mr-2 text-red-500" size={28} />
            Rizz Break Time!
          </h1>
        ) : (
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground px-4">
            How would you like to share your conversation?
          </h1>
        )}

        {isRateLimited ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-lg bg-muted"
          >
            <BatteryCharging className="w-16 h-16 mx-auto mb-4 text-amber-500" />
            <h2 className="text-xl font-bold mb-2">
              {getRandomRechargeMessage()}
            </h2>
            <p className="mb-4 text-muted-foreground">
              Your rizz powers need time to recharge. Take a breather and come
              back in:
            </p>
            <div className="text-3xl font-mono font-bold text-primary">
              {formatTimeRemaining(timeLeft || 0)}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Good things come to those who wait. Your rizz game will be
              stronger after the cooldown!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-4">
            {/* Text Option */}
            <Card
              className={`${cardHeight} hover:bg-muted cursor-pointer transition-all`}
              onClick={() => handleSelectMethod("text")}
            >
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-3xl sm:text-4xl mb-2 sm:mb-4">
                  💬
                </CardTitle>
                <CardDescription>
                  <h3 className="text-lg sm:text-xl font-semibold">
                    Text Input
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                    Type or paste your conversation
                  </p>
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Image Option */}
            <div className="relative">
              <input
                type="file"
                id="image-input"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isRateLimited}
              />
              <label
                htmlFor="image-input"
                className={`block ${
                  isRateLimited ? "pointer-events-none" : ""
                }`}
              >
                <Card
                  className={`${cardHeight} hover:bg-muted ${
                    isRateLimited ? "opacity-50" : "cursor-pointer"
                  } transition-all`}
                >
                  <CardHeader>
                    <CardTitle className="text-4xl mb-4 block">📸</CardTitle>
                    <CardDescription>
                      <h3 className="text-xl font-semibold">Screenshot</h3>
                      <p className="text-muted-foreground mt-2">
                        Upload a conversation image
                      </p>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </label>
            </div>
          </div>
        )}

        <div className="z-10 w-full px-10">
          <RateLimitInfo />
        </div>
      </div>
    </motion.div>
  );
}
