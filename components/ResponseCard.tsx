"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ResponseCardProps {
  message: string;
  rating: number;
  explanation: string;
  alternative: string;
  index: number;
  total: number;
}

export function ResponseCard({
  message,
  rating,
  explanation,
  alternative,
  index,
  total,
}: ResponseCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying text:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index }}
      className="bg-card text-card-foreground rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
    >
      <div className="flex justify-between items-start mb-3 sm:mb-4 md:mb-6">
        <span className="text-xs sm:text-sm text-muted-foreground">
          Response {index + 1} of {total}
        </span>
        <span className="px-2 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium">
          Rating: {rating}/10
        </span>
      </div>

      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <ResponseSection title="Message:" content={message} isQuoted large />
        <ResponseSection title="Why this works:" content={explanation} />
        <ResponseSection title="Alternative:" content={alternative} isQuoted />
        <Button onClick={handleCopy} variant="secondary" className="w-full">
          {copied ? "Copied!" : "Copy Message"}
        </Button>
      </div>
    </motion.div>
  );
}

interface ResponseSectionProps {
  title: string;
  content: string;
  isQuoted?: boolean;
  large?: boolean;
}

function ResponseSection({
  title,
  content,
  isQuoted,
  large,
}: ResponseSectionProps) {
  return (
    <div>
      <h4 className="font-semibold text-sm sm:text-base text-foreground/80 mb-1 sm:mb-2">
        {title}
      </h4>
      <p
        className={`${
          large ? "text-base sm:text-lg md:text-xl" : "text-sm sm:text-base"
        } text-foreground`}
      >
        {isQuoted ? `"${content}"` : content}
      </p>
    </div>
  );
}
