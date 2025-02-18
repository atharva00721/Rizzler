export type InputMethod = "text" | "image";

export type ConversationStage = "early" | "mid" | "closing";

export interface Response {
  id: number;
  message: string;
  rating: number;
  explanation: string;
  alternative: string;
}

export interface Context {
  id: number;
  label: string;
  description: string;
  emoji: string;
}
