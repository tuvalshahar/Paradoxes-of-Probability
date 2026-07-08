"use client";

import { Button } from "@/components/ui/Button";
import type { SimpsonsCase } from "@/lib/data/simpsons";
import { useState } from "react";

interface ConfoundingExplainerProps {
  caseData: SimpsonsCase;
}

export function ConfoundingExplainer({ caseData }: ConfoundingExplainerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)} className="self-start">
        {open ? "Hide" : "Show"} why this happens
      </Button>

      {open && (
        <div className="rounded-2xl border border-border bg-background-elevated p-5">
          <p className="mb-4 text-sm text-muted">
            Both regressions above are computed correctly — there&apos;s no arithmetic error
            anywhere. What changes is which question the number answers.
          </p>
          <p className="mb-4 text-sm text-muted">
            <strong className="text-foreground">{caseData.lurkingVariable}</strong> is a{" "}
            <em>lurking variable</em>: it&apos;s correlated with both axes at once. {caseData.whyItHappens}
          </p>
          <p className="text-sm text-muted">
            &ldquo;Does {caseData.xLabel.toLowerCase()} actually affect {caseData.yLabel.toLowerCase()}?&rdquo;
            and &ldquo;does a randomly chosen high-{caseData.xLabel.toLowerCase()} data point tend to
            have a higher {caseData.yLabel.toLowerCase()} than a randomly chosen low one, ignoring
            group?&rdquo; are two different questions. The per-group slopes answer the first — the
            one you actually care about. The combined slope answers the second, and mistaking it
            for an answer to the first is the entire paradox. Whenever a trend reverses after
            aggregating, the fix isn&apos;t to distrust one of the regressions — it&apos;s to ask
            what variable you grouped away, and whether it belongs in the causal picture.
          </p>
        </div>
      )}
    </div>
  );
}
