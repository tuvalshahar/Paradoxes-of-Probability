"use client";

import { Button } from "@/components/ui/Button";
import { useState } from "react";

const ROWS = [
  {
    pick: 1,
    car: 1,
    hostReveals: "2 or 3 (either goat)",
    stay: "WIN",
    switchResult: "LOSE",
  },
  {
    pick: 2,
    car: 1,
    hostReveals: "3 (forced — only goat left)",
    stay: "LOSE",
    switchResult: "WIN",
  },
  {
    pick: 3,
    car: 1,
    hostReveals: "2 (forced — only goat left)",
    stay: "LOSE",
    switchResult: "WIN",
  },
];

export function ConditionalBreakdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)} className="self-start">
        {open ? "Hide" : "Show"} the conditional-probability breakdown
      </Button>

      {open && (
        <div className="rounded-2xl border border-border bg-background-elevated p-5">
          <p className="mb-4 text-sm text-muted">
            By symmetry, fix the car behind Door 1. Each of your three initial picks is equally
            likely (1/3), and the host is <em>forced</em> to reveal the only remaining goat door
            whenever you didn&apos;t pick the car:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 pr-4">You pick</th>
                  <th className="py-2 pr-4">Car is behind</th>
                  <th className="py-2 pr-4">Host reveals</th>
                  <th className="py-2 pr-4">Stay</th>
                  <th className="py-2">Switch</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.pick} className="border-b border-border/60 last:border-0">
                    <td className="py-2 pr-4 font-mono">Door {row.pick}</td>
                    <td className="py-2 pr-4 font-mono">Door {row.car}</td>
                    <td className="py-2 pr-4 text-muted">Door {row.hostReveals}</td>
                    <td
                      className={
                        row.stay === "WIN"
                          ? "py-2 pr-4 font-mono text-[color:var(--color-expect-2)]"
                          : "py-2 pr-4 font-mono text-[color:var(--color-reality-2)]"
                      }
                    >
                      {row.stay}
                    </td>
                    <td
                      className={
                        row.switchResult === "WIN"
                          ? "py-2 font-mono text-[color:var(--color-expect-2)]"
                          : "py-2 font-mono text-[color:var(--color-reality-2)]"
                      }
                    >
                      {row.switchResult}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            Staying only wins in the 1 row where your first pick was already the car. Switching
            wins in the other 2 — hence 1/3 vs 2/3.
          </p>
        </div>
      )}
    </div>
  );
}
