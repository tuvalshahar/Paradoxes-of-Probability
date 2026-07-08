"use client";

import { Button } from "@/components/ui/Button";
import {
  LOW_VALUES,
  naiveExpectedOther,
  posteriorLowGivenX,
  trueExpectedOther,
} from "@/lib/simulations/twoEnvelopes";
import { useState } from "react";

const SAMPLE_X = [15, 20, 50, 70, 100];

function verdictFor(pLow: number) {
  if (pLow === 1) return { text: "guaranteed switch gain", tone: "expect" as const };
  if (pLow === 0) return { text: "guaranteed switch LOSS", tone: "reality" as const };
  return { text: "genuinely 50/50", tone: "expect" as const };
}

export function TwoEnvelopeResolution() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)} className="self-start">
        {open ? "Hide" : "Show"} the resolution
      </Button>

      {open && (
        <div className="rounded-2xl border border-border bg-background-elevated p-5">
          <p className="mb-4 text-sm text-muted">
            The argument&apos;s flaw is in the line &ldquo;the other envelope holds $X/2 or $2X,
            each with probability 0.5.&rdquo; That 50/50 split is only true for{" "}
            <em>some</em> values of X — it depends on the actual range the low amount can come
            from. In this app, the low amount A is drawn uniformly from{" "}
            <span className="font-mono">{`{${LOW_VALUES.join(", ")}}`}</span>, so we can compute
            the real probabilities exactly instead of assuming:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 pr-4">You see</th>
                  <th className="py-2 pr-4">True P(other is bigger)</th>
                  <th className="py-2 pr-4">Naive E[other]</th>
                  <th className="py-2 pr-4">True E[other]</th>
                  <th className="py-2">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_X.map((x) => {
                  const pLow = posteriorLowGivenX(x);
                  const verdict = verdictFor(pLow);
                  return (
                    <tr key={x} className="border-b border-border/60 last:border-0">
                      <td className="py-2 pr-4 font-mono">${x}</td>
                      <td className="py-2 pr-4 font-mono">{pLow.toFixed(2)}</td>
                      <td className="py-2 pr-4 font-mono text-muted">
                        ${naiveExpectedOther(x).toLocaleString()}
                      </td>
                      <td className="py-2 pr-4 font-mono">
                        ${trueExpectedOther(x).toLocaleString()}
                      </td>
                      <td
                        className={
                          verdict.tone === "expect"
                            ? "py-2 font-mono text-[color:var(--color-expect-2)]"
                            : "py-2 font-mono text-[color:var(--color-reality-2)]"
                        }
                      >
                        {verdict.text}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-muted">
            For $15, you can deduce with certainty you&apos;re holding the low envelope — the pair
            can only be ($15, $30), so switching gains $15 for sure, more than the naive
            &ldquo;$18.75&rdquo; estimate suggests. For $70 or $100, you can equally deduce
            you&apos;re holding the <em>high</em> envelope — switching is a guaranteed loss, even
            though the naive formula still (wrongly) says &ldquo;switch, $87.50&rdquo; or
            &ldquo;switch, $125.&rdquo; The naive 50/50 split only holds for the handful of
            amounts — $20, $30, $40, $50 — that could plausibly be either the low or the high
            envelope. The argument isn&apos;t subtly off; it applies one formula to every X when
            the real answer depends on which X you actually see.
          </p>
        </div>
      )}
    </div>
  );
}
