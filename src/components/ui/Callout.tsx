import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface CalloutProps {
  lane?: "expect" | "reality" | "neutral";
  label?: string;
  children: ReactNode;
  className?: string;
}

const laneStyles = {
  expect: {
    border: "border-l-[color:var(--color-expect)]",
    label: "text-[color:var(--color-expect-2)]",
  },
  reality: {
    border: "border-l-[color:var(--color-reality)]",
    label: "text-[color:var(--color-reality-2)]",
  },
  neutral: {
    border: "border-l-muted",
    label: "text-muted",
  },
} as const;

export function Callout({ lane = "neutral", label, children, className }: CalloutProps) {
  const styles = laneStyles[lane];

  return (
    <div
      className={cn(
        "border-l-2 rounded-r-xl bg-background-elevated/60 px-5 py-4",
        styles.border,
        className,
      )}
    >
      {label && (
        <div className={cn("mb-1.5 text-xs font-mono uppercase tracking-wider", styles.label)}>
          {label}
        </div>
      )}
      <div className="text-[15px] leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}
