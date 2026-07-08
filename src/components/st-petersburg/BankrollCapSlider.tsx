"use client";

import { Slider } from "@/components/ui/Slider";
import { StatCounter } from "@/components/ui/StatCounter";
import { expectedValueWithCap } from "@/lib/simulations/stPetersburg";
import { useMemo, useState } from "react";
import {
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const MIN_EXPONENT = 5.6; // ~$50
const MAX_EXPONENT = Math.log2(1e9); // $1,000,000,000

function formatMoney(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}

export function BankrollCapSlider() {
  const [exponent, setExponent] = useState(16); // ~$65,536

  const bankroll = 2 ** exponent;
  const cappedEv = expectedValueWithCap(bankroll);

  const curve = useMemo(() => {
    const points: { bankroll: number; ev: number }[] = [];
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const exp = MIN_EXPONENT + (i / steps) * (MAX_EXPONENT - MIN_EXPONENT);
      const b = 2 ** exp;
      points.push({ bankroll: b, ev: expectedValueWithCap(b) });
    }
    return points;
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Slider
        label="Casino's maximum bankroll"
        value={exponent}
        min={MIN_EXPONENT}
        max={MAX_EXPONENT}
        step={0.05}
        accent="reality"
        formatValue={(exp) => formatMoney(2 ** exp)}
        onChange={setExponent}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-background-elevated p-4">
          <p className="mb-1 text-xs uppercase tracking-wider text-[color:var(--color-expect-2)]">
            Uncapped expected value
          </p>
          <p className="font-mono text-3xl font-semibold text-muted line-through">∞</p>
          <p className="mt-1 text-xs text-muted">What the math says the game is worth.</p>
        </div>
        <div className="rounded-2xl border border-border bg-background-elevated p-4">
          <p className="mb-1 text-xs uppercase tracking-wider text-[color:var(--color-reality-2)]">
            Capped expected value
          </p>
          <p className="font-mono text-3xl font-semibold tabular-nums">
            $<StatCounter value={cappedEv} format={(n) => n.toFixed(2)} duration={0.2} />
          </p>
          <p className="mt-1 text-xs text-muted">
            What it&apos;s actually worth once the casino can only pay {formatMoney(bankroll)}.
          </p>
        </div>
      </div>

      <div className="h-56 w-full rounded-2xl border border-border bg-background-elevated p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curve} margin={{ top: 8, right: 16, bottom: 0, left: -4 }}>
            <XAxis
              dataKey="bankroll"
              scale="log"
              domain={["auto", "auto"]}
              type="number"
              stroke="var(--color-muted)"
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
              tickFormatter={(v: number) => formatMoney(v)}
            />
            <YAxis
              stroke="var(--color-muted)"
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
              tickFormatter={(v: number) => `$${Math.round(v)}`}
              width={48}
            />
            <Line
              type="monotone"
              dataKey="ev"
              stroke="var(--color-reality)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={bankroll}
              y={cappedEv}
              r={6}
              fill="var(--color-expect-2)"
              stroke="var(--color-bg)"
              strokeWidth={2}
              isFront
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-muted">
        Even letting the casino cover one billion dollars only pushes the fair price to about{" "}
        {formatMoney(expectedValueWithCap(1e9))} — the curve barely moves even at that scale,
        because the expectation only grows by half a dollar per doubling. Infinity is only reachable
        with an infinite bankroll; any real casino, however large, is quietly finite.
      </p>
    </div>
  );
}
