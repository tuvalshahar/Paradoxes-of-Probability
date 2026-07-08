"use client";

import { cn } from "@/lib/cn";
import type { DoorContent } from "@/lib/simulations/montyHall";
import { motion } from "framer-motion";

interface DoorProps {
  index: number;
  isOpen: boolean;
  content?: DoorContent;
  isSelected: boolean;
  isHostRevealed: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function Door({
  index,
  isOpen,
  content,
  isSelected,
  isHostRevealed,
  disabled,
  onClick,
}: DoorProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Door ${index + 1}`}
      className={cn(
        "relative h-56 w-full [perspective:1000px] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-expect)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !disabled && "cursor-pointer",
        disabled && !isOpen && "cursor-default",
      )}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isOpen ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front face — closed door */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-2xl border-2 [backface-visibility:hidden]",
            isSelected
              ? "border-[color:var(--color-expect)] bg-background-elevated shadow-[0_0_0_3px_rgba(108,99,255,0.25)]"
              : isHostRevealed
                ? "border-[color:var(--color-reality)] bg-background-elevated"
                : "border-border bg-background-elevated hover:border-muted",
          )}
        >
          <span className="font-mono text-5xl font-semibold text-muted">{index + 1}</span>
        </div>

        {/* Back face — revealed content */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-border bg-background-elevated [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <span className="text-6xl" role="img" aria-label={content === "car" ? "car" : "goat"}>
            {content === "car" ? "🚗" : "🐐"}
          </span>
        </div>
      </motion.div>
    </button>
  );
}
