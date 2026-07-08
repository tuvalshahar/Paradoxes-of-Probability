"use client";

import { EnvelopeCard } from "@/components/two-envelopes/EnvelopeCard";
import { FallacyReveal } from "@/components/two-envelopes/FallacyReveal";
import { StatCounter } from "@/components/ui/StatCounter";
import {
  amountAt,
  generatePair,
  otherIndex,
  type EnvelopePair,
} from "@/lib/simulations/twoEnvelopes";
import { motion } from "framer-motion";
import { useState } from "react";

type Phase = "choosing" | "revealing" | "decided";
type Decision = "keep" | "switch" | null;

interface Tally {
  rounds: number;
  kept: number;
  switched: number;
  switchGains: number;
}

const EMPTY_TALLY: Tally = { rounds: 0, kept: 0, switched: 0, switchGains: 0 };

export function TwoEnvelopeGame() {
  const [phase, setPhase] = useState<Phase>("choosing");
  const [pair, setPair] = useState<EnvelopePair | null>(null);
  const [chosenIndex, setChosenIndex] = useState<0 | 1 | null>(null);
  const [decision, setDecision] = useState<Decision>(null);
  const [tally, setTally] = useState<Tally>(EMPTY_TALLY);

  function choose(index: 0 | 1) {
    setPair(generatePair());
    setChosenIndex(index);
    setDecision(null);
    setPhase("revealing");
  }

  function decide(next: Decision) {
    if (!pair || chosenIndex === null) return;
    setDecision(next);
    setPhase("decided");

    const chosenAmount = amountAt(pair, chosenIndex);
    const otherAmount = amountAt(pair, otherIndex(chosenIndex));

    setTally((prev) => ({
      rounds: prev.rounds + 1,
      kept: prev.kept + (next === "keep" ? 1 : 0),
      switched: prev.switched + (next === "switch" ? 1 : 0),
      switchGains: prev.switchGains + (next === "switch" && otherAmount > chosenAmount ? 1 : 0),
    }));
  }

  function playAgain() {
    setPhase("choosing");
    setPair(null);
    setChosenIndex(null);
    setDecision(null);
  }

  const chosenAmount =
    pair && chosenIndex !== null ? amountAt(pair, chosenIndex) : undefined;
  const otherAmount =
    pair && chosenIndex !== null ? amountAt(pair, otherIndex(chosenIndex)) : undefined;
  const finalAmount = decision === "switch" ? otherAmount : chosenAmount;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:max-w-md">
        {([0, 1] as const).map((index) => (
          <EnvelopeCard
            key={index}
            label={index === 0 ? "A" : "B"}
            isChosen={chosenIndex === index}
            disabled={phase !== "choosing"}
            isOpen={
              phase !== "choosing" &&
              (chosenIndex === index || phase === "decided")
            }
            amount={pair ? amountAt(pair, index) : undefined}
            onClick={() => choose(index)}
          />
        ))}
      </div>

      {phase === "revealing" && chosenAmount !== undefined && (
        <FallacyReveal
          onKeep={() => decide("keep")}
          onSwitch={() => decide("switch")}
        />
      )}

      {phase === "decided" && chosenAmount !== undefined && otherAmount !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-background-elevated p-5"
        >
          <p className="text-sm text-muted">
            You had ${chosenAmount.toLocaleString()} and {decision === "switch" ? "switched" : "kept it"}.
            The other envelope held ${otherAmount.toLocaleString()}.
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-sm text-muted">You end up with:</span>
            <span className="font-mono text-3xl font-semibold tabular-nums">
              $<StatCounter value={finalAmount ?? 0} duration={0.3} />
            </span>
          </div>
          <button
            type="button"
            onClick={playAgain}
            className="mt-1 self-start text-sm text-[color:var(--color-expect-2)] underline-offset-4 hover:underline"
          >
            Play another round
          </button>
        </motion.div>
      )}

      {tally.rounds > 0 && (
        <div className="flex flex-wrap gap-6 rounded-2xl border border-border bg-background-elevated p-4 font-mono text-sm text-muted">
          <span>Rounds: {tally.rounds}</span>
          <span>Kept: {tally.kept}</span>
          <span>
            Switched: {tally.switched} (gained {tally.switchGains}, lost{" "}
            {tally.switched - tally.switchGains})
          </span>
        </div>
      )}
    </div>
  );
}
