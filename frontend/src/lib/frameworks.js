// Framework definitions, defaults and scoring helpers for Clarity Prioritise.

export const FRAMEWORKS = {
  RICE: "rice",
  KANO: "kano",
  VALUE_EFFORT: "value_effort",
};

export const FRAMEWORK_META = {
  [FRAMEWORKS.RICE]: {
    id: FRAMEWORKS.RICE,
    label: "RICE",
    blurb:
      "Score features by Reach, Impact, Confidence and Effort. Higher is better.",
  },
  [FRAMEWORKS.KANO]: {
    id: FRAMEWORKS.KANO,
    label: "Kano",
    blurb:
      "Classify features by the kind of satisfaction they produce for users.",
  },
  [FRAMEWORKS.VALUE_EFFORT]: {
    id: FRAMEWORKS.VALUE_EFFORT,
    label: "Value vs Effort",
    blurb:
      "Plot features on a 2×2 of user value against implementation effort.",
  },
};

// RICE
export const IMPACT_OPTIONS = [
  { value: 0.25, label: "0.25 — Minimal" },
  { value: 0.5, label: "0.5 — Low" },
  { value: 1, label: "1 — Medium" },
  { value: 2, label: "2 — High" },
  { value: 3, label: "3 — Massive" },
];

export function riceScore({ reach = 0, impact = 1, confidence = 100, effort = 1 }) {
  const e = Number(effort) || 0;
  if (e <= 0) return 0;
  const r = Number(reach) || 0;
  const i = Number(impact) || 0;
  const c = (Number(confidence) || 0) / 100;
  return (r * i * c) / e;
}

// Kano
export const KANO_CATEGORIES = [
  {
    id: "must",
    label: "Must-have",
    description:
      "Basic expectations. Their absence causes dissatisfaction; presence goes unnoticed.",
  },
  {
    id: "performance",
    label: "Performance",
    description:
      "The more, the better. Satisfaction grows linearly with how well it is done.",
  },
  {
    id: "delighter",
    label: "Delighter",
    description:
      "Unexpected features that produce outsized satisfaction when present.",
  },
  {
    id: "indifferent",
    label: "Indifferent",
    description:
      "Users don't care either way. Typically candidates to deprioritise.",
  },
  {
    id: "reverse",
    label: "Reverse",
    description:
      "Presence actually causes dissatisfaction for some segments of users.",
  },
];

export const KANO_BY_ID = Object.fromEntries(
  KANO_CATEGORIES.map((c) => [c.id, c]),
);

// Value vs Effort
export const VE_QUADRANTS = [
  {
    id: "quick_wins",
    label: "Quick Wins",
    description: "High value, low effort. Ship these first.",
  },
  {
    id: "big_bets",
    label: "Big Bets",
    description: "High value, high effort. Plan carefully.",
  },
  {
    id: "fill_ins",
    label: "Fill-ins",
    description: "Low value, low effort. Useful as filler work.",
  },
  {
    id: "time_sinks",
    label: "Time Sinks",
    description: "Low value, high effort. Avoid.",
  },
];

export function valueEffortQuadrant(value, effort) {
  const hiValue = Number(value) >= 6;
  const hiEffort = Number(effort) >= 6;
  if (hiValue && !hiEffort) return "quick_wins";
  if (hiValue && hiEffort) return "big_bets";
  if (!hiValue && !hiEffort) return "fill_ins";
  return "time_sinks";
}

export function valueEffortScore({ value = 0, effort = 0 }) {
  const e = Number(effort) || 0;
  if (e <= 0) return Number(value) || 0;
  return (Number(value) || 0) / e;
}

export function defaultItemForFramework(framework) {
  switch (framework) {
    case FRAMEWORKS.RICE:
      return { reach: 1000, impact: 1, confidence: 80, effort: 2 };
    case FRAMEWORKS.KANO:
      return { category: "performance" };
    case FRAMEWORKS.VALUE_EFFORT:
      return { value: 5, effort: 5 };
    default:
      return {};
  }
}
