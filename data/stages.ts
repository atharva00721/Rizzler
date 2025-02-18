import { RelationshipStage } from "@/types";

export const relationshipStages: RelationshipStage[] = [
  {
    id: "just_met",
    label: "Just Met",
    emoji: "👋",
    desc: "Keep it friendly and light",
    promptHint:
      "They just met this person and want to make a good first impression. The tone should be polite, friendly, and not too forward.",
  },
  {
    id: "acquaintance",
    label: "Acquaintance",
    emoji: "🤝",
    desc: "Getting to know each other",
    promptHint:
      "They've met this person a few times and are starting to get comfortable. The tone can be more casual but still respectful.",
  },
  {
    id: "crush",
    label: "Crush",
    emoji: "😍",
    desc: "Before dating, when someone is interested but unsure",
    promptHint:
      "They're interested in this person but not sure if the feeling is mutual. The tone should be playful, flirty, and a little nervous.",
  },
  {
    id: "friends",
    label: "Friends",
    emoji: "😊",
    desc: "Comfortable but respectful",
    promptHint:
      "They're friends who talk regularly. The tone can be casual and include inside jokes or shared interests.",
  },
  {
    id: "close_friends",
    label: "Close Friends",
    emoji: "🫂",
    desc: "Can be more casual and personal",
    promptHint:
      "They're close friends who share personal stuff. The tone can be very casual, playful, and include deeper conversations.",
  },
  {
    id: "best_friends",
    label: "Best Friends",
    emoji: "👯‍♂️",
    desc: "A step beyond 'Close Friends,' where conversations can be super deep or completely chaotic",
    promptHint:
      "They're best friends who know everything about each other. The tone can be completely unfiltered, goofy, or deeply meaningful.",
  },
  {
    id: "dating",
    label: "Dating",
    emoji: "💝",
    desc: "Already romantic",
    promptHint:
      "They're dating or in a romantic relationship. The tone can be affectionate and intimate while remaining respectful.",
  },
  {
    id: "long_term_relationship",
    label: "Long-Term Relationship",
    emoji: "💍",
    desc: "For serious relationships, leading toward commitment",
    promptHint:
      "They're in a long-term relationship and deeply connected. The tone can be loving, supportive, and future-focused.",
  },
  {
    id: "its_complicated",
    label: "It's Complicated",
    emoji: "🤯",
    desc: "Because some relationships are confusing!",
    promptHint:
      "They're in a complicated situation—maybe on-again-off-again or unclear about where they stand. The tone should reflect mixed emotions and uncertainty.",
  },
];
