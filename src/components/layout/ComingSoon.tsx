import { Callout } from "@/components/ui/Callout";
import type { ParadoxMeta } from "@/lib/paradoxes";

interface ComingSoonProps {
  paradox: ParadoxMeta;
  phase: number;
}

export function ComingSoon({ paradox, phase }: ComingSoonProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 py-10">
      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
          {paradox.tagline}
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight">{paradox.title}</h1>
      </div>

      <p className="max-w-2xl text-lg leading-relaxed text-muted">{paradox.description}</p>

      <Callout lane={paradox.accent} label={`Phase ${phase}`}>
        This interactive build is coming in Phase {phase} of the implementation plan.
      </Callout>
    </div>
  );
}
