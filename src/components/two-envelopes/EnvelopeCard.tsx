"use client";

import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

interface EnvelopeCardProps {
  label: string;
  isOpen: boolean;
  amount?: number;
  isChosen: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function EnvelopeCard({
  label,
  isOpen,
  amount,
  isChosen,
  disabled,
  onClick,
}: EnvelopeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Envelope ${label}`}
      className={cn(
        "relative h-48 w-full [perspective:1000px] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-expect)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !disabled && "cursor-pointer",
        disabled && !isOpen && "cursor-default",
      )}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isOpen ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 [backface-visibility:hidden]",
            isChosen
              ? "border-[color:var(--color-expect)] bg-background-elevated shadow-[0_0_0_3px_rgba(108,99,255,0.25)]"
              : "border-border bg-background-elevated hover:border-muted",
          )}
        >
          <span className="text-5xl" role="img" aria-label="closed envelope">
            ✉️
          </span>
          <span className="font-mono text-sm text-muted">Envelope {label}</span>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-border bg-background-elevated [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="font-mono text-3xl font-semibold tabular-nums">
            ${amount?.toLocaleString()}
          </span>
          <span className="font-mono text-xs text-muted">Envelope {label}</span>
        </div>
      </motion.div>
    </button>
  );
}
