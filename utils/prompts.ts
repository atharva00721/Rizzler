export function generateSuggestionPrompt(stage: string, vibe?: string) {
  return `
  Generate 3 to 4 messaging suggestions with a "${vibe}" vibe that are effortlessly smooth, confident, and playfully flirty. The conversation is currently at the "${stage}" stage.  

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
}
