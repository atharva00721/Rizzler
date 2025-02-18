//
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    const conversationText = formData.get("conversationText") as string | null;
    const context = formData.get("context") as string;
    const stage = formData.get("stage") as string;

    let extractedText = "";

    // Determine the conversation text: prioritize provided text input.
    if (conversationText?.trim()) {
      extractedText = conversationText.trim();
    } else if (image) {
      // Convert image bytes to a Base64 string.
      const imageBytes = await image.arrayBuffer();
      const base64Image = Buffer.from(imageBytes).toString("base64");

      // Use flash-2.0 exclusively for OCR extraction.
      const flashModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });
      const ocrPrompt =
        "Extract and return only the text content from this conversation screenshot.";
      const textResult = await flashModel.generateContent([
        { inlineData: { mimeType: image.type, data: base64Image } },
        ocrPrompt,
      ]);
      extractedText = (await textResult.response.text()).trim();
    } else {
      return NextResponse.json(
        { error: "No conversation text or image provided." },
        { status: 400 }
      );
    }

    // Prepare combined context from extracted conversation and additional details.
    const fullContext = `Extracted conversation: ${extractedText}
Additional context: ${context}`;

    // Updated prompt with rizzed and slightly freaky tone and preset structure.
    const suggestionPrompt = `
   Generate 3 to 4 messaging suggestions with a "${formData.get(
     "vibe"
   )}" vibe that are effortlessly smooth, confident, and playfully flirty. The conversation is currently at the "${stage}" stage.  

   Adjust the tone based on the vibe:
   - flirty: Charming, playful, and subtly romantic
   - simp: Admiring, complimentary, and slightly vulnerable
   - freaky: Bold, suggestive, and mysteriously alluring

Each response should:  
- Feel natural and engaging—no forced pickup lines or try-hard energy.  
- Strike the right balance between charm, wit, and intrigue.  
- Fit the current conversation flow and tone to feel organic.  
- Encourage further engagement rather than ending the conversation.  
- Provide variety—some responses can be teasing, others confidently flirty, and some subtly complimentary.  

Format the output as a clean JSON object with a single key, "responses," mapping to an array of objects in this exact structure:  

{
  "message": "A smooth, flirty, and confident response that keeps the conversation engaging.",
  "rating": <a number from 1 to 10 indicating effectiveness>,
  "explanation": "A short breakdown of why this response works.",
  "alternative": "A slightly different variation for extra charm."
}

Ensure the output is plain JSON with no markdown, code fences, or extra text. Adjust tone and style based on the conversation stage to make responses feel natural and effective.
`;

    // Use flash-2.0 exclusively for generating suggestions.
    const flashSuggestionModel = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
    const result = await flashSuggestionModel.generateContent([
      fullContext,
      suggestionPrompt,
    ]);
    let responseText = (await result.response.text()).trim();

    // Remove any markdown code fences if present.
    responseText = responseText.replace(/```(?:json)?/g, "").trim();
    console.log("Flash-2.0 API response:", responseText);

    // Attempt to parse the JSON output. If JSON.parse fails, clean illegal escape characters.
    let parsedSuggestions;
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

    const transformedSuggestions = suggestionsArray.map(
      (s: any, index: number) => ({
        id: index + 1,
        message: s.message,
        rating: s.rating,
        explanation: s.explanation,
        alternative: s.alternative,
      })
    );

    // Return an array of transformed suggestions.
    return NextResponse.json(transformedSuggestions);
  } catch (error: any) {
    console.error("Flash-2.0 API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze conversation" },
      { status: 500 }
    );
  }
}
