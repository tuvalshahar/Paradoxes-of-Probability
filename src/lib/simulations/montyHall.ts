export type Strategy = "stay" | "switch";

export type DoorContent = "car" | "goat";

export interface RoundResult {
  carDoor: number;
  playerPick: number;
  hostReveal: number;
  switchDoor: number;
}

const ALL_DOORS = [0, 1, 2];

export function randomDoor(): number {
  return Math.floor(Math.random() * 3);
}

export function pickHostReveal(carDoor: number, playerPick: number): number {
  const candidates = ALL_DOORS.filter((d) => d !== playerPick && d !== carDoor);
  if (candidates.length === 1) return candidates[0];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function pickSwitchDoor(playerPick: number, hostReveal: number): number {
  return ALL_DOORS.find((d) => d !== playerPick && d !== hostReveal)!;
}

export function playManualRound(playerPick: number): RoundResult {
  const carDoor = randomDoor();
  const hostReveal = pickHostReveal(carDoor, playerPick);
  const switchDoor = pickSwitchDoor(playerPick, hostReveal);
  return { carDoor, playerPick, hostReveal, switchDoor };
}

export function finalPick(result: RoundResult, strategy: Strategy): number {
  return strategy === "stay" ? result.playerPick : result.switchDoor;
}

export function isWin(result: RoundResult, strategy: Strategy): boolean {
  return finalPick(result, strategy) === result.carDoor;
}

export interface SimulationPoint {
  n: number;
  stayWinRate: number;
  switchWinRate: number;
}

/**
 * A round's car door and player pick are independent of strategy, so a
 * single random trial resolves both: staying wins iff the initial pick
 * was the car; switching wins iff it wasn't (the host is forced to leave
 * the car as the only other unopened door whenever the initial pick was
 * a goat).
 */
export function simulateBatch(count: number, maxPoints = 200): SimulationPoint[] {
  const sampleEvery = Math.max(1, Math.floor(count / maxPoints));
  const points: SimulationPoint[] = [];
  let stayWins = 0;

  for (let i = 1; i <= count; i++) {
    const carDoor = randomDoor();
    const playerPick = randomDoor();
    if (playerPick === carDoor) stayWins++;

    if (i % sampleEvery === 0 || i === count) {
      points.push({
        n: i,
        stayWinRate: stayWins / i,
        switchWinRate: (i - stayWins) / i,
      });
    }
  }

  return points;
}
