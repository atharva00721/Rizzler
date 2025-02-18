"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

import { InputMethodStep } from "@/components/steps/InputMethodStep";
import { TextInputStep } from "@/components/steps/TextInputStep";
import { ResponseCard } from "@/components/response/ResponseCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

import {
  type Response,
  type InputMethod,
  type ConversationStage,
  type Context,
} from "@/types";

// Reusable TextInput (if needed by TextInputStep)
// interface TextInputProps {
//   value: string;
//   onChange: (val: string) => void;
//   placeholder?: string;
// }
// function TextInput({ value, onChange, placeholder }: TextInputProps) {
//   return (
//     <textarea
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full h-48 p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
//     />
//   );
// }

export default function Home() {
  // States for entire flow
  const [currentStep, setCurrentStep] = useState<number | string>(1);
  const [inputMethod, setInputMethod] = useState<InputMethod>("text");
  const [textInputValue, setTextInputValue] = useState("");
  const [imageInput, setImageInput] = useState<File | null>(null);
  const [selectedContext, setSelectedContext] = useState("");
  const [conversationStage, setConversationStage] =
    useState<ConversationStage>("early");
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [isCustomContext, setIsCustomContext] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);

  // Carousel for responses
  const [carouselRef] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
  });

  // Predefined contexts
  const contexts: Context[] = [
    {
      id: 1,
      label: "First Move",
      description: "Nail that opener",
      emoji: "👋",
    },
    { id: 2, label: "Mid-Game", description: "Keep it flowing", emoji: "💬" },
    { id: 3, label: "End Game", description: "Bring it home", emoji: "🎯" },
  ];

  // Handle file input on step 1
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageInput(e.target.files?.[0] || null);
    // Auto-advance to context screen after file selection
    setTimeout(() => setCurrentStep(2), 500);
  };

  // Generate responses API call
  const handleGenerateResponses = async () => {
    if (!conversationStage || (!textInputValue && !imageInput)) {
      setError("Please complete all inputs before proceeding!");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    if (imageInput) {
      formData.append("image", imageInput);
    } else {
      formData.append("conversationText", textInputValue);
    }
    // Use either custom context or selected predefined context
    formData.append(
      "context",
      isCustomContext ? customContext : selectedContext
    );
    formData.append("stage", conversationStage);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errMessage = await res.text();
        throw new Error(errMessage || "Failed to fetch responses");
      }
      const data: Response[] = await res.json();
      setResponses(data);
      setCurrentStep(5); // Move to results step.
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset state and start over
  const resetState = () => {
    setTextInputValue("");
    setImageInput(null);
    setSelectedContext("");
    setConversationStage("early");
    setResponses([]);
    setError("");
    setCustomContext("");
    setIsCustomContext(false);
  };

  const handleReset = () => {
    resetState();
    setCurrentStep(1);
  };

  // Reusable Back Button functionality
  const handleBack = () => {
    // simple step handling based on current step.
    switch (currentStep) {
      case 1.5:
        setCurrentStep(1);
        break;
      case 2:
        setCurrentStep(inputMethod === "text" ? 1.5 : 1);
        break;
      case 3:
        setCurrentStep(2);
        break;
      case 4:
        setCurrentStep(3);
        break;
      case 5:
        setCurrentStep(4);
        break;
      default:
        setCurrentStep(1);
    }
  };

  const handleBackWithConfirmation = () => {
    // Add confirmation for steps with significant input
    if (
      currentStep === 4 ||
      (currentStep === 1.5 && textInputValue.length > 0) ||
      (currentStep === 2 && (selectedContext || customContext))
    ) {
      setShowBackConfirmation(true);
    } else {
      handleBack();
    }
  };

  // Reusable Back Button component
  const BackButton = () => (
    <Button
      onClick={handleBackWithConfirmation}
      variant="ghost"
      className="absolute top-4 left-4 flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
      <span>Back</span>
    </Button>
  );

  // Confirmation Dialog for going back
  const BackConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Going back will clear your current progress. Do you want to continue?
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            variant="ghost"
            onClick={() => setShowBackConfirmation(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setShowBackConfirmation(false);
              handleBack();
            }}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-background to-muted overflow-hidden">
      <Navbar />
      <AnimatePresence mode="wait">
        {/* Step 1: Input Method */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative h-full flex flex-col items-center justify-center px-4"
          >
            <div className="max-w-md sm:max-w-lg md:max-w-xl w-full text-center space-y-8">
              <InputMethodStep
                onSelectMethod={(method) => {
                  setInputMethod(method);
                  setCurrentStep(method === "text" ? 1.5 : 2);
                }}
                onFileSelect={handleFileInput}
                onBack={handleBackWithConfirmation}
              />
            </div>
          </motion.div>
        )}

        {/* Step 1.5: Text Input */}
        {currentStep === 1.5 && (
          <motion.div
            key="step1.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative h-full flex flex-col items-center justify-center px-4"
          >
            <div className="max-w-md sm:max-w-lg md:max-w-xl w-full space-y-8 text-center">
              <TextInputStep
                value={textInputValue}
                onChange={setTextInputValue}
                onContinue={() => setCurrentStep(2)}
                onBack={handleBackWithConfirmation}
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: Context Selection */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative h-full flex flex-col items-center justify-center px-4"
          >
            <div className="max-w-md sm:max-w-lg md:max-w-xl w-full space-y-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                Choose a Context
              </h1>
              <div className="space-y-4">
                {contexts.map((ctx) => (
                  <div
                    key={ctx.id}
                    onClick={() => {
                      setSelectedContext(ctx.label);
                      setIsCustomContext(false);
                      setTimeout(() => setCurrentStep(3), 500);
                    }}
                    className={`p-6 bg-card text-card-foreground rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                      selectedContext === ctx.label && !isCustomContext
                        ? "border-2 border-primary"
                        : ""
                    }`}
                  >
                    <span className="text-2xl mr-2">{ctx.emoji}</span>
                    <h3 className="text-xl font-semibold">{ctx.label}</h3>
                    <p className="text-muted-foreground mt-2">
                      {ctx.description}
                    </p>
                  </div>
                ))}

                {/* Custom Context Option */}
                <div className="relative">
                  <div
                    onClick={() => setIsCustomContext(true)}
                    className={`p-6 bg-card text-card-foreground rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                      isCustomContext ? "border-2 border-primary" : ""
                    }`}
                  >
                    <span className="text-2xl mr-2">✨</span>
                    <h3 className="text-xl font-semibold">Custom Context</h3>
                    <p className="text-muted-foreground mt-2">
                      Define your own specific situation
                    </p>
                  </div>

                  {/* Custom Context Input */}
                  {isCustomContext && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <div className="bg-muted p-4 rounded-xl">
                        <textarea
                          value={customContext}
                          onChange={(e) => setCustomContext(e.target.value)}
                          placeholder="Describe your specific situation..."
                          className="w-full p-3 rounded-lg border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background"
                          rows={3}
                        />
                        <div className="mt-4 flex justify-end space-x-3">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setIsCustomContext(false);
                              setCustomContext("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              if (customContext.trim()) {
                                setSelectedContext(customContext.trim());
                                setTimeout(() => setCurrentStep(3), 500);
                              }
                            }}
                            disabled={!customContext.trim()}
                            variant="default"
                          >
                            Save & Continue
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Navigation Button */}
              <div className="flex justify-between space-x-4 mt-6">
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="flex-1 sm:flex-initial"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  variant="default"
                  className="flex-1 sm:flex-initial"
                  disabled={!selectedContext}
                >
                  Continue →
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Conversation Stage */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative h-full flex flex-col items-center justify-center px-4"
          >
            <BackButton />
            <div className="max-w-md sm:max-w-lg md:max-w-xl w-full space-y-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                Where are you in the conversation?
              </h1>
              <div className="space-y-4">
                {["early", "mid", "closing"].map((stage) => (
                  <div
                    key={stage}
                    onClick={() => {
                      setConversationStage(stage as ConversationStage);
                      setCurrentStep(4);
                    }}
                    className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                      conversationStage === stage
                        ? "border-2 border-purple-500"
                        : ""
                    }`}
                  >
                    <h3 className="text-xl font-semibold">
                      {stage === "early" && "Just Starting 🌱"}
                      {stage === "mid" && "In Progress 🔄"}
                      {stage === "closing" && "Finalizing 🎯"}
                    </h3>
                  </div>
                ))}
              </div>
              <div className="flex justify-between space-x-4 mt-6">
                <Button
                  onClick={() => setCurrentStep(2)}
                  variant="outline"
                  className="flex-1 sm:flex-initial"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  variant="default"
                  className="flex-1 sm:flex-initial"
                  disabled={!conversationStage}
                >
                  Continue →
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Confirmation Screen */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative h-full flex flex-col items-center justify-center px-6"
          >
            <BackButton />
            <div className="max-w-md sm:max-w-lg md:max-w-xl w-full space-y-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Ready to Rizz? ✨
              </h1>
              <div className="bg-card text-card-foreground rounded-xl shadow-lg p-6 space-y-4">
                {/* Display chosen input */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                    Your Input
                  </h2>
                  {inputMethod === "text" ? (
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm text-gray-600 dark:text-gray-300">
                      {`"${textInputValue}"`}
                    </p>
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm text-gray-600 dark:text-gray-300">
                      ✅ Image uploaded:{" "}
                      {imageInput?.name || "No file selected"}
                    </p>
                  )}
                </div>
                {/* Selected Context */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                    Context
                  </h2>
                  <p className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm text-gray-600 dark:text-gray-300">
                    {selectedContext}
                  </p>
                </div>
                {/* Conversation Stage */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                    Stage
                  </h2>
                  <p className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {conversationStage}
                  </p>
                </div>
              </div>
              <div className="flex justify-between space-x-4 mt-6">
                <Button
                  onClick={() => setCurrentStep(3)}
                  variant="outline"
                  className="flex-1 sm:flex-initial"
                >
                  Back
                </Button>
                <Button
                  onClick={handleGenerateResponses}
                  variant="default"
                  className="flex-1 sm:flex-initial"
                >
                  {loading ? "Generating..." : "Generate Responses →"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 5: Show Generated Responses */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative min-h-screen flex flex-col bg-background pt-20 pb-4 px-4"
          >
            <BackButton />
            <div className="max-w-md md:max-w-4xl mx-auto w-full">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-foreground text-transparent bg-clip-text">
                  Your Responses 🎯
                </h1>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
                  {error}
                </div>
              ) : (
                <div className="relative">
                  <div className="overflow-hidden" ref={carouselRef}>
                    <div className="flex touch-pan-y">
                      {responses.map((response, index) => (
                        <div
                          key={response.id}
                          className="flex-[0_0_100%] min-w-0 relative px-4"
                        >
                          <ResponseCard
                            {...response}
                            index={index}
                            total={responses.length}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-center space-x-4">
                <Button
                  onClick={handleReset}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg"
                >
                  Start Over 🔄
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProgressBar
        currentStep={typeof currentStep === "number" ? currentStep : 0}
        totalSteps={5}
      />

      {showBackConfirmation && <BackConfirmationDialog />}
    </div>
  );
}
