import { LoopVisualizer } from "@/components/two-envelopes/LoopVisualizer";
import { TwoEnvelopeGame } from "@/components/two-envelopes/TwoEnvelopeGame";
import { TwoEnvelopeResolution } from "@/components/two-envelopes/TwoEnvelopeResolution";
import { Callout } from "@/components/ui/Callout";
import { getParadoxBySlug } from "@/lib/paradoxes";
import { notFound } from "next/navigation";

export default function TwoEnvelopesPage() {
  const paradox = getParadoxBySlug("two-envelopes");
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
        <h2 className="font-sans text-xl font-semibold tracking-tight">Pick an envelope</h2>
        <p className="max-w-2xl text-muted">
          Two envelopes, one contains twice as much as the other. Open one, then decide: keep it,
          or switch to the other?
        </p>
        <TwoEnvelopeGame />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-sans text-xl font-semibold tracking-tight">
          The argument never stops
        </h2>
        <p className="max-w-2xl text-muted">
          Here&apos;s the problem: nothing about the &ldquo;switch&rdquo; argument depends on which
          envelope you&apos;re holding. The instant you switch, the exact same reasoning applies
          again to your new envelope, telling you to switch back — and again, and again.
        </p>
        <LoopVisualizer />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-sans text-xl font-semibold tracking-tight">Where it breaks</h2>
        <p className="max-w-2xl text-muted">
          The fallacy hides in treating &ldquo;the other envelope is $X/2 or $2X, 50/50&rdquo; as
          true no matter what X turns out to be. It isn&apos;t.
        </p>
        <TwoEnvelopeResolution />
      </section>

      <Callout lane="expect" label="The tension">
        The math looks airtight at every single step — and yet it produces an argument for
        switching that has no stopping point, which is itself proof something is wrong. Rational
        behavior isn&apos;t &ldquo;follow every locally valid-looking equation&rdquo;; it&apos;s
        noticing when an argument&apos;s conclusion (switch forever) is absurd enough to demand
        you go back and find the hidden, invalid step — in this case, smuggling in a probability
        (50/50) that was never actually justified for the value you observed.
      </Callout>
    </div>
  );
}
