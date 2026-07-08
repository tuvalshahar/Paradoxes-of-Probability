export type Lane = "expect" | "reality" | "neutral";

export interface ParadoxMeta {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  accent: "expect" | "reality";
}

export const PARADOXES: ParadoxMeta[] = [
  {
    slug: "monty-hall",
    title: "The Monty Hall Problem",
    shortTitle: "Monty Hall",
    tagline: "Switching feels like 50/50. It's 2/3 vs 1/3.",
    description:
      "Play a 3-door game, then fast-forward 10,000 runs to watch the 'switch' strategy converge on a win rate no intuition would predict.",
    accent: "expect",
  },
  {
    slug: "st-petersburg",
    title: "The St. Petersburg Paradox",
    shortTitle: "St. Petersburg",
    tagline: "Expected value says pay anything. No one would.",
    description:
      "A coin-flip game with infinite expected value — until you cap the casino's bankroll and watch that infinity crash down to a few dollars.",
    accent: "reality",
  },
  {
    slug: "two-envelopes",
    title: "The Two-Envelope Paradox",
    shortTitle: "Two Envelopes",
    tagline: "The other envelope always looks better. Forever.",
    description:
      "An argument that seems to always favor switching, no matter which envelope you hold — an infinite loop hiding a subtle logical flaw.",
    accent: "expect",
  },
  {
    slug: "simpsons",
    title: "Simpson's Paradox",
    shortTitle: "Simpson's Paradox",
    tagline: "Two rising trends. One combined trend that falls.",
    description:
      "An interactive scatter plot where combining two positive-trending groups flips the overall trendline negative right before your eyes.",
    accent: "reality",
  },
  {
    slug: "bertrand",
    title: "Bertrand's Paradox",
    shortTitle: "Bertrand's Paradox",
    tagline: "\"Random\" isn't one thing — it's at least three.",
    description:
      "Draw random chords in a circle three different ways and watch the probability of a 'long' chord change from 1/3 to 1/2 to 1/4.",
    accent: "expect",
  },
];

export function getParadoxBySlug(slug: string): ParadoxMeta | undefined {
  return PARADOXES.find((p) => p.slug === slug);
}
