# Paradoxes of Probability — Interactive Web Experience

**Course:** Philosophy of Mathematics
**Theme:** The tension between pure mathematical expectation and rational human decision-making

---

## 0. Current Status

**Last updated:** 2026-07-08
**Progress:** Phase 0 (Setup & Design System) ✅, Phase 1 (Monty Hall) ✅, Phase 2 (St. Petersburg) ✅, Phase 3 (Two-Envelope Paradox) ✅, Phase 4 (Simpson's Paradox) ✅, Phase 5 (Bertrand's Paradox) ✅, and **Phase 6 (Synthesis, Polish & Deployment) ✅** are all complete and verified running locally, including the performance and cross-browser checklist. **Deployment to Vercel is the one deliberately-deferred item** — held off by explicit choice, not blocked on anything; see section 3's Phase 6 entry for how to pick it back up whenever you're ready.

### What's actually left
Functionally, the app is done. The only open item is **deploying it** (Vercel), which you've chosen to defer — there is no blocker, just a "not yet." The optional "About this project" page (Phase 6 step 6) also remains untouched, but it's explicitly optional and was never required. Everything else in the original plan (sections 2.1–2.5, and Phase 6 steps 1–4) is built, tested, and confirmed working by you.

### What exists right now
- A working Next.js 16 + TypeScript + Tailwind v4 app in this directory, with `framer-motion`, `recharts`, `zustand`, and `clsx` installed.
- The full design system (dark background, expect/reality accent-lane colors, shared UI primitives, sticky nav, animated page transitions) described in sections 1.2–1.3 below.
- All 7 routes are now fully built (`/`, `/monty-hall`, `/st-petersburg`, `/two-envelopes`, `/simpsons`, `/bertrand`, `/synthesis`) — `/synthesis` was the last placeholder and now has real closing content (see Phase 6 below).
- `/monty-hall` is fully built per section 2.1: manual 3-door game with scoreboard, animated 10,000-run convergence chart, and the conditional-probability breakdown table.
- `/st-petersburg` is fully built per section 2.2: animated coin-flip round with a live doubling payout counter, an animated batch simulation whose running average conspicuously refuses to settle, and a log-scale bankroll-cap slider with a live capped-EV curve.
- `/two-envelopes` is fully built per section 2.3: two flip-open envelope cards, an animated step-by-step reveal of the classic "always switch" argument, an infinite-loop visualizer showing the argument reapplying forever, and a "show the resolution" panel with a live-computed table of exactly where the naive 50/50 assumption is right, wrong-in-magnitude, or wrong-in-direction.
- `/simpsons` is fully built per section 2.4: a case switcher between two independent synthetic examples (study hours vs. exam score; drug dosage vs. blood pressure reduction), each with a scatter plot + per-group regression lines, a "Combine data" toggle that recolors points and morphs the trendline to a verified sign reversal, and a "why this happens" panel that names the actual lurking variable for whichever case is selected.
- `/bertrand` is fully built per section 2.5: a `<canvas>`-drawn circle with a dashed inscribed triangle, a 3-way method selector (random endpoints / random radius / random midpoint) with an inline caption that swaps to describe whichever method is currently selected, "Draw 1/100/1,000/10,000" buttons that reveal chords incrementally (colored cyan/coral by longer/shorter-than-the-triangle's-side) via `requestAnimationFrame` batching, a live percentage counter, and a toggleable panel comparing all three methods' generation process and limiting probability side by side with the closing "ambiguous question, not broken math" philosophical point.
- `/synthesis` now has real content instead of the placeholder: a closing thesis paragraph, a card grid recapping *where each paradox's argument specifically breaks* (not a re-summary of the demo — the actual resolution: Monty Hall's host-knowledge signal, St. Petersburg's unrealizable tail, Two-Envelopes' fixed-vs-random-variable confusion, Simpson's lurking variable, Bertrand's undefined "uniform"), and a closing callout tying all five back to "the math is unambiguous once you fix a model; the judgment call is picking the model."
- A site-wide accessibility/contrast pass is done and confirmed working — it found and fixed two real, pre-existing bugs (not just cosmetic additions): a WCAG-AA-failing button text color used on every "primary" button across the whole app since Phase 0, and three interactive components with no visible keyboard focus indicator at all. Full detail in Phase 6 below.

### Known deviation from the original plan
- **Fonts:** Section 1.2 originally called for `Inter`/`Sora` + `IBM Plex Mono` loaded via `next/font/google`. The dev sandbox used to build this couldn't reach Google's font CDN at build time, so the app currently ships with a **system-font stack** (`-apple-system`/`Segoe UI` for UI text, native monospace for numbers) defined in `src/app/globals.css`. This is a one-line revert if you want the original fonts back — just re-add the `next/font/google` imports in `src/app/layout.tsx`; it should fetch fine outside that sandbox.
- **Build tool:** `next build`/`next dev` should use Turbopack (the Next.js 16 default) without issue on a normal machine. If you ever see a Turbopack error about "binding to a port," fall back to `npm run dev -- --webpack` / `npm run build -- --webpack` — this was only needed inside the sandboxed dev environment, not expected on your own machine.

