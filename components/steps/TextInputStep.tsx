"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Card } from "../ui/card";

interface TextInputStepProps {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void; // Add this prop
}

export function TextInputStep({
  value,
  onChange,
  onContinue,
  onBack, // Add this prop
}: TextInputStepProps) {
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (value.trim() !== "") {
      onContinue();
      setError(null);
    } else {
      setError("Please enter your conversation.");
    }
  };

  return (
    <motion.div
      key="step1.5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col items-center justify-center px-4"
    >
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          Share your conversation
        </h1>
        <Textarea
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your conversation here..."
          className="w-full h-48 p-4 rounded-xl border-2 bg-background text-foreground border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {error && (
          <Card>
            <p className="text-destructive">{error}</p>
          </Card>
        )}
        <div className="flex justify-between space-x-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 sm:flex-initial"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            variant="default"
            className="flex-1 sm:flex-initial"
          >
            Continue →
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
