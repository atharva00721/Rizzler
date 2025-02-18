"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, Sparkles } from "lucide-react";
import { type Context } from "@/types";

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
    }
  };

  // Determine if the current selection is valid:
  // For custom context, it requires non-empty textarea.
  // For a predefined context, selectedContext must not be empty and not "custom".
  const isValidSelection = isCustomContext
    ? customContext.trim().length > 0
    : selectedContext !== "" && selectedContext !== "custom";

  return (
    <motion.div
      className="w-full px-4 sm:px-6 max-w-lg mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8">
        What&apos;s your goal?
      </h1>

      {/* Card wrapping the select component */}
      <Card className="border-2 transition-all duration-200 hover:border-primary/50">
        <CardHeader>
          <CardTitle>Goal</CardTitle>
          <CardDescription>
            Select a predefined goal or define your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={isCustomContext ? "custom" : selectedContext}
            onValueChange={(value) => {
              if (value === "custom") {
                setIsCustomContext(true);
                onSelect("");
              } else {
                setIsCustomContext(false);
                onSelect(value as string);
              }
            }}
          >
            <SelectTrigger className="w-full transition-all duration-200">
              <SelectValue placeholder="Choose your goal" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {contexts.map((ctx) => (
                <SelectItem
                  key={ctx.id}
                  value={ctx.label}
                  className="cursor-pointer"
                >
                  <div className="flex justify-start items-center gap-3">
                    <span className="text-xl">{ctx.emoji}</span>
                    <div className="flex flex-col items-start justify-start">
                      <span>{ctx.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {ctx.description}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
              <SelectItem
                key="custom"
                value="custom"
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <div className="flex flex-col">
                    <span>Custom Context</span>
                    <span className="text-xs text-muted-foreground">
                      Define your own specific situation
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

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
                    onSelect("");
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
        </CardContent>
      </Card>

      {/* Bottom Buttons */}
      <div className="flex justify-between space-x-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 sm:flex-initial"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            // If custom context is active, ensure the textarea has been submitted
            if (isCustomContext && !customContext.trim()) return;
            onContinue();
          }}
          disabled={!isValidSelection}
          className="flex-1 sm:flex-initial"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}

export default ContextStep;
