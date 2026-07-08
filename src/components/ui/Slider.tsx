"use client";

import { cn } from "@/lib/cn";
import type { ChangeEvent } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  accent?: "expect" | "reality";
  formatValue?: (n: number) => string;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  accent = "expect",
  formatValue = (n) => `${n}`,
  onChange,
  className,
}: SliderProps) {
  const accentColor = accent === "expect" ? "var(--color-expect)" : "var(--color-reality)";
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm text-muted">{label}</label>
        <span className="font-mono text-sm tabular-nums text-foreground">
          {formatValue(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
        className={cn(
          "h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          accent === "expect"
            ? "focus-visible:ring-[color:var(--color-expect)]"
            : "focus-visible:ring-[color:var(--color-reality)]",
        )}
        style={{
          background: `linear-gradient(to right, ${accentColor} ${percent}%, var(--color-border) ${percent}%)`,
          accentColor,
        }}
      />
    </div>
  );
}
