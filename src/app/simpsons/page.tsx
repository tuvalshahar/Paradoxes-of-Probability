import { SimpsonsExplorer } from "@/components/simpsons/SimpsonsExplorer";
import { Callout } from "@/components/ui/Callout";
import { getParadoxBySlug } from "@/lib/paradoxes";
import { notFound } from "next/navigation";

export default function SimpsonsPage() {
  const paradox = getParadoxBySlug("simpsons");
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
        <h2 className="font-sans text-xl font-semibold tracking-tight">Two groups, one question</h2>
        <p className="max-w-2xl text-muted">
          Each case below has two groups that individually show the same, unsurprising positive
          relationship. Toggle between viewing them separately and pooling everyone into one
          dataset — and switch cases to confirm this isn&apos;t a fluke of one particular example.
        </p>
        <SimpsonsExplorer />
      </section>

      <Callout lane="reality" label="The tension">
        Every individual regression here is computed honestly — there&apos;s no statistical
        trick, no cherry-picked outlier. The paradox is that &ldquo;the data says X&rdquo; is
        never a complete sentence; it&apos;s always short for &ldquo;the data, grouped this way,
        says X.&rdquo; A rational conclusion from real-world data requires asking what got
        aggregated away before trusting the number that survives — the math was never wrong, the
        question being asked kept quietly changing.
      </Callout>
    </div>
  );
}

