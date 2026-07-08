import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  accent?: "expect" | "reality";
}

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  accent = "expect",
  className,
  ...props
}: ButtonProps) {
  const accentColor = accent === "expect" ? "var(--color-expect)" : "var(--color-reality)";

  const variantClasses: Record<Variant, string> = {
    primary: "text-black shadow-lg shadow-black/20 hover:brightness-110",
    secondary:
      "bg-background-elevated border border-border text-foreground hover:border-[color:var(--accent)]",
    ghost: "text-muted hover:text-foreground hover:bg-background-elevated",
  };

  return (
    <button
      className={cn(
        "rounded-full font-medium transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      style={
        {
          "--accent": accentColor,
          ...(variant === "primary" ? { background: accentColor } : {}),
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
