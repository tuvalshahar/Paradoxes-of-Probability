"use client";

import { Button } from "@/components/ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const STEP_INTERVAL_MS = 1000;

const LINES = [
  "You open your envelope: X$.",
  "Suppose the other envelope holds either X/2$ or 2X$ — each equally likely.",
  "E[other] = 0.5 × (X/2$) + 0.5 × (2X$) = 1.25X$.",
  "1.25X$ is more than the X$ you're holding. So... switch?",
];

interface FallacyRevealProps {
  onKeep: () => void;
  onSwitch: () => void;
}

export function FallacyReveal({ onKeep, onSwitch }: FallacyRevealProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1;
        if (next >= LINES.length) clearInterval(interval);
        return next;
      });
    }, STEP_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background-elevated p-5">
      <p className="text-xs uppercase tracking-wider text-[color:var(--color-expect-2)]">
        The classic argument
      </p>

      <div className="flex flex-col gap-2 font-mono text-sm">
        <AnimatePresence>
          {LINES.slice(0, step).map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                i === LINES.length - 1
                  ? "text-[color:var(--color-reality-2)]"
                  : "text-muted"
              }
            >
              {line}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      {step >= LINES.length && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex gap-3">
          <Button accent="reality" onClick={onKeep}>
            Keep it
          </Button>
          <Button accent="expect" onClick={onSwitch}>
            Switch
          </Button>
        </motion.div>
      )}
    </div>
  );
}
