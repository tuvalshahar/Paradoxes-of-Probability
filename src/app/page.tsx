import { Card } from "@/components/ui/Card";
import { PARADOXES } from "@/lib/paradoxes";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-16 py-10">
      <section className="flex max-w-3xl flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          Philosophy of Mathematics
        </p>
        <h1 className="font-sans text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          Paradoxes of{" "}
          <span className="text-[color:var(--color-expect-2)]">Probability</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted">
          Pure mathematical expectation often demands counter-intuitive, even infinite, results.
          Rational human decision-making rarely follows. These five interactive paradoxes let you
          collide the two head-on — play the games, run the simulations, and watch where the math
          and the intuition split.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PARADOXES.map((paradox) => (
          <Card key={paradox.slug} href={`/${paradox.slug}`} accent={paradox.accent}>
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
              {paradox.tagline}
            </p>
            <h2 className="mb-2 font-sans text-xl font-semibold tracking-tight">
              {paradox.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted">{paradox.description}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
