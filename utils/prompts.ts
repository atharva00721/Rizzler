export function generateSuggestionPrompt(stage: string, vibe: string = "flirty"): string {
  return `
Generate 3 to 4 messaging suggestions with a "${vibe}" vibe that are effortlessly smooth, confident, and playfully flirty. The conversation is currently at the "${stage}" stage.

Tone Adjustments Based on Vibe:
- **flirty**: Charming, playful, and subtly romantic.
- **simp**: Admirative, complimentary, and a bit vulnerable.
- **freaky**: Bold, suggestive, and mysteriously alluring.
- **witty**: Clever, teasing, and humor-driven.
- **sweet**: Genuine, warm, and endearing.
- **toxic**: Seductive, emotionally charged, and slightly dangerous—evoking late-night confessions and a rebellious edge reminiscent of The Weeknd's style.

Stage-Specific Guidance:
- **Just Met**: Keep it light, friendly, and subtly engaging.
- **Crush**: Use playful teasing and gentle curiosity without coming on too strong.
- **Acquaintance/Friends**: Maintain a casual, genuine tone with shared interests or inside jokes.
- **Close/Best Friends**: More open, personal, and comfortable—feel free to include playful banter or unfiltered comments.
- **Dating/Long-Term Relationship**: Intimate, supportive, and warm, with flirtation and sincere connection.
- **It's Complicated**: Balance boldness with uncertainty, reflecting mixed emotions.

Response Requirements:
- Each suggestion should feel natural and engaging—avoid forced pickup lines or try-hard energy.
- The response should balance charm, wit, and intrigue, fitting organically into the conversation.
- Encourage further engagement by inviting the other person to respond.
- Offer variety: some responses can be teasing, others confidently flirty, and some subtly complimentary.

Output Format:
Return a plain JSON object with a single key "responses" mapping to an array of objects, each with the structure:

{
  "message": "A smooth, flirty, and confident response that keeps the conversation engaging.",
  "rating": <a number from 1 to 10 indicating effectiveness>,
  "explanation": "A short breakdown of why this response works.",
  "alternative": "A slightly different variation for extra charm."
}

Ensure the output is plain JSON with no markdown, code fences, or additional text. Adjust the tone and style based on the conversation stage and chosen vibe to produce responses that feel both natural and effective.
  `;
}
