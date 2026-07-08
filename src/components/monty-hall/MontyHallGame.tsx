"use client";

import { Button } from "@/components/ui/Button";
import { StatCounter } from "@/components/ui/StatCounter";
import {
  isWin,
  playManualRound,
  type RoundResult,
  type Strategy,
} from "@/lib/simulations/montyHall";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Door } from "./Door";

type Phase = "picking" | "deciding" | "result";

interface Score {
  staysPlayed: number;
  staysWon: number;
  switchesPlayed: number;
  switchesWon: number;
}

const EMPTY_SCORE: Score = { staysPlayed: 0, staysWon: 0, switchesPlayed: 0, switchesWon: 0 };

export function MontyHallGame() {
  const [phase, setPhase] = useState<Phase>("picking");
  const [round, setRound] = useState<RoundResult | null>(null);
  const [lastStrategy, setLastStrategy] = useState<Strategy | null>(null);
  const [score, setScore] = useState<Score>(EMPTY_SCORE);

  function handlePick(doorIndex: number) {
    if (phase !== "picking") return;
    setRound(playManualRound(doorIndex));
    setLastStrategy(null);
    setPhase("deciding");
  }

  function handleChoose(strategy: Strategy) {
    if (!round || phase !== "deciding") return;
    const won = isWin(round, strategy);
    setScore((s) =>
      strategy === "stay"
        ? { ...s, staysPlayed: s.staysPlayed + 1, staysWon: s.staysWon + (won ? 1 : 0) }
        : {
            ...s,
            switchesPlayed: s.switchesPlayed + 1,
            switchesWon: s.switchesWon + (won ? 1 : 0),
          },
    );
    setLastStrategy(strategy);
    setPhase("result");
  }

  function handleReset() {
    setRound(null);
    setLastStrategy(null);
    setPhase("picking");
  }

  const won = round && lastStrategy ? isWin(round, lastStrategy) : null;
  const finalPickIndex = round && lastStrategy
    ? lastStrategy === "stay" ? round.playerPick : round.switchDoor
    : null;

  const staysRate = score.staysPlayed ? (score.staysWon / score.staysPlayed) * 100 : 0;
  const switchesRate = score.switchesPlayed ? (score.switchesWon / score.switchesPlayed) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => {
          const isOpen = phase === "result" || (phase === "deciding" && i === round?.hostReveal);
          const content =
            round && isOpen ? (i === round.carDoor ? "car" : "goat") : undefined;

          return (
            <Door
              key={i}
              index={i}
              isOpen={isOpen}
              content={content}
              isSelected={round?.playerPick === i}
              isHostRevealed={phase === "deciding" && i === round?.hostReveal}
              disabled={phase !== "picking"}
              onClick={() => handlePick(i)}
            />
          );
        })}
      </div>

      <div className="flex min-h-[92px] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-background-elevated px-6 py-4 text-center">
        <AnimatePresence mode="wait">
          {phase === "picking" && (
            <motion.p
              key="picking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted"
            >
              Pick a door — the car is behind one of them.
            </motion.p>
          )}

          {phase === "deciding" && (
            <motion.div
              key="deciding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-muted">
                Door {(round?.hostReveal ?? 0) + 1} had a goat. Stay with Door{" "}
                {(round?.playerPick ?? 0) + 1}, or switch?
              </p>
              <div className="flex gap-3">
                <Button accent="reality" onClick={() => handleChoose("stay")}>
                  Stay
                </Button>
                <Button accent="expect" onClick={() => handleChoose("switch")}>
                  Switch
                </Button>
              </div>
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-lg font-medium">
                You {lastStrategy}ed and{" "}
                {won ? (
                  <span className="text-[color:var(--color-expect-2)]">won the car 🎉</span>
                ) : (
                  <span className="text-[color:var(--color-reality-2)]">got a goat</span>
                )}{" "}
                (Door {(finalPickIndex ?? 0) + 1}).
              </p>
              <Button variant="secondary" onClick={handleReset}>
                Play again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background-elevated p-4">
          <p className="mb-1 text-xs uppercase tracking-wider text-muted">Stay</p>
          <p className="font-mono text-2xl tabular-nums">
            <StatCounter value={staysRate} format={(n) => `${n.toFixed(1)}%`} />
          </p>
          <p className="text-xs text-muted">
            {score.staysWon} / {score.staysPlayed} won
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background-elevated p-4">
          <p className="mb-1 text-xs uppercase tracking-wider text-muted">Switch</p>
          <p className="font-mono text-2xl tabular-nums">
            <StatCounter value={switchesRate} format={(n) => `${n.toFixed(1)}%`} />
          </p>
          <p className="text-xs text-muted">
            {score.switchesWon} / {score.switchesPlayed} won
          </p>
        </div>
      </div>
    </div>
  );
}
