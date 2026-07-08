export interface DataPoint {
  x: number;
  y: number;
  group: "A" | "B";
}

export interface SimpsonsCase {
  id: string;
  title: string;
  groupALabel: string;
  groupBLabel: string;
  xLabel: string;
  yLabel: string;
  xDomain: [number, number];
  yDomain: [number, number];
  groupA: DataPoint[];
  groupB: DataPoint[];
  combined: DataPoint[];
  lurkingVariable: string;
  whyItHappens: string;
}

// Deterministic pseudo-noise (no Math.random, so the dataset is stable across
// server/client renders) — just enough jitter to look like real measurements.
function jitter(i: number): number {
  return ((i * 13) % 9) - 4;
}

function buildGroup(
  group: "A" | "B",
  xStart: number,
  xEnd: number,
  intercept: number,
  slope: number,
  count: number,
): DataPoint[] {
  return Array.from({ length: count }, (_, i) => {
    const x = xStart + (i / (count - 1)) * (xEnd - xStart);
    const y = intercept + slope * x + jitter(i);
    return {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      group,
    };
  });
}

// Case 1: each class has a genuinely positive within-group slope (studying
// more helps, in both classes) — but the morning class studies less and
// scores higher at baseline, while the afternoon class studies more and
// scores lower at baseline. That baseline gap is large enough to reverse the
// combined trend: pooled together, more study hours appears to predict a
// LOWER score, purely because "which class you're in" is a lurking variable
// correlated with both axes.
const studyHours: SimpsonsCase = {
  id: "study-hours",
  title: "Study hours vs. exam score",
  groupALabel: "Morning class",
  groupBLabel: "Afternoon class",
  xLabel: "Study hours per week",
  yLabel: "Exam score",
  xDomain: [0, 11],
  yDomain: [30, 95],
  groupA: buildGroup("A", 1, 5, 70, 3, 15),
  groupB: buildGroup("B", 6, 10, 40, 3, 15),
  combined: [],
  lurkingVariable: "which class (morning or afternoon) a student is in",
  whyItHappens:
    "The morning class happens to study less and score higher; the afternoon class happens to study more and score lower — for reasons that have nothing to do with study hours (maybe alertness, maybe which students choose which time slot). Pool everyone together and that class-level gap swamps the real, positive, within-class effect of studying, flipping the sign of the line you'd fit.",
};
studyHours.combined = [...studyHours.groupA, ...studyHours.groupB];

// Case 2: within each age group, a higher dose produces a genuinely larger
// blood-pressure reduction — the drug works better at higher doses, full
// stop. But doctors prescribe younger patients smaller doses (who respond
// very well anyway) and older patients larger doses (who respond less well,
// e.g. due to slower metabolism) — so age is a lurking variable correlated
// with both dose and response. Combined, higher dose appears to predict a
// SMALLER reduction — a reversal with real clinical stakes if mistaken for
// the true dose-response relationship.
const drugDosage: SimpsonsCase = {
  id: "drug-dosage",
  title: "Drug dosage vs. blood pressure reduction",
  groupALabel: "Younger patients",
  groupBLabel: "Older patients",
  xLabel: "Dosage (mg)",
  yLabel: "BP reduction (mmHg)",
  xDomain: [0, 70],
  yDomain: [15, 65],
  groupA: buildGroup("A", 10, 30, 40, 0.5, 15),
  groupB: buildGroup("B", 40, 60, 5, 0.5, 15),
  combined: [],
  lurkingVariable: "the patient's age group",
  whyItHappens:
    "Younger patients happen to be prescribed smaller doses and respond very well anyway; older patients happen to be prescribed larger doses (often because they need more to have any effect) and respond less well overall — for reasons tied to age, not dosage. Pool every patient together and that age-driven gap swamps the real, positive, within-group effect of the drug, making higher doses look less effective than they actually are.",
};
drugDosage.combined = [...drugDosage.groupA, ...drugDosage.groupB];

export const SIMPSONS_CASES: SimpsonsCase[] = [studyHours, drugDosage];
