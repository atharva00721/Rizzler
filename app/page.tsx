"use client";
import { predefinedContexts } from "@/data/contexts";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { InputMethodStep } from "@/components/steps/InputMethodStep";
import { TextInputStep } from "@/components/steps/TextInputStep";
import { ResponseCard } from "@/components/response/ResponseCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { ContextStep } from "@/components/steps/ContextStep";
import {
  type Response,
  type InputMethod,
  type ConversationStage,
} from "@/types";

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
    } catch (err: unknown) {
      setError((err as Error).message);
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
            <ContextStep
              contexts={predefinedContexts}
              selectedContext={selectedContext}
              onSelect={(context) => {
                setSelectedContext(context);
                setIsCustomContext(false);
              }}
              onContinue={() => setCurrentStep(3)}
              onBack={() => handleBackWithConfirmation()}
            />
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
            {/* <BackButton /> */}
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
            <div className="max-w-md sm:max-w-lg md:max-w-xl w-full space-y-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {loading ? "Generating Responses... ⚡" : "Ready to Rizz? ✨"}
              </h1>
              {loading ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">
                    Crafting the perfect responses...
                  </p>
                </div>
              ) : (
                <>
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
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleGenerateResponses}
                      variant="default"
                      className="flex-1 sm:flex-initial"
                      disabled={loading}
                    >
                      Generate Responses →
                    </Button>
                  </div>
                </>
              )}
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
            <div className="max-w-md md:max-w-4xl mx-auto w-full">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
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
                <Carousel className="w-full max-w-4xl mx-auto">
                  <CarouselContent>
                    {responses.map((response, index) => (
                      <CarouselItem key={response.id}>
                        <ResponseCard
                          {...response}
                          index={index}
                          total={responses.length}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
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
