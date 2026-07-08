"use client";

import { cn } from "@/lib/cn";
import { animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface StatCounterProps {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}

const defaultFormat = (n: number) => Math.round(n).toLocaleString();

export function StatCounter({
  value,
  format = defaultFormat,
  duration = 0.6,
  className,
}: StatCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(prevValue.current, value, {
      duration,
      ease: "easeOut",
      onUpdate(latest) {
        node.textContent = format(latest);
      },
    });

    prevValue.current = value;
    return () => controls.stop();
  }, [value, format, duration]);

  return <span ref={nodeRef} className={cn("font-mono tabular-nums", className)} />;
}
