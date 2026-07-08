const MAX_FLIPS = 200; // P(exceeding this) ~ 2^-200 — never happens in practice, just guards the loop

export interface RoundResult {
  flips: number;
  payout: number;
}

/**
 * Flip a fair coin until the first Heads. The payout doubles with every
 * Tails, so it's fully determined by how many flips it took: 2^(flips-1).
 */
export function playRound(): RoundResult {
  let flips = 0;
  do {
    flips++;
  } while (Math.random() >= 0.5 && flips < MAX_FLIPS);

  return { flips, payout: 2 ** (flips - 1) };
}

export interface SimulationPoint {
  n: number;
  averagePayout: number;
}

export function simulateBatch(count: number, maxPoints = 200): SimulationPoint[] {
  const sampleEvery = Math.max(1, Math.floor(count / maxPoints));
  const points: SimulationPoint[] = [];
  let total = 0;

  for (let i = 1; i <= count; i++) {
    total += playRound().payout;

    if (i % sampleEvery === 0 || i === count) {
      points.push({ n: i, averagePayout: total / i });
    }
  }

  return points;
}

/**
 * If a casino can never pay out more than `maxBankroll`, the expectation
 * collapses from infinite to finite. Let K be the largest flip count k for
 * which the uncapped payout 2^(k-1) still fits under the cap — every round
 * that runs longer than K flips is capped at maxBankroll instead of paying
 * 2^(k-1). Then:
 *
 *   E[X] = sum_{k=1}^{K} (1/2^k) * 2^(k-1)  +  P(flips > K) * maxBankroll
 *        = K/2 + maxBankroll / 2^K
 */
export function expectedValueWithCap(maxBankroll: number): number {
  if (maxBankroll < 1) return 0;
  const K = Math.floor(Math.log2(maxBankroll)) + 1;
  return K / 2 + maxBankroll / 2 ** K;
}
