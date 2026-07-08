"use client";

import { Button } from "@/components/ui/Button";
import { StatCounter } from "@/components/ui/StatCounter";
import { simulateBatch, type SimulationPoint } from "@/lib/simulations/stPetersburg";
import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const PRESETS = [100, 1_000, 10_000, 1_000_000];
const REVEAL_DURATION_MS = 1400;

export function StPetersburgSimulation() {
  const [points, setPoints] = useState<SimulationPoint[]>([]);
  const [running, setRunning] = useState(false);
  const [runSize, setRunSize] = useState<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function run(n: number) {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const full = simulateBatch(n);
    const total = full.length;
    let start: number | null = null;

    setRunSize(n);
    setRunning(true);
    setPoints([]);

    function tick(now: number) {
      if (start === null) start = now;
      const elapsed = now - start;
      const revealCount = Math.min(total, Math.ceil((elapsed / REVEAL_DURATION_MS) * total));
      setPoints(full.slice(0, Math.max(revealCount, 1)));

      if (revealCount < total) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setRunning(false);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
  }

  const latest = points[points.length - 1];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        {PRESETS.map((n) => (
          <Button
            key={n}
            variant={runSize === n ? "primary" : "secondary"}
            accent="reality"
            disabled={running}
            onClick={() => run(n)}
          >
            Run {n.toLocaleString()}
          </Button>
        ))}
        {latest && (
          <span className="ml-auto font-mono text-xs text-muted">
            n = {latest.n.toLocaleString()}
          </span>
        )}
      </div>

      <div className="h-72 w-full rounded-2xl border border-border bg-background-elevated p-4">
        {points.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: -4 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="n"
                stroke="var(--color-muted)"
                tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                tickFormatter={(n: number) => n.toLocaleString()}
              />
              <YAxis
                stroke="var(--color-muted)"
                tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                tickFormatter={(v: number) => `$${Math.round(v).toLocaleString()}`}
                width={64}
              />
              <Line
                type="monotone"
                dataKey="averagePayout"
                name="Running average payout"
                stroke="var(--color-reality)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Run a simulation to watch the average refuse to settle.
          </div>
        )}
      </div>

      {latest && (
        <div className="rounded-2xl border border-border bg-background-elevated p-4">
          <p className="mb-1 text-xs uppercase tracking-wider text-[color:var(--color-reality-2)]">
            Running average payout
          </p>
          <p className="font-mono text-2xl tabular-nums">
            $<StatCounter value={latest.averagePayout} format={(n) => n.toFixed(2)} />
          </p>
          <p className="mt-2 text-xs text-muted">
            Run it a few more times at 10,000 — most runs look calm, hovering around a small
            number. That calm is an illusion: the true expectation is infinite, driven entirely by
            payouts so rare (a run of 30+ tails in a row, say) that a sample this size will almost
            never contain one. The line looks like it converges only because you&apos;re
            under-sampling the tail, not because the game actually has a stable average.
          </p>
        </div>
      )}
    </div>
  );
}