### Next up
The plan is functionally complete. The only remaining item is deploying to Vercel (deferred by your choice — no blocker), plus the fully-optional "About this project" page. See section 3's Phase 6 entry for how to resume deployment whenever you're ready.

---

## 1. Project Vision & UI/UX Description

### 1.1 Core Concept

The app is a single-page, scroll/route-based experience that treats each paradox as its own "chapter." Every chapter follows the same narrative arc, so the user always knows what to expect:

1. **The Setup** — a short, punchy explanation of the paradox (2–4 sentences, not a wall of text).
2. **The Interaction** — the user plays with it directly (clicks doors, drags sliders, picks envelopes, draws chords).
3. **The Reveal** — a live chart/visualization shows the mathematical truth emerging from data, often contradicting intuition.
4. **The Philosophical Beat** — a pull-quote-style callout connecting the demo back to the tension between *expected value* and *rational choice under real-world constraints*.

The unifying visual metaphor is **"Expectation vs. Reality"** — every paradox page has two conceptual lanes: a cool-toned lane for "what the math says" and a warm-toned lane for "what a rational person would actually do." Charts, numbers, and callouts are color-coded consistently across the whole app using this pairing.

### 1.2 Look & Feel

- **Aesthetic:** Modern "dark-mode-first" scientific/editorial style — think Observable notebooks × Stripe docs × 3Blue1Brown. Generous whitespace, large serif or humanist display type for headlines, monospace for numbers/stats.
- **Palette:**
  - Background: near-black (`#0B0E14`) with subtle grain/gradient.
  - Primary accent (math/expectation lane): electric indigo/cyan (`#6C63FF` / `#22D3EE`).
  - Secondary accent (reality/rational lane): warm amber/coral (`#FF8A65` / `#F59E0B`).
  - Success/neutral text: off-white (`#E6E6EB`), muted gray (`#8A8FA3`) for secondary text.
