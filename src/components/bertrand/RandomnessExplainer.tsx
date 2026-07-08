"use client";

import { Button } from "@/components/ui/Button";
import {
  METHOD_DESCRIPTION,
  METHOD_LABEL,
  THEORETICAL_PROBABILITY,
  type BertrandMethod,
} from "@/lib/simulations/bertrand";
import { useState } from "react";

const METHODS: BertrandMethod[] = ["endpoints", "radius", "midpoint"];

export function RandomnessExplainer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)} className="self-start">
        {open ? "Hide" : "Show"} why this is genuinely ambiguous
      </Button>

      {open && (
        <div className="rounded-2xl border border-border bg-background-elevated p-5">
          <p className="mb-4 text-sm text-muted">
            Every one of the three methods above answers the same question — &ldquo;what&apos;s the
            probability a random chord is longer than the inscribed triangle&apos;s side?&rdquo; — and
            every one of them is a mathematically valid way to pick a &ldquo;uniformly random&rdquo;
            chord. None of them is doing anything wrong.
          </p>

          <div className="mb-4 flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
            {METHODS.map((m) => (
              <div key={m} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:gap-4">
                <p className="w-40 flex-shrink-0 font-mono text-sm text-foreground">
                  {METHOD_LABEL[m]}
                </p>
                <p className="flex-1 text-sm text-muted">{METHOD_DESCRIPTION[m]}</p>
                <p className="font-mono text-sm tabular-nums text-[color:var(--color-expect-2)]">
                  P = {THEORETICAL_PROBABILITY[m].toFixed(3)}
                </p>
              </div>
            ))}
          </div>

          <p className="mb-4 text-sm text-muted">
            A chord is a pair of points, or a direction and a distance, or a single interior
            point — a &ldquo;circle&rdquo; and a &ldquo;random chord&rdquo; are geometric objects,
            but &ldquo;uniform&rdquo; is a property of a probability measure, and a continuous space
            like this one admits more than one measure that a reasonable person would call
            uniform. Fixing <em>which</em> parameter gets the uniform distribution — the two
            endpoint angles, or the radius-and-offset, or the midpoint&apos;s position in the disk
            — silently fixes the answer.
          </p>
          <p className="text-sm text-muted">
            This is the sharpest version of a theme running through every paradox on this site:
            once you pin down a formal model, the mathematics that follows is airtight — no
            arithmetic here is in dispute, and each of 1/3, 1/2, and 1/4 is a correct answer to its
            own precisely-stated question. What Bertrand&apos;s paradox shows is that
            &ldquo;pick a random chord&rdquo; is not, by itself, a precisely-stated question. The
            ambiguity was never in the math — it was in the English sentence we asked the math to
            formalize.
          </p>
        </div>
      )}
    </div>
  );
}
