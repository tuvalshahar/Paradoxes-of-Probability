import { cn } from "@/lib/cn";
import Link from "next/link";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  href?: string;
  accent?: "expect" | "reality" | "none";
}

export function Card({ href, accent = "none", className, children, ...props }: CardProps) {
  const classes = cn(
    "group relative rounded-2xl border border-border bg-background-elevated p-6 transition-all duration-200",
    href && "cursor-pointer hover:border-[color:var(--card-accent)] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30",
    className,
  );

  const style =
    accent !== "none"
      ? ({
          "--card-accent": accent === "expect" ? "var(--color-expect)" : "var(--color-reality)",
        } as React.CSSProperties)
      : undefined;

  if (href) {
    return (
      <Link href={href} className={classes} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <div className={classes} style={style} {...props}>
      {children}
    </div>
  );
}
