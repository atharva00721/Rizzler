"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { type ConversationStage } from "@/types";

interface StageStepProps {
  stage: ConversationStage;
  onSelect: (stage: ConversationStage) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function StageStep({ stage, onContinue, onBack }: StageStepProps) {
  return (
    <motion.div>
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          Where are you in the conversation?
        </h1>

        <div className="flex justify-between space-x-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 sm:flex-initial"
          >
            Back
          </Button>
          <Button
            onClick={onContinue}
            variant="default"
            className="flex-1 sm:flex-initial"
            disabled={!stage}
          >
            Continue →
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
