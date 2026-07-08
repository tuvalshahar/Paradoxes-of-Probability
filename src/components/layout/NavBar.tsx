"use client";

import { cn } from "@/lib/cn";
import { PARADOXES } from "@/lib/paradoxes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  ...PARADOXES.map((p) => ({ href: `/${p.slug}`, label: p.shortTitle })),
  { href: "/synthesis", label: "Synthesis" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="whitespace-nowrap font-sans text-sm font-semibold tracking-tight">
          Paradoxes of <span className="text-[color:var(--color-expect-2)]">Probability</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-background-elevated text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
