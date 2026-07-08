import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { PARADOXES } from "@/lib/paradoxes";

const RESOLUTION: Record<string, string> = {
  "monty-hall":
    "The reveal feels like it should collapse the odds to 50/50 — two closed doors, pick one. But the host isn't a neutral third event: he always opens a door he knows is empty. That rule injects information tied to your original 1-in-3 guess, and it's exactly enough to swing the other door to 2/3.",
  "st-petersburg":
    "The math says the expected payout is infinite, so a rational agent should pay any finite price to play. Nobody would, and that's not irrationality — expectation is an average over an infinite number of repetitions nobody actually gets to play, dominated by astronomically rare, astronomically large payouts a single real bankroll can never realize.",
  "two-envelopes":
    "The switching argument re-derives itself no matter which envelope you're holding, which is the tell that something's wrong with the argument, not with your choice. It treats the amount you observe as if it were still the unresolved random variable X — but once you've looked, it's a fixed number, and 'the other envelope is either half or double X' stops meaning what the formula assumes it means.",
  simpsons:
    "Every regression here is computed correctly; nothing is faked. Combining the two groups doesn't correct for anything — it just answers a different question than the per-group slopes do, and the difference is a lurking variable that happened to correlate with both axes at once.",
  bertrand:
    "Three formally correct ways to generate a 'random' chord give three different, equally correct answers. The paradox isn't a crack in probability theory — it's that 'pick a random chord' was never a precise mathematical statement to begin with. The instant you fix which parameter is uniform, the ambiguity disappears and the algebra takes over.",
};

export default function SynthesisPage() {
  return (
    <div className="flex flex-1 flex-col gap-14 py-10">
      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
          Five paradoxes, one thesis
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight">Synthesis</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          None of the mathematics on this site is in dispute. Every simulation you ran converged
          exactly where the algebra said it would — 2/3, not ∞, 1.25X, a flipped slope, 1/3 vs 1/2
          vs 1/4. What makes each of these a &ldquo;paradox&rdquo; isn&apos;t a bug in probability
          theory; it&apos;s a gap between an informally stated question and the precise
          mathematical object that question actually picks out.
        </p>
      </div>

      <section className="flex flex-col gap-5">
        <h2 className="font-sans text-xl font-semibold tracking-tight">Where each one breaks</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {PARADOXES.map((paradox) => (
            <Card key={paradox.slug} href={`/${paradox.slug}`} accent={paradox.accent}>
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
                {paradox.tagline}
              </p>
              <h3 className="mb-2 font-sans text-lg font-semibold tracking-tight">
                {paradox.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{RESOLUTION[paradox.slug]}</p>
            </Card>
          ))}
        </div>
      </section>

      <Callout lane="neutral" label="The throughline">
        In every case, fixing a formal model made the math unambiguous and the simulations proved
        it out live, in front of you. The genuinely hard, genuinely philosophical work was never
        the arithmetic — it was deciding which model the informal question was actually asking
        about: which prior, which conditioning event, which grouping, which notion of
        &ldquo;random.&rdquo; That choice doesn&apos;t come from probability theory. It comes from
        the same place every application of mathematics to the real world does — judgment about
        which formalization the situation in front of you actually calls for.
      </Callout>
    </div>
  );
}
