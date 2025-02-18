export type InputMethod = "text" | "image";

export interface RelationshipStage {
  id: ConversationStage;
  label: string;
  emoji: string;
  desc: string;
  promptHint: string;
}

export type ConversationStage =
  | "just_met"
  | "acquaintance"
  | "friends"
  | "close_friends"
  | "dating"
  | "best_friends"
  | "dating"
  | "long_term_relationship"
  | "its_complicated"
  | "crush";

export type Vibe = "flirty" | "simp" | "freaky" | "sweet" | "toxic" | "witty";

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
  vibe: Vibe;
}
