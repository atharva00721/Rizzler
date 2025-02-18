"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { Response } from "@/types";
import { extractTextFromImage } from "@/utils/ocr";
import { generateSuggestionPrompt } from "@/utils/prompts";

interface ApiResponse {
  responses: {
    message: string;
    rating: number;
    explanation: string;
    alternative: string;
  }[];
}

const API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-2.0-flash";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    const conversationText = formData.get("conversationText") as string | null;
    const context = formData.get("context") as string;
    const stage = formData.get("stage") as string;
    const vibe = formData.get("vibe") as string;

    // Extract text from either input method
    let extractedText = "";
    if (conversationText?.trim()) {
      extractedText = conversationText.trim();
    } else if (image) {
      extractedText = await extractTextFromImage(image, genAI, MODEL_NAME);
    } else {
      return NextResponse.json(
        { error: "No conversation text or image provided." },
        { status: 400 }
      );
    }

    // Prepare context and generate suggestions
    const fullContext = `Extracted conversation: ${extractedText}\nAdditional context: ${context}`;
    const suggestionPrompt = generateSuggestionPrompt(stage, vibe);

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent([fullContext, suggestionPrompt]);
    let responseText = (await result.response.text()).trim();

    // Remove any markdown code fences if present.
    responseText = responseText.replace(/```(?:json)?/g, "").trim();
    console.log("Flash-2.0 API response:", responseText);

    // Attempt to parse the JSON output. If JSON.parse fails, clean illegal escape characters.
    let parsedSuggestions: ApiResponse;
    try {
      parsedSuggestions = JSON.parse(responseText);
    } catch (err) {
      console.log("Failed to parse JSON:", err);
      // Remove any backslashes not followed by valid escape characters.
      responseText = responseText.replace(/\$?!["\\/bfnrtu]\)/g, "");
      parsedSuggestions = JSON.parse(responseText);
    }

    // Transform the suggestions into the desired output structure.
    // We assume "responses" is the key holding the array of suggestion objects.
    const suggestionsArray = Array.isArray(parsedSuggestions.responses)
      ? parsedSuggestions.responses
      : [];

    const transformedSuggestions: Response[] = suggestionsArray.map(
      (suggestion, index) => ({
        id: index + 1,
        message: suggestion.message,
        rating: suggestion.rating,
        explanation: suggestion.explanation,
        alternative: suggestion.alternative,
      })
    );

    // Return an array of transformed suggestions.
    return NextResponse.json(transformedSuggestions);
  } catch (error: unknown) {
    console.error("Flash-2.0 API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to analyze conversation";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
