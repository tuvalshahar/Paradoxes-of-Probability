"use client";

import { ConfoundingExplainer } from "@/components/simpsons/ConfoundingExplainer";
import { SimpsonsScatter } from "@/components/simpsons/SimpsonsScatter";
import { Button } from "@/components/ui/Button";
import { SIMPSONS_CASES } from "@/lib/data/simpsons";
import { useState } from "react";

export function SimpsonsExplorer() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [combinedView, setCombinedView] = useState(false);
  const caseData = SIMPSONS_CASES[caseIndex];

  function selectCase(index: number) {
    setCaseIndex(index);
    setCombinedView(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {SIMPSONS_CASES.map((c, i) => (
            <Button
              key={c.id}
              variant={i === caseIndex ? "primary" : "secondary"}
              size="sm"
              onClick={() => selectCase(i)}
            >
              {c.title}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={combinedView ? "secondary" : "primary"}
            onClick={() => setCombinedView(false)}
          >
            Show by group
          </Button>
          <Button
            variant={combinedView ? "primary" : "secondary"}
            accent="reality"
            onClick={() => setCombinedView(true)}
          >
            Combine data
          </Button>
        </div>
      </div>

      <SimpsonsScatter caseData={caseData} combinedView={combinedView} />

      <ConfoundingExplainer caseData={caseData} />
    </div>
  );
}