- **Typography:** `Inter` or `Sora` for UI/headings, `IBM Plex Mono` or `JetBrains Mono` for numbers, formulas, and running statistics (they should feel like they're "ticking").
- **Motion:** Every state change animates — door reveals flip in 3D, chart bars grow rather than snap, numbers count up/down with easing (via `framer-motion`). Motion should always *communicate*, not decorate — e.g. a converging simulation should visibly "settle."
- **Layout:** Sticky left/top nav with 5 paradox icons + progress indicator. Each paradox is a full route (`/monty-hall`, `/st-petersburg`, `/two-envelopes`, `/simpsons`, `/bertrand`), plus a landing page that frames the overarching thesis and a closing "Synthesis" page that recaps the philosophical throughline.
- **Responsiveness:** Desktop-first (charts and canvases need room), but must degrade gracefully to tablet. Mobile can be a simplified/read-only fallback if time-constrained — call this out explicitly as a stretch goal, not a requirement.

### 1.3 Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router) + React 18 + TypeScript** | File-based routing gives you the 5 paradox pages "for free," great DX, easy to deploy (Vercel) for grading/demo links, TS catches bugs in simulation math. |
| Styling | **Tailwind CSS** + a small set of hand-written CSS variables for the two accent lanes | Fast iteration on a consistent design system without writing a component library from scratch. |
| Animation | **Framer Motion** | Declarative, physics-based transitions for door flips, envelope reveals, number counters. |
| Charts | **Recharts** for standard line/bar/scatter charts (Monty Hall convergence, St. Petersburg EV curve, Simpson's scatter+trendlines), **raw `<canvas>` / HTML5 Canvas API** for Bertrand's Paradox (geometric drawing) | Recharts covers 4 of 5 paradoxes with minimal code; Bertrand genuinely needs pixel-level control that a charting library won't give you. |
| State | **Zustand** (tiny global store) or just React state/hooks per page | Each paradox is self-contained — you likely don't need Redux-level ceremony. Zustand only if you want to persist "visited/completed" state across the nav. |
| Simulation logic | Plain TypeScript modules in `/lib/simulations/`, fully decoupled from React components | Lets you unit-test the probability math independently of the UI (good for a math-focused project — you can literally show correctness). |
| Deployment | **Vercel** (free tier) | One-command deploy, shareable link for your professor/TA, zero server maintenance. |

**Alternative (lighter) stack** if you want to avoid the Next.js/React learning curve: **Vite + vanilla TypeScript + Chart.js + native CSS**. Everything in this plan still applies conceptually — swap "components" for "modules" and "React state" for plain JS state objects. Given the phrase "highly interactive," React's component model will make the 5 mini-apps *much* easier to keep isolated and maintainable, so it's the recommended default.

---

## 2. Detailed Breakdown of Features (Per Paradox)

### 2.1 The Monty Hall Problem

**Narrative:** Choosing to switch feels like a 50/50 coin flip. It isn't — it's 2/3 vs 1/3.

**Must-build features:**
- Interactive 3-door game: user picks a door → host reveals a goat behind one of the other two → user chooses **Stay** or **Switch** → reveal, with win/loss tallied in a running scoreboard ("You: 7 wins / 10 games").
- Door components with 3D flip animation (Framer Motion `rotateY`) revealing goat 🐐 or car 🚗 art/icons.
- **"Fast-Forward Simulation"** control panel: buttons for 100 / 1,000 / 10,000 automated runs, split into two simulated populations (always-stay vs always-switch), running without per-door animation (batch-computed).
- Live-updating **line chart** (Recharts) plotting cumulative win-rate over run count for both strategies, with horizontal reference lines at 33.3% and 66.6% that the lines visibly converge toward.
- A running numeric readout: "Switch win rate: 66.41% (n=8,213)" ticking in real time as the simulation runs (throttle updates via `requestAnimationFrame` batching so 10,000 runs doesn't freeze the UI).
- Toggle to reveal the conditional-probability explanation (a small tree diagram or table showing all door-pick × car-location combinations).

**Key implementation detail:** separate the *game logic* (`playRound(strategy): boolean`) from the *rendering* — the same pure function drives both the manual game and the bulk simulation.

### 2.2 The St. Petersburg Paradox

**Narrative:** Expected value says pay any price to play. No rational person would.

**Must-build features:**
- Coin-flip animation: flip until first Heads; payout doubles each flip (Tails=continue, 1→2→4→8…), Heads ends the round and pays out.
- "Play a Round" button that runs one live animated sequence (capped visually at a reasonable number of flips per round, e.g., stop displaying individual flips past ~15 and show a "…and it kept going" shortcut) plus a payout counter.
- **Batch simulation**: run N rounds (slider or preset buttons), show a **running average payout** chart — it should visibly *not* converge, or converge extremely slowly, illustrating the divergent expectation.
- The star feature: an **interactive slider "Casino's Maximum Bankroll"** ($100 → $1,000,000+, log scale). As the user drags it:
  - Show the *theoretical* capped expected value formula updating live: with a cap $M$, $E[X] = \sum_{k=1}^{\log_2(M)} \frac{1}{2^k}\cdot 2^{k-1} + P(\text{exceed})\cdot M$, which resolves to a small finite number (~$\log_2(M)$ dollars).
  - A chart/gauge showing "Uncapped EV: ∞" crossed out next to "Capped EV: $13.50" (or whatever the live number is), updating as the slider moves.
  - A bar comparing "What you'd pay to play (rational, ~$10-20)" vs "What the math says it's worth (∞)".
- Philosophical callout: ties to why casinos/insurers must bound liabilities, and why "infinite expectation" isn't decision-guiding in practice.

**Key implementation detail:** the capped-EV formula is a pure function `expectedValueWithCap(maxBankroll: number): number` — compute it analytically (don't Monte-Carlo it, or if you do, show both the analytic and simulated values converging, which is a nice touch).

### 2.3 The Two-Envelope Paradox

**Narrative:** The "switching" argument seems to always favor swapping, no matter which envelope you hold — an infinite regress.

**Must-build features:**
- Two large, tappable **envelope cards** (closed by default) — user picks one, sees a "hidden" amount (randomly generated, e.g., $10, with the other containing either $5 or $20, 50/50 — determined by a fixed underlying pair, not the flawed "always 2x or 0.5x of what you see" framing... see note below).
- After opening one envelope, show the **classic fallacious argument** step by step as an animated equation reveal: "If this envelope has $X, the other has either $X/2 or $2X, each with probability 1/2, so E[other] = 1.25X → I should switch." Let the user click "Switch" and see the result.
- A **"Loop Visualizer"**: a circular/infinite-arrow animation showing that this exact argument applies *again* after switching, ad infinitum — reinforcing that something in the reasoning must be flawed (visualize it as a Möbius-strip-like looping arrow between the two envelopes with the equation re-appearing each cycle).
- A toggle: **"Show the resolution"** — a short, clear explanation of the standard resolution (the fallacy of treating $X$ as a fixed value rather than a random variable, and the difference between the "fixed total pair" setup vs. an improper/unbounded prior on the amount). This is the philosophically richest paradox — give it real explanatory text, not just visuals.
- Optional stretch: let the user pick between two underlying models (bounded fixed-pair vs. the unbounded-prior version) via tabs, and show why one resolves cleanly and the other genuinely doesn't.

**Key implementation detail:** decide up front which formal version you're simulating (recommend the **fixed-pair version**, e.g., pair is always $(A, 2A)$ for a randomly chosen $A$) — it's the version with a clean, teachable resolution and avoids improper-prior rabbit holes eating your dev time.

### 2.4 Simpson's Paradox

**Narrative:** Aggregation can reverse a trend's direction entirely.

**Must-build features:**
- **Interactive scatter plot** (Recharts `ScatterChart` + custom trendline overlay, or D3 for the regression line) showing two distinct groups (e.g., "Group A" and "Group B," color-coded per your accent-lane palette) each with a *positive* trend within-group.
- Per-group linear regression line rendered live (simple least-squares computed in a `/lib` utility, not a heavy stats library).
- A prominent **"Combine Data" toggle/button**: animates the two groups merging into one color/point-cloud, and the trendline recalculates and **visibly flips to negative slope** — this transition should be the single most "wow" animated moment in the app (crossfade points, morph the trendline with a tweened slope value).
- Contextual labels using a real-world-flavored example (classic choices: drug treatment success rates across two hospitals/severity groups, or batting averages across two seasons) with axis labels and a legend explaining what each point represents.
- A toggle for a **second real dataset** (stretch goal) so the user can confirm this isn't a cherry-picked fluke — e.g., let them switch between 2 pre-baked datasets.
- Small explanatory panel: introduces the idea of a **lurking/confounding variable** and why the correct causal question determines whether you should look at the grouped or combined trend.

**Key implementation detail:** hardcode 2 well-chosen synthetic datasets (you control the numbers, so you can guarantee a clean paradox) rather than trying to find real data that behaves perfectly — this is standard practice for this paradox even in textbooks.

### 2.5 Bertrand's Paradox

**Narrative:** "Random chord" isn't well-defined — the answer to "what's the probability a chord is longer than the inscribed triangle's side" changes with the method.

**Must-build features:**
- **HTML5 Canvas** drawing: a circle with an inscribed equilateral triangle (rendered once, updates only when circle size changes).
- Method selector (3 tabs/buttons), each generating random chords via a different classic method:
  1. **Random endpoints** — pick 2 uniform random points on the circle's circumference → P(longer) = 1/3.
  2. **Random radius** — pick a random radius (angle) and a uniform random point along it, chord perpendicular to that radius at that point → P(longer) = 1/2.
  3. **Random midpoint** — pick a uniform random point inside the circle as the chord's midpoint → P(longer) = 1/4.
- "Generate N Chords" button (with presets: 1, 100, 1,000, 10,000) — chords drawn on canvas colored by outcome (e.g., cyan if longer than triangle side, coral if shorter), building up visually as an accumulating density plot.
- Live-updating percentage counter: "Chords longer than triangle side: 33.2% (n=8,400)" — should visibly converge to 1/3, 1/2, or 1/4 depending on selected method.
- Side-by-side or tabbed comparison mode (stretch): run all 3 methods simultaneously in 3 mini-canvases so the user can see all three densities and convergence values at once.
- Explanatory panel on *why* "uniform randomness" is ambiguous for a continuous geometric object — this is the clearest example in the whole project of "the math is unambiguous once you fix a formal model, but there's no unique 'natural' model," which is a great philosophy-of-math punchline to end the app on.

**Key implementation detail:** for performance with 10,000 chords, draw incrementally to an **offscreen canvas** (or just draw directly and skip clearing between draws) rather than re-rendering the whole scene each frame — use `requestAnimationFrame` batching similar to Monty Hall's simulation.

---

## 3. Step-by-Step Implementation Plan

This is written so you can come back and say "let's do Phase 2" and I'll execute just that slice.

### Phase 0 — Project Setup & Design System ✅ Done
1. Scaffold Next.js + TypeScript + Tailwind project (`create-next-app`).
2. Install dependencies: `framer-motion`, `recharts`, `zustand` (optional), `clsx`.
3. Set up global design tokens in `tailwind.config.ts` / `globals.css`: color palette (the two accent lanes), font imports, spacing scale.
4. Build shared layout: sticky nav with 5 paradox links + home + synthesis page, page transition wrapper (Framer Motion `AnimatePresence`).
5. Build a few **shared primitives** used across all 5 pages: `<StatCounter>` (animated number), `<Callout>` (philosophical pull-quote box), `<Slider>`, `<Button>`, `<Card>`.
6. Build the landing page: project title, one-paragraph thesis statement, 5 clickable paradox cards.

Built as: `src/app/globals.css` (tokens), `src/lib/paradoxes.ts` (shared paradox metadata), `src/lib/cn.ts`, `src/components/ui/{Button,Card,Callout,StatCounter,Slider}.tsx`, `src/components/layout/{NavBar,PageTransition,ComingSoon}.tsx`, `src/app/page.tsx` (landing), `src/app/synthesis/page.tsx` (stub) — see section 0 for the font deviation.

### Phase 1 — Monty Hall ✅ Done
1. Write pure simulation logic in `/lib/simulations/montyHall.ts` (`playRound`, `simulateBatch`).
2. Build `<Door>` component with flip animation and goat/car reveal.
3. Build the manual 3-door game flow (pick → host reveal → stay/switch → result) with scoreboard.
4. Build the batch simulation panel + Recharts convergence line chart.
5. Wire up run-count presets (100/1,000/10,000) with throttled UI updates.
6. Add explanatory toggle (conditional probability breakdown).
7. Polish animations and mobile layout check.

Built as: `src/lib/simulations/montyHall.ts` (pure logic — `randomDoor`, `pickHostReveal`, `pickSwitchDoor`, `playManualRound`, `isWin`, `simulateBatch`), `src/components/monty-hall/{Door,MontyHallGame,MontyHallSimulation,ConditionalBreakdown}.tsx`, assembled in `src/app/monty-hall/page.tsx`. The batch simulation reveals its chart via a `requestAnimationFrame` loop (no `performance.now()`, to satisfy the React Compiler purity lint rule) rather than computing instantly, so the "fast-forward" feel is preserved even though the underlying math runs in milliseconds. Step 7 (mobile layout pass) has not been explicitly verified yet — worth a check before final submission.


### Phase 2 — St. Petersburg Paradox ✅ Done
1. Write `/lib/simulations/stPetersburg.ts`: single-round simulator, batch simulator, and analytic `expectedValueWithCap(maxBankroll)`.
2. Build coin-flip animation sequence for a single manual round.
3. Build batch-run panel with running-average chart (illustrate non-convergence).
4. Build the **Bankroll Cap slider** with live-updating capped-EV display and "∞ vs finite" comparison visual.
5. Add philosophical callout tying to real-world bounded liability.

Built as: `src/lib/simulations/stPetersburg.ts` (pure logic — `playRound`, `simulateBatch`, `expectedValueWithCap`), `src/components/st-petersburg/{StPetersburgGame,StPetersburgSimulation,BankrollCapSlider}.tsx`, assembled in `src/app/st-petersburg/page.tsx`. `expectedValueWithCap` is derived analytically (`K/2 + maxBankroll / 2^K`, where `K` is the largest flip count whose uncapped payout still fits under the cap) rather than Monte-Carlo'd, so the slider updates instantly with no simulation noise. The bankroll slider maps a linear control onto an exponent (`bankroll = 2^exponent`) to get smooth log-scale behavior from the existing linear `<Slider>` primitive, and the EV-vs-bankroll curve uses Recharts' `scale="log"` x-axis. The batch simulation's explanatory copy leans into a subtlety worth remembering for the write-up: most finite runs look like the average is settling on a small, stable number — that apparent convergence is an artifact of under-sampling the tail, not evidence against the (genuinely infinite) theoretical expectation.

**Post-Phase-6 enhancement (confirmed working):** at explicit request, extended the bankroll cap slider's range from ~$10M up to exactly **$1,000,000,000** (`MAX_EXPONENT` in `BankrollCapSlider.tsx` is now `Math.log2(1e9)` rather than a hardcoded `23.3`, so the top of the slider lands on exactly $1B), and updated the explanatory copy below the chart to use the $1B example instead of the old $10M one (capped EV there is ~$15.93). Also added a fourth fast-forward simulation preset, **`Run 1,000,000`**, to `StPetersburgSimulation.tsx`'s `PRESETS` array — no architectural changes needed since `simulateBatch` already downsamples to ≤200 chart points regardless of `n` and the reveal animation duration is fixed, so the new preset is exactly as fast/smooth as the existing 100/1,000/10,000 ones.

### Phase 3 — Two-Envelope Paradox ✅ Done
1. Decide and document the formal model (fixed-pair version, recommended).
2. Write `/lib/simulations/twoEnvelopes.ts`: envelope-pair generator, switch-outcome calculator.
3. Build envelope card UI + open/switch interaction.
4. Build the step-by-step fallacious-argument animation (equation reveal).
5. Build the infinite-loop visualizer.
6. Write and integrate the "Show the resolution" explanatory panel.

Built as: `src/lib/simulations/twoEnvelopes.ts` (pure logic — the low amount `A` is drawn uniformly from a finite set `{10,15,...,50}`, pair is always `(A, 2A)`; also exposes `posteriorLowGivenX`/`trueExpectedOther`, which compute the *actual* probability an observed amount is the low envelope under this finite prior), `src/components/two-envelopes/{EnvelopeCard,TwoEnvelopeGame,FallacyReveal,LoopVisualizer,TwoEnvelopeResolution}.tsx`, assembled in `src/app/two-envelopes/page.tsx`. Chose the fixed-pair model over the unbounded-prior version, as recommended, specifically because a *finite* prior makes the resolution concrete and checkable rather than a hand-wavy appeal to "improper priors": the "Show the resolution" table computes real numbers from the same generator used by the game, showing that the naive "always 1.25X, always switch" formula is only actually correct for the handful of amounts ($20/$30/$40/$50) that could plausibly be either the low or high envelope — for unambiguous amounts ($15, or $70/$100) it's either too conservative or flat-out backwards (recommends switching when switching is a guaranteed loss). The loop visualizer runs as a self-contained illustrative demo (fixed $100 starting value, 5 iterations) decoupled from the live game state, for clarity.

### Phase 4 — Simpson's Paradox ✅ Done
1. Author 2 synthetic datasets (2 groups each) that produce a clean paradox; store as static JSON/TS data.
2. Write `/lib/stats/linearRegression.ts` (simple least-squares slope/intercept).
3. Build scatter plot with per-group trendlines (Recharts scatter + custom SVG/line overlay).
4. Build "Combine Data" toggle with animated point recoloring + trendline morph to negative slope.
5. Add dataset switcher (stretch) and confounding-variable explanatory panel.

Built as: `src/lib/stats/linearRegression.ts` (pure least-squares), `src/lib/data/simpsons.ts` (two deterministic synthetic cases — "study hours vs. exam score" and "drug dosage vs. blood pressure reduction" — each built from a `buildGroup` helper with no `Math.random`, so the dataset is identical on server and client), `src/components/simpsons/{SimpsonsScatter,ConfoundingExplainer,SimpsonsExplorer}.tsx`, assembled in `src/app/simpsons/page.tsx`. Did the originally-stretch "dataset switcher" up front rather than leaving it optional, since the user specifically asked for a second case to confirm the reversal isn't a fluke of one dataset; both cases' regressions were numerically verified before building the UI on top of them (case 1: +3.16 / +3.16 within-group → -1.80 combined; case 2: +0.53 / +0.53 within-group → -0.49 combined). `SimpsonsExplorer` owns the shared `caseIndex`/`combinedView` state so the chart and the explanatory panel stay in sync, and the panel's "lurking variable" text is data-driven per case rather than hardcoded. One fix worth noting: axis titles were originally passed via Recharts' built-in `XAxis`/`YAxis` `label` prop, which got clipped by the negative chart margins needed for the tick numbers — replaced with plain HTML captions outside the SVG (a real CSS `vertical-rl` column for the Y-axis label, a centered caption below for the X-axis label), which is more robust than fighting Recharts' internal label positioning.

### Phase 5 — Bertrand's Paradox ✅ Done
1. Write `/lib/simulations/bertrand.ts`: chord generators for all 3 methods, triangle-side-length calculator, longer/shorter classifier.
2. Build the `<canvas>` component: draw circle + inscribed triangle.
3. Implement chord drawing + incremental accumulation for N-run batches.
4. Build method selector tabs and live percentage counter.
5. (Stretch) Build 3-way simultaneous comparison view.
6. Add "why randomness is ambiguous" explanatory panel.

Built as: `src/lib/simulations/bertrand.ts` (pure logic — `generateChord`/`generateBatch` for the three classic methods, `triangleSideLength`, `triangleVertices`), `src/components/bertrand/{BertrandCanvas,BertrandExperiment,RandomnessExplainer}.tsx`, assembled in `src/app/bertrand/page.tsx`. Before writing any UI, all three chord-generation formulas were Monte-Carlo-verified against their textbook limits over 2,000,000 trials each (endpoints → 0.3329 vs. 1/3, radius → 0.4998 vs. 1/2, midpoint → 0.2503 vs. 1/4) — the "random radius" and "random midpoint" methods both reduce to the same "chord's distance from center < R/2" condition, but differ in *how that distance is distributed* (uniform vs. `R·sqrt(uniform)`, matching a uniform draw over the disk's area), which is what actually produces 1/2 vs. 1/4. `BertrandCanvas` exposes an imperative `drawChord`/`reset` handle rather than taking chords as props, so `BertrandExperiment` can stroke thousands of chords straight onto the canvas inside a `requestAnimationFrame` reveal loop (same batching pattern as Monty Hall's simulation) without round-tripping each one through React state or ever clearing the canvas between chords — chords are drawn with partial opacity so they visibly accumulate into a density plot. Canvas theme colors (cyan for longer, coral for shorter, matching the design system's expect-2/reality tokens) are read once via `getComputedStyle` rather than hardcoded, so the drawing code stays in sync with `globals.css` instead of duplicating hex values. Per explicit follow-up request, added an inline caption next to the method tabs that shows only the currently-selected method's generation description (swaps live as you switch tabs), in addition to the toggleable comparison panel that lists all three methods' descriptions and probabilities side by side. Step 5 (3-way simultaneous comparison view) was skipped as the stretch goal it's marked as, consistent with skipping Two-Envelope's model-tabs stretch goal earlier.

### Phase 6 — Synthesis, Polish & Deployment ✅ Done (deployment deferred by explicit choice)
1. Build the closing "Synthesis" page: recap all 5 paradoxes' core tension in one scroll, tying back to the philosophy-of-math thesis.
2. Full responsive/accessibility pass (color contrast, keyboard navigation for interactive elements, `aria-label`s on canvas/chart interactions).
3. Performance pass on the two heaviest simulations (Monty Hall 10k runs, Bertrand 10k chords) — verify no UI jank.
4. Cross-browser smoke test (Chrome, Safari, Firefox).
5. Deploy to Vercel; verify production build.
6. (Optional) Write a short in-app "About this project" page citing sources/references used for each paradox's math.

**Steps 1–2 — built and confirmed working:**

- **Step 1, `/synthesis` page** (`src/app/synthesis/page.tsx`): replaced the "Coming in Phase 6" placeholder with real content — a thesis paragraph arguing that none of the five paradoxes are a crack in probability theory, then a `RESOLUTION` map keyed by paradox slug that gives each one's *specific* resolution (not a re-summary of its demo): Monty Hall's host-knowledge signal, St. Petersburg's expectation being dominated by astronomically rare tails no single real bankroll can realize, Two-Envelopes' fallacy of treating an *observed* amount as if it were still the unresolved random variable X, Simpson's correctly-computed-but-differently-scoped regressions with a lurking variable, and Bertrand's "random chord" never being a precise statement until you fix which parameter is uniform. Reuses the existing `Card`/`accent` components from the landing page so each card links back to its paradox route. Closes with a `Callout` tying all five to one thesis: the arithmetic was never the hard part — the judgment call is picking which formal model an informal question is actually asking about.

- **Step 2, accessibility/contrast pass** — this was not a cosmetic pass; it was done by computing actual numbers (WCAG relative-luminance contrast ratios via ad hoc Node scripts, plus a full-repo grep for `outline-none`) rather than eyeballing, which surfaced two real, previously unnoticed bugs:
  - **Real bug #1 — failing button text contrast.** `src/components/ui/Button.tsx`'s `primary` variant used white text on the app's solid accent backgrounds. Computed contrast: white-on-indigo (`--color-expect`, #6c63ff) = 4.32:1, white-on-coral (`--color-reality`, #ff8a65) = **1.86:1** — both fail WCAG AA's 4.5:1-for-normal-text threshold, the coral one badly. This bug had existed since Phase 0 and affected every "primary" button across the entire app (Monty Hall, St. Petersburg, Two-Envelopes, Simpson's, Bertrand). Fixed by switching to black text: 4.87:1 on indigo, 9.08:1 on coral — both clean passes. Confirmed via grep that no other component uses `text-white` on a solid accent background, so this was the only place needing the fix.
  - **Real bug #2 — no keyboard focus indicator.** `src/components/monty-hall/Door.tsx`, `src/components/two-envelopes/EnvelopeCard.tsx`, and `src/components/ui/Slider.tsx` all stripped the native browser focus outline (`outline-none` / `focus:outline-none`) with nothing put in its place — a real bug for anyone navigating by keyboard (tabbing to a Monty Hall door, an envelope card, or a slider gave zero visual indication it was focused). Fixed all three with `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background` plus an accent-colored ring (`focus-visible:ring-[color:var(--color-expect)]` or `...reality`, chosen by each component's existing `accent` prop where applicable). Used Tailwind's arbitrary-value `ring-[color:var(--token)]` syntax rather than guessing Tailwind v4's internal `--tw-ring-*` variable name, since Tailwind v4's utility generation is compiled into a native Rust/Oxide binary with no greppable CSS source in `node_modules` to verify that name against.
  - Also added, as smaller/lower-risk accessibility improvements: `aria-current="page"` on the active nav link in `src/components/layout/NavBar.tsx` (was visually distinguished already, but invisible to screen readers before this), and `role="img"` + a descriptive `aria-label` on the Bertrand `<canvas>` in `src/components/bertrand/BertrandCanvas.tsx` (was a bare undescribed canvas before).
  - **Explicitly not done as part of step 2:** a dedicated mobile/tablet responsive re-check beyond what was already spot-checked per-phase during earlier sessions (Monty Hall's Phase 1 mobile-layout check was also flagged as not explicitly verified — see that phase's "Built as" note). If a fresh responsive pass is wanted, it hasn't happened yet.
  - **User-confirmed working** via manual testing: `/synthesis` renders correctly, focus rings now visibly appear when tabbing to doors/envelope-cards/sliders, and nothing regressed visually elsewhere.

**Steps 3–4 — confirmed working.** You ran the full checklist (10,000-run Monty Hall simulation, 10,000-chord Bertrand draw, plus a click-through of the other pages) and confirmed everything works with no jank or breakage. The `requestAnimationFrame`-batched incremental-reveal design from Phases 1 and 5 held up in practice, not just in code.

- **Step 5, deploy to Vercel — deliberately deferred, not started.** This is a "pause," not a blocker: whenever you're ready, revisit it. It needs your Vercel account/login either way, since going live publicly is exactly the kind of action that gets your explicit go-ahead first rather than being done proactively. Note the CLI path (`vercel deploy`, run from this directory once you're logged in) doesn't require git at all, which fits the "this project isn't using git" decision below — the GitHub-connected-deploy path would need a remote, but the CLI path doesn't.
- **Step 6 (optional "About this project" page)** — still untouched, still genuinely optional; no need to do it unless you want it for the writeup.

**Decision: this project is not using git.** You've confirmed git isn't needed for this project, so there's no commit/remote workflow here — `project.md` alone is the project's history and status record. (If deployment via Vercel is revisited later, note that Vercel's simplest path is GitHub-connected deploys requiring a repo+remote; the CLI-based `vercel deploy` path does **not** require git, so that path remains open without revisiting this decision.)

---

## 4. Asset Requirements

Most of this app can be built with **CSS/SVG/emoji and generated graphics — no external image downloads are strictly required**. Below is what to prepare if you want a more polished, custom look, organized by priority.

### 4.1 Recommended `/assets` folder structure
```
/public
  /assets
    /monty-hall
    /st-petersburg
    /two-envelopes
    /simpsons
    /bertrand
    /shared
```

### 4.2 Priority A — Nice-to-have polish (recommended, low effort)
| Paradox | Asset | Notes |
|---|---|---|
| Monty Hall | Door texture/illustration (closed door, front-facing, simple flat style) | 1 image, reused 3x with CSS filters for slight variation. Or skip and use a styled `<div>` with CSS gradients — genuinely looks fine. |
| Monty Hall | Goat icon, Car icon (SVG) | Use an icon set like **Lucide**, **Heroicons**, or **Phosphor Icons** (free, MIT-licensed, installable as a package — no downloading files needed) — search for "car" and use a simple goat emoji 🐐 or a farm-animal SVG from an icon pack if available. |
| St. Petersburg | Coin illustration (heads/tails, 2 states) or just use a flip animation on a styled circle with "H"/"T" text | A simple 2-frame flip is enough; no photographic assets needed. |
| Two-Envelopes | Envelope icon/illustration (closed + open states) | Lucide/Heroicons has a `Mail`/`Envelope` icon; style with your accent colors instead of finding photo-realistic art. |
| Simpsons | None needed | Purely chart-driven; no imagery required beyond icons already in your set. |
| Bertrand | None needed | Purely canvas-drawn geometry; no imagery required. |

**Practical recommendation:** Install one open-source icon library (`lucide-react` is easiest with React/Next.js: `npm install lucide-react`) and you get door/car/mail/coin-adjacent icons for free with zero asset-downloading — this alone covers ~90% of "make it feel less bare" for Monty Hall and Two-Envelopes.

### 4.3 Priority B — Optional visual upgrades (only if you have spare time)
- A subtle background texture/noise PNG (or CSS-only grain via SVG filter) for the dark background, to avoid a flat/dead look.
- A custom favicon and OG-image (social preview card) summarizing "Paradoxes of Probability" — nice for sharing the deployed link with your professor.
- A simple logo/wordmark for the top-left of the nav (can just be styled text — no asset needed).

### 4.4 What you do NOT need
- No stock photography.
- No 3D models.
- No custom fonts beyond what's freely available via `next/font` (Google Fonts — Inter, Sora, IBM Plex Mono are all free and load via a package, not a download).
- No audio/video assets — this is a visual/data app.

**Bottom line:** prepare (or install via npm) at most **one icon package** and, if you want extra polish, **one background texture image**. Everything else — doors, coins, envelopes, circles, charts — is achievable with CSS, SVG, and Canvas, which also keeps the app fast and keeps your bundle size small.
