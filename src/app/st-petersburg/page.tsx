import { BankrollCapSlider } from "@/components/st-petersburg/BankrollCapSlider";
import { StPetersburgGame } from "@/components/st-petersburg/StPetersburgGame";
import { StPetersburgSimulation } from "@/components/st-petersburg/StPetersburgSimulation";
import { Callout } from "@/components/ui/Callout";
import { getParadoxBySlug } from "@/lib/paradoxes";
import { notFound } from "next/navigation";

export default function StPetersburgPage() {
  const paradox = getParadoxBySlug("st-petersburg");
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
        <p className="max-w-2xl text-muted">
          A fair coin flips until it lands Heads. Every Tails doubles the payout. Land Heads on
          flip 1 and you win $1; flip 10 and you win $512; flip 30 and you&apos;d win over $500
          million.
        </p>
        <StPetersburgGame />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-sans text-xl font-semibold tracking-tight">
          Fast-forward the simulation
        </h2>
        <p className="max-w-2xl text-muted">
          Mathematically, the expected payout of this game is infinite — every extra flip halves
          in probability but doubles in payout, so the terms never shrink. Run a batch and see how
          little that shows up in practice.
        </p>
        <StPetersburgSimulation />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-sans text-xl font-semibold tracking-tight">
          The casino&apos;s maximum bankroll
        </h2>
        <p className="max-w-2xl text-muted">
          No real casino can honor an unbounded promise. The moment you cap how much the house can
          possibly pay, the infinite expectation collapses into an ordinary, small number —
          drag the slider and watch it happen.
        </p>
        <BankrollCapSlider />
      </section>

      <Callout lane="reality" label="The tension">
        Pure expectation says this game is worth paying any finite price to play. No rational
        person would hand over more than a few dollars for it — and they&apos;d be right to
        refuse, because every real counterparty (a casino, an insurer, a government) operates
        under a bounded bankroll. The paradox isn&apos;t a flaw in probability theory; it&apos;s a
        reminder that &ldquo;expected value&rdquo; only guides real decisions once you attach it
        to a world with finite resources.
      </Callout>
    </div>
  );
}
