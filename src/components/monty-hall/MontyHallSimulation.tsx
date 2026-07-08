"use client";

import { Button } from "@/components/ui/Button";
import { StatCounter } from "@/components/ui/StatCounter";
import { simulateBatch, type SimulationPoint } from "@/lib/simulations/montyHall";
import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const PRESETS = [100, 1_000, 10_000];
const REVEAL_DURATION_MS = 1400;

export function MontyHallSimulation() {
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
            <LineChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="n"
                stroke="var(--color-muted)"
                tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                tickFormatter={(n: number) => n.toLocaleString()}
              />
              <YAxis
                domain={[0, 1]}
                stroke="var(--color-muted)"
                tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
                width={44}
              />
              <ReferenceLine
                y={1 / 3}
                stroke="var(--color-reality-2)"
                strokeDasharray="4 4"
                label={{
                  value: "33.3%",
                  position: "insideBottomLeft",
                  fill: "var(--color-reality-2)",
                  fontSize: 11,
                }}
              />
              <ReferenceLine
                y={2 / 3}
                stroke="var(--color-expect-2)"
                strokeDasharray="4 4"
                label={{
                  value: "66.6%",
                  position: "insideTopLeft",
                  fill: "var(--color-expect-2)",
                  fontSize: 11,
                }}
              />
              <Line
                type="monotone"
                dataKey="stayWinRate"
                name="Stay"
                stroke="var(--color-reality)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="switchWinRate"
                name="Switch"
                stroke="var(--color-expect)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Run a simulation to see the strategies converge.
          </div>
        )}
      </div>

      {latest && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-background-elevated p-4">
            <p className="mb-1 text-xs uppercase tracking-wider text-[color:var(--color-reality-2)]">
              Stay win rate
            </p>
            <p className="font-mono text-2xl tabular-nums">
              <StatCounter value={latest.stayWinRate * 100} format={(n) => `${n.toFixed(2)}%`} />
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background-elevated p-4">
            <p className="mb-1 text-xs uppercase tracking-wider text-[color:var(--color-expect-2)]">
              Switch win rate
            </p>
            <p className="font-mono text-2xl tabular-nums">
              <StatCounter value={latest.switchWinRate * 100} format={(n) => `${n.toFixed(2)}%`} />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
