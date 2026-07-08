// Fixed-pair model: the "low" amount A is drawn from a small, finite set,
// and the pair placed in the two envelopes is always (A, 2A). This makes the
// paradox concrete and — crucially — lets us compute the *true* posterior
// probability that an observed amount is the low or high envelope, which is
// exactly what the naive "always switch" argument gets wrong.
export const LOW_VALUES = [10, 15, 20, 25, 30, 35, 40, 45, 50];

export interface EnvelopePair {
  low: number;
  high: number;
  lowIndex: 0 | 1;
}

export function generatePair(): EnvelopePair {
  const low = LOW_VALUES[Math.floor(Math.random() * LOW_VALUES.length)];
  const lowIndex: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
  return { low, high: low * 2, lowIndex };
}

export function amountAt(pair: EnvelopePair, index: 0 | 1): number {
  return index === pair.lowIndex ? pair.low : pair.high;
}

export function otherIndex(index: 0 | 1): 0 | 1 {
  return index === 0 ? 1 : 0;
}

// True P(the observed amount X is the low envelope), given the same uniform
// prior over LOW_VALUES used by generatePair. The naive argument implicitly
// assumes this is always 0.5, for every possible X — it isn't.
export function posteriorLowGivenX(x: number): number {
  const isLowCandidate = LOW_VALUES.includes(x);
  const isHighCandidate = x % 2 === 0 && LOW_VALUES.includes(x / 2);

  if (isLowCandidate && isHighCandidate) return 0.5;
  if (isLowCandidate) return 1;
  if (isHighCandidate) return 0;
  return NaN;
}

export function trueExpectedOther(x: number): number {
  const pLow = posteriorLowGivenX(x);
  return pLow * (2 * x) + (1 - pLow) * (x / 2);
}

export function naiveExpectedOther(x: number): number {
  return 1.25 * x;
}
