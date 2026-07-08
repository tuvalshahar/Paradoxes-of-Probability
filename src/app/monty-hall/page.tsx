import { Callout } from "@/components/ui/Callout";
import { ConditionalBreakdown } from "@/components/monty-hall/ConditionalBreakdown";
import { MontyHallGame } from "@/components/monty-hall/MontyHallGame";
import { MontyHallSimulation } from "@/components/monty-hall/MontyHallSimulation";
import { getParadoxBySlug } from "@/lib/paradoxes";
import { notFound } from "next/navigation";

export default function MontyHallPage() {
  const paradox = getParadoxBySlug("monty-hall");
  if (!paradox) return notFound();

  return (
    <div className="flex flex-1 flex-col gap-14 py-10">
      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
          {paradox.tagline}
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight">{paradox.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{paradox.description}</p>
      </div>

      <section className="flex flex-col gap-6">
        <h2 className="font-sans text-xl font-semibold tracking-tight">Play a round</h2>
        <MontyHallGame />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-sans text-xl font-semibold tracking-tight">
          Fast-forward the simulation
        </h2>
        <p className="max-w-2xl text-muted">
          One round tells you almost nothing — the sample size is too small to trust your gut.
          Run thousands of rounds instead, and watch both strategies settle onto their true win
          rates.
        </p>
        <MontyHallSimulation />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-sans text-xl font-semibold tracking-tight">Why switching wins</h2>
        <ConditionalBreakdown />
      </section>

      <Callout lane="expect" label="The tension">
        The math is unambiguous: switching wins twice as often as staying. Yet most people&apos;s
        first instinct is that revealing a goat makes the two remaining doors equally likely —
        an intuition about symmetry that the host&apos;s <em>forced</em> action quietly breaks.
      </Callout>
    </div>
  );
}
