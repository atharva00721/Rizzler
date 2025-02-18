"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type Context } from "@/types";

interface ContextStepProps {
    contexts: Context[];
    selectedContext: string;
    onSelect: (context: string) => void;
    onCustomContext: (context: string) => void;
    onContinue: () => void;
    onBack: () => void;
}

export function ContextStep({
    contexts,
    selectedContext,
    onSelect,
    onCustomContext,
    onContinue,
    onBack,
}: ContextStepProps) {
    return (
        <motion.div
            // ...existing motion props...
        >
            <div className="max-w-xl w-full space-y-6">
                <h1 className="text-3xl font-bold text-foreground">
                    Choose a Context
                </h1>
                {/* ...existing context options... */}
                
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
                        disabled={!selectedContext}
                    >
                        Continue →
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
