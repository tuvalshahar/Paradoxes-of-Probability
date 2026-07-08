"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MAX_ITERATIONS = 5;
const STEP_MS = 5000;

function formatX(coefficient: number) {
  return coefficient === 1 ? "X$" : `${coefficient.toFixed(2)}X$`;
}

function messageFor(i: number) {
  const coefficient = 1.25 ** i;
  const nextCoefficient = coefficient * 1.25;
  const holding = i % 2 === 0 ? "A" : "B";
  const other = holding === "A" ? "B" : "A";
  return `Holding envelope ${holding} with ${formatX(coefficient)} → "the other has E[value] = ${formatX(nextCoefficient)}" → switch to ${other}...`;
}

export function LoopVisualizer() {
  const [messages, setMessages] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function play() {
    if (timerRef.current) clearInterval(timerRef.current);
    setMessages([]);
    setRunning(true);

    let i = 0;
    timerRef.current = setInterval(() => {
      setMessages((prev) => [...prev, messageFor(i)]);
      i++;
      if (i >= MAX_ITERATIONS && timerRef.current) {
        clearInterval(timerRef.current);
        setRunning(false);
      }
    }, STEP_MS);
  }

  const holding = messages.length % 2 === 0 ? "A" : "B";
  const done = messages.length >= MAX_ITERATIONS;

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-background-elevated p-6">
      <div className="relative flex w-full max-w-xs items-center justify-between">
        <motion.span
          animate={{ scale: holding === "A" ? 1.2 : 1, opacity: holding === "A" ? 1 : 0.5 }}
          className="text-5xl"
        >
          ✉️
        </motion.span>
        <motion.span
          animate={{ rotate: messages.length * 180 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="text-2xl text-[color:var(--color-expect-2)]"
        >
          ⇄
        </motion.span>
        <motion.span
          animate={{ scale: holding === "B" ? 1.2 : 1, opacity: holding === "B" ? 1 : 0.5 }}
          className="text-5xl"
        >
          ✉️
        </motion.span>
      </div>

      <div className="flex w-full flex-col gap-2 font-mono text-sm">
        {messages.map((message, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-muted"
          >
            {message}
          </motion.p>
        ))}
      </div>

      {done && (
        <p className="text-center text-sm text-[color:var(--color-reality-2)]">
          ...and by the same logic, forever. An argument that tells you to switch no matter which
          envelope you&apos;re holding has to be broken somewhere.
        </p>
      )}

      <Button onClick={play} disabled={running} variant="secondary">
        {messages.length > 0 ? "Run it again" : "Run the argument"}
      </Button>
    </div>
  );
}
