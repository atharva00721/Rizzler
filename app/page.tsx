"use client";
import { predefinedContexts } from "@/data/contexts";
import { useState, useEffect } from "react";
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
import { relationshipStages } from "@/data/stages";
import { StageStep } from "@/components/steps/StageStep";
import {
  type Response,
  type InputMethod,
  type ConversationStage,
} from "@/types";
import { generateSuggestionPrompt } from "../utils/prompts";
// import { RateLimitInfo } from "@/components/RateLimitInfo";

export default function Home() {
  // States for entire flow
  const [currentStep, setCurrentStep] = useState<number | string>(1);
  const [inputMethod, setInputMethod] = useState<InputMethod>("text");
  const [textInputValue, setTextInputValue] = useState("");
  const [imageInput, setImageInput] = useState<File | null>(null);
  const [selectedContext, setSelectedContext] = useState("");
  const [conversationStage, setConversationStage] =
    useState<ConversationStage>("just_met");
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [isCustomContext, setIsCustomContext] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);

  // Add this sorting function at the top with other state declarations
  const sortResponsesByRating = (responses: Response[]) => {
    return [...responses].sort((a, b) => b.rating - a.rating);
  };

  // Add these new states for the multistep loader
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingSteps] = useState([
    {
      icon: "🔍",
      title: "Analyzing conversation...",
      description: "Processing context and tone",
    },
    {
      icon: "💭",
      title: "Crafting responses...",
      description: "Generating creative and engaging replies",
    },
    {
      icon: "📊",
      title: "Evaluating quality...",
      description: "Calculating success probability",
    },
    {
      icon: "✨",
      title: "Adding charm...",
      description: "Enhancing with personality and flair",
    },
    {
      icon: "🎯",
      title: "Finalizing results...",
      description: "Sorting and preparing your responses",
    },
  ]);

  // Add effect to cycle through loading steps
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading, loadingSteps.length]);

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
    const selectedStage = relationshipStages.find(
      (s) => s.id === conversationStage
    );
    formData.append("stage", conversationStage);
    formData.append("stageContext", selectedStage?.promptHint || "");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (res.status === 429) {
        // Rate limit error handling
        const data = await res.json();
        const retryAfterHeader = res.headers.get("Retry-After");
        const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : null;
        throw new Error(
          `${data.message || "Too many requests"}. Please try again ${
            retryAfter && !isNaN(retryAfter) ? `after ${retryAfter} seconds.` : "later."
          }`
        );
      }

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
    setConversationStage("acquaintance");
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

  const [stage, setStage] = useState("just_met");
  const [vibe, setVibe] = useState("flirty");
  const [suggestions, setSuggestions] = useState("");

  const stages = [
    "just_met",
    "crush",
    "acquaintance",
    "friends",
    "close_friends",
    "best_friends",
    "dating",
    "long_term_relationship",
    "its_complicated",
  ];

  const vibes = ["flirty", "simp", "freaky", "witty", "sweet", "toxic"];

  const handleGenerate = async () => {
    const prompt = generateSuggestionPrompt(stage, vibe);
    // Here you would typically make an API call to your AI service
    // For now, just displaying the prompt
    setSuggestions(prompt);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-background to-muted overflow-hidden">
      <Navbar />
      {/* <div className="absolute top-16 right-4 z-10 w-64">
        <RateLimitInfo />
      </div> */}
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
            <StageStep
              selectedStage={conversationStage}
              onSelect={(stageId) => {
                setConversationStage(stageId);
              }}
              onBack={() => setCurrentStep(2)}
              onContinue={() => setCurrentStep(4)}
            />
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
                <div className="flex flex-col items-center justify-center space-y-8">
                  {/* Enhanced multistep loader */}
                  <div className="w-full max-w-md mx-auto bg-card rounded-xl shadow-lg p-6 overflow-hidden">
                    {/* Progress bar */}
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
                      <motion.div
                        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500"
                        initial={{ width: "0%" }}
                        animate={{
                          width: `${
                            (loadingStep + 1) * (100 / loadingSteps.length)
                          }%`,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      {/* Progress markers */}
                      <div className="absolute top-0 left-0 w-full flex justify-between px-1 -mt-2">
                        {loadingSteps.map((_, index) => (
                          <motion.div
                            key={index}
                            className={`h-6 w-6 rounded-full flex items-center justify-center text-xs 
                              ${
                                index <= loadingStep
                                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                                  : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                              }`}
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{
                              scale: index === loadingStep ? [1, 1.1, 1] : 1,
                              opacity: index <= loadingStep ? 1 : 0.5,
                            }}
                            transition={{
                              scale: {
                                repeat: index === loadingStep ? Infinity : 0,
                                duration: 2,
                              },
                            }}
                          >
                            {index + 1}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Current step details with animated icon */}
                    <div className="relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={loadingStep}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center space-y-4"
                        >
                          {/* Animated icon */}
                          <motion.div
                            className="text-4xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900 dark:to-violet-900 p-4 rounded-full shadow-inner"
                            animate={{
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            {loadingSteps[loadingStep].icon}
                          </motion.div>

                          {/* Step title */}
                          <h3 className="text-lg font-semibold text-foreground">
                            {loadingSteps[loadingStep].title}
                          </h3>

                          {/* Step description */}
                          <p className="text-sm text-muted-foreground">
                            {loadingSteps[loadingStep].description}
                          </p>

                          {/* Additional visual elements - animated dots */}
                          <div className="flex space-x-2 mt-2">
                            {[0, 1, 2].map((dot) => (
                              <motion.div
                                key={dot}
                                className="h-2 w-2 rounded-full bg-primary"
                                initial={{ opacity: 0.3 }}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{
                                  duration: 1.2,
                                  repeat: Infinity,
                                  delay: dot * 0.4,
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                      This usually takes about 20-30 seconds
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center mb-6">
                  <p>{error}</p>
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
                        {relationshipStages.find(
                          (s) => s.id === conversationStage
                        )?.label || conversationStage}
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
            <div className="max-w-md md:max-w-4xl mx-auto w-full pt-20">
              <div className="text-center mb-8">
                <h1 className=" text-3xl md:text-4xl font-bold text-foreground">
                  Your Responses 🎯
                </h1>
                <p className="text-muted-foreground mt-2">
                  Sorted by effectiveness rating
                </p>
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
                    {sortResponsesByRating(responses).map((response, index) => (
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

      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center">Rizz Generator</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {stages.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ").toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Vibe</label>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {vibes.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Generate Suggestions
            </button>
          </div>

          {suggestions && (
            <div className="mt-8 p-4 border rounded bg-gray-50">
              <pre className="whitespace-pre-wrap">{suggestions}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
