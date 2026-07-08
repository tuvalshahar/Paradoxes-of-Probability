"use client";

import { Button } from "@/components/ui/Button";
import { StatCounter } from "@/components/ui/StatCounter";
import { playRound, type RoundResult } from "@/lib/simulations/stPetersburg";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MAX_VISIBLE_TAILS = 14;
const FLIP_INTERVAL_MS = 220;

export function StPetersburgGame() {
  const [result, setResult] = useState<RoundResult | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const visibleTails = result ? Math.min(result.flips - 1, MAX_VISIBLE_TAILS) : 0;
  const truncated = result ? result.flips - 1 > MAX_VISIBLE_TAILS : false;
  const totalSteps = visibleTails + 1; // tails chips + the final heads chip
  const done = result !== null && revealed >= totalSteps;

  function play() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const r = playRound();
    const steps = Math.min(r.flips - 1, MAX_VISIBLE_TAILS) + 1;

    setResult(r);
    setPlaying(true);
    setRevealed(0);

    intervalRef.current = setInterval(() => {
      setRevealed((prev) => {
        const next = prev + 1;
        if (next >= steps) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPlaying(false);
        }
        return next;
      });
    }, FLIP_INTERVAL_MS);
  }

  const tailsShown = Math.min(revealed, visibleTails);
  const runningPayout = 2 ** tailsShown;

  return (
    <div className="flex flex-col gap-6">
      <Button onClick={play} disabled={playing}>
        {result ? "Flip again" : "Play a round"}
      </Button>

      {result && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <AnimatePresence initial={false}>
              {Array.from({ length: tailsShown }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-background-elevated font-mono text-sm text-muted"
                >
                  T
                </motion.div>
              ))}

              {truncated && revealed >= visibleTails && (
                <motion.span
                  key="ellipsis"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-2 font-mono text-sm text-muted"
                >
                  … and it kept going ({result.flips - 1} tails total)
                </motion.span>
              )}

              {done && (
                <motion.div
                  key="heads"
                  initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[color:var(--color-expect)] bg-background-elevated font-mono text-sm text-[color:var(--color-expect-2)]"
                >
                  H
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-sm text-muted">
              {done ? "Final payout:" : "If it lands Heads next:"}
            </span>
            <span className="font-mono text-3xl font-semibold tabular-nums">
              $
              <StatCounter
                value={done ? result.payout : runningPayout}
                format={(n) => Math.round(n).toLocaleString()}
                duration={0.3}
              />
            </span>
          </div>

          {done && (
            <p className="text-sm text-muted">
              It took {result.flips} flip{result.flips === 1 ? "" : "s"} to land Heads.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
