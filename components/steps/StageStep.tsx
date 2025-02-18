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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { relationshipStages } from "@/data/stages";
import { type ConversationStage } from "@/types";
import { Heart } from "lucide-react";

interface StageStepProps {
  selectedStage: ConversationStage;
  onSelect: (stage: ConversationStage) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function StageStep({
  selectedStage,
  onSelect,
  onBack,
  onContinue,
}: StageStepProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedStageInfo = relationshipStages.find(
    (stage) => stage.id === selectedStage
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md sm:max-w-lg md:max-w-xl w-full space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          What's your relationship status?
        </motion.h1>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Help me understand your situation better.
        </motion.p>
      </div>

      {/* Card with Select */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-2 transition-all duration-200 hover:border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Relationship Stage
            </CardTitle>
            <CardDescription>
              Select the option that best describes your current situation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedStage}
              onValueChange={(value) => {
                onSelect(value as ConversationStage);
                setIsOpen(false);
              }}
              onOpenChange={setIsOpen}
            >
              <SelectTrigger
                className={`w-full transition-all duration-200 ${
                  isOpen ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
              >
                <SelectValue placeholder="Choose your stage">
                  {selectedStageInfo && (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {selectedStageInfo.emoji}
                      </span>
                      <span>{selectedStageInfo.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {relationshipStages.map((stage) => (
                  <SelectItem
                    key={stage.id}
                    value={stage.id}
                    className="focus:bg-primary/5 cursor-pointer"
                  >
                    <div className="flex flex-col py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{stage.emoji}</span>
                        <span className="font-medium">{stage.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 ml-9">
                        {stage.desc}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedStageInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-muted/50 rounded-lg"
              >
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Selected:{" "}
                  </span>
                  {selectedStageInfo.desc}
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex w-full   space-x-3"
      >
        <div className="flex w-full justify-between space-x-4">
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
          >
            Continue →
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default StageStep;
