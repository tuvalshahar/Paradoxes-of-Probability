import { BertrandExperiment } from "@/components/bertrand/BertrandExperiment";
import { RandomnessExplainer } from "@/components/bertrand/RandomnessExplainer";
import { Callout } from "@/components/ui/Callout";
import { getParadoxBySlug } from "@/lib/paradoxes";
import { notFound } from "next/navigation";

export default function BertrandPage() {
  const paradox = getParadoxBySlug("bertrand");
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
        <h2 className="font-sans text-xl font-semibold tracking-tight">Draw a random chord</h2>
        <p className="max-w-2xl text-muted">
          The dashed triangle is the largest equilateral triangle that fits inside the circle.
          Pick one of the three classic methods for generating a &ldquo;random&rdquo; chord, then
          draw a batch and watch what fraction of them end up longer than the triangle&apos;s side.
        </p>
        <BertrandExperiment />
      </section>

      <Callout lane="expect" label="The punchline">
        Each method above is a legitimate formalization of &ldquo;pick a random chord,&rdquo; and
        each one converges to a different, perfectly correct answer. There&apos;s no error to find
        and no method that&apos;s secretly the &ldquo;real&rdquo; one — the paradox dissolves the
        moment you realize the original question was underspecified, not that probability theory
        broke.
      </Callout>

      <RandomnessExplainer />
    </div>
  );
}
