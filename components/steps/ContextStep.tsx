"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { type Context } from "@/types";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Sparkles } from "lucide-react";

interface ContextStepProps {
  contexts: Context[];
  selectedContext: string;
  onSelect: (context: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function ContextStep({
  contexts,
  selectedContext,
  onSelect,
  onContinue,
  onBack,
}: ContextStepProps) {
  const [isCustomContext, setIsCustomContext] = useState(false);
  const [customContext, setCustomContext] = useState("");

  const handleCustomContextSubmit = () => {
    if (customContext.trim()) {
      onSelect(customContext.trim());
      onContinue();
    }
  };

  return (
    <motion.div
      className="w-full px-4 sm:px-6 max-w-lg mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Back Button - Mobile Optimized */}

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
        What&apos;s your goal?
      </h1>

      {/* Context Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {contexts.map((ctx) => (
          <motion.div
            key={ctx.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onSelect(ctx.label);
              setIsCustomContext(false);
              onContinue();
            }}
            className={`
              relative overflow-hidden group
              p-3 rounded-xl cursor-pointer
              border transition-all duration-200
              ${
                selectedContext === ctx.label && !isCustomContext
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <span className="text-xl">{ctx.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm">
                  {ctx.label}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {ctx.description}
                </p>
                <div className="mt-1">
                  <span
                    className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${ctx.vibe === "flirty" ? "bg-pink-100 text-pink-700" : ""}
                    ${
                      ctx.vibe === "simp" ? "bg-purple-100 text-purple-700" : ""
                    }
                    ${ctx.vibe === "freaky" ? "bg-red-100 text-red-700" : ""}
                  `}
                  >
                    {ctx.vibe}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Custom Context Card */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className={`
            col-span-1 md:col-span-3
            relative overflow-hidden
            p-3 rounded-xl cursor-pointer
            border transition-all duration-200
            ${
              isCustomContext
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/50"
            }
          `}
          onClick={() => !isCustomContext && setIsCustomContext(true)}
        >
          <div className="flex items-start space-x-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Custom Context</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Define your own specific situation
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </div>

          {/* Custom Context Input */}
          {isCustomContext && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <Textarea
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="E.g., 'Reconnecting with an old friend' or 'Asking someone out after class'"
                className="w-full resize-none bg-background/50 backdrop-blur-sm"
                rows={3}
              />
              <div className="flex justify-end space-x-2 mt-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCustomContext(false);
                    setCustomContext("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCustomContextSubmit();
                  }}
                  disabled={!customContext.trim()}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      <div className="flex justify-between space-x-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 sm:flex-initial"
        >
          Back
        </Button>
      </div>
    </motion.div>
  );
}
