"use client";
import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


interface InputMethodStepProps {
  onSelectMethod: (method: "text" | "image") => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputMethodStep({
  onSelectMethod,
  onFileSelect,
}: InputMethodStepProps) {
  const cardHeight = "h-[150px] sm:h-[200px]";
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col items-center justify-center px-4"
    >
      <div className="max-w-xl w-full text-center space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground px-4">
          How would you like to share your conversation?
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-4">
          {/* Text Option */}
          <Card
            className={`${cardHeight} hover:bg-muted cursor-pointer`}
            onClick={() => onSelectMethod("text")}
          >
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-3xl sm:text-4xl mb-2 sm:mb-4">
                💬
              </CardTitle>
              <CardDescription>
                <h3 className="text-lg sm:text-xl font-semibold">Text Input</h3>
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
              onChange={onFileSelect}
              className="hidden"
            />
            <label htmlFor="image-input" className="block">
              <Card className={`${cardHeight} hover:bg-muted cursor-pointer`}>
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

        <div className="flex items-center justify-center space-x-4 mt-6">
          {/* <Button
            onClick={() => onSelectMethod("text")}
            variant="default"
            className="flex-1 sm:flex-initial"
          >
            Continue →
          </Button> */}
        </div>
      </div>
    </motion.div>
  );
}
