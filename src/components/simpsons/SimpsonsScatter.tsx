"use client";

import type { SimpsonsCase } from "@/lib/data/simpsons";
import { linearRegression } from "@/lib/stats/linearRegression";
import { useMemo } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";

interface SimpsonsScatterProps {
  caseData: SimpsonsCase;
  combinedView: boolean;
}

export function SimpsonsScatter({ caseData, combinedView }: SimpsonsScatterProps) {
  const { groupA, groupB, combined, groupALabel, groupBLabel, xLabel, yLabel, xDomain, yDomain } =
    caseData;

  const regA = useMemo(() => linearRegression(groupA), [groupA]);
  const regB = useMemo(() => linearRegression(groupB), [groupB]);
  const regCombined = useMemo(() => linearRegression(combined), [combined]);

  const [xMin, xMax] = xDomain;
  const gapX = (groupA[groupA.length - 1].x + groupB[0].x) / 2;

  const trendData = combinedView
    ? [
        { x: xMin, y: regCombined.slope * xMin + regCombined.intercept },
        { x: xMax, y: regCombined.slope * xMax + regCombined.intercept },
      ]
    : [
        { x: groupA[0].x, y: regA.slope * groupA[0].x + regA.intercept },
        { x: groupA[groupA.length - 1].x, y: regA.slope * groupA[groupA.length - 1].x + regA.intercept },
        { x: gapX, y: null },
        { x: groupB[0].x, y: regB.slope * groupB[0].x + regB.intercept },
        { x: groupB[groupB.length - 1].x, y: regB.slope * groupB[groupB.length - 1].x + regB.intercept },
      ];

  const dotColorA = combinedView ? "var(--color-muted)" : "var(--color-expect)";
  const dotColorB = combinedView ? "var(--color-muted)" : "var(--color-reality)";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex w-6 flex-shrink-0 items-center justify-center">
          <span
            className="whitespace-nowrap text-xs text-muted"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {yLabel}
          </span>
        </div>

        <div className="h-80 min-w-0 flex-1 rounded-2xl border border-border bg-background-elevated p-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                type="number"
                domain={xDomain}
                stroke="var(--color-muted)"
                tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
              />
              <YAxis
                dataKey="y"
                type="number"
                domain={yDomain}
                stroke="var(--color-muted)"
                tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                width={44}
              />
              <Scatter name={groupALabel} data={groupA} fill={dotColorA} isAnimationActive={false} />
              <Scatter name={groupBLabel} data={groupB} fill={dotColorB} isAnimationActive={false} />
              <Line
                data={trendData}
                dataKey="y"
                connectNulls={false}
                type="linear"
                stroke={combinedView ? "var(--color-reality-2)" : "var(--color-fg)"}
                strokeWidth={combinedView ? 3 : 2}
                strokeDasharray={combinedView ? "6 4" : undefined}
                dot={false}
                isAnimationActive
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="pl-8 text-center text-xs text-muted">{xLabel}</p>

      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {!combinedView ? (
          <>
            <div className="rounded-2xl border border-border bg-background-elevated p-4">
              <p className="mb-1 text-xs uppercase tracking-wider text-[color:var(--color-expect-2)]">
                {groupALabel} slope
              </p>
              <p className="font-mono text-2xl tabular-nums">
                {regA.slope >= 0 ? "+" : ""}
                {regA.slope.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-muted">
                Higher {xLabel.toLowerCase()} goes with higher {yLabel.toLowerCase()}.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background-elevated p-4">
              <p className="mb-1 text-xs uppercase tracking-wider text-[color:var(--color-reality-2)]">
                {groupBLabel} slope
              </p>
              <p className="font-mono text-2xl tabular-nums">
                {regB.slope >= 0 ? "+" : ""}
                {regB.slope.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-muted">Same positive relationship, independently.</p>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-border bg-background-elevated p-4 sm:col-span-2">
            <p className="mb-1 text-xs uppercase tracking-wider text-[color:var(--color-reality-2)]">
              Combined slope
            </p>
            <p className="font-mono text-2xl tabular-nums">{regCombined.slope.toFixed(2)}</p>
            <p className="mt-1 text-xs text-muted">
              Pooled together, the trend now runs the opposite way — the exact opposite of
              what&apos;s true within either group.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
