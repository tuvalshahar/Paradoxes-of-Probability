import { NavBar } from "@/components/layout/NavBar";
import { PageTransition } from "@/components/layout/PageTransition";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paradoxes of Probability",
  description:
    "An interactive exploration of the tension between mathematical expectation and rational decision-making.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body">
        <NavBar />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
