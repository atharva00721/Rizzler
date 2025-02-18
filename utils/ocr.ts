import { GoogleGenerativeAI } from "@google/generative-ai";

export async function extractTextFromImage(
  image: File,
  genAI: GoogleGenerativeAI,
  modelName: string
): Promise<string> {
  const imageBytes = await image.arrayBuffer();
  const base64Image = Buffer.from(imageBytes).toString("base64");

  const model = genAI.getGenerativeModel({ model: modelName });
  const ocrPrompt =
    "Extract and return only the text content from this conversation screenshot.";

  const textResult = await model.generateContent([
    { inlineData: { mimeType: image.type, data: base64Image } },
    ocrPrompt,
  ]);

  return (textResult.response.text()).trim();
}
