export type BertrandMethod = "endpoints" | "radius" | "midpoint";

export interface Chord {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  longerThanSide: boolean;
}

export const METHOD_LABEL: Record<BertrandMethod, string> = {
  endpoints: "Random endpoints",
  radius: "Random radius",
  midpoint: "Random midpoint",
};

export const THEORETICAL_PROBABILITY: Record<BertrandMethod, number> = {
  endpoints: 1 / 3,
  radius: 1 / 2,
  midpoint: 1 / 4,
};

export const METHOD_DESCRIPTION: Record<BertrandMethod, string> = {
  endpoints: "Pick two independent uniform random points on the circle's circumference and connect them.",
  radius: "Pick a random radius (a uniform random direction), then a uniform random point along that radius — the chord is perpendicular to it at that point.",
  midpoint: "Pick a uniform random point anywhere inside the disk and treat it as the chord's midpoint — there's exactly one chord with that midpoint.",
};

export function triangleSideLength(radius: number): number {
  return radius * Math.sqrt(3);
}

export function triangleVertices(radius: number): [number, number][] {
  const angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
  return angles.map((a) => [radius * Math.cos(a), radius * Math.sin(a)]);
}

function makeChord(x1: number, y1: number, x2: number, y2: number, radius: number): Chord {
  const length = Math.hypot(x2 - x1, y2 - y1);
  return { x1, y1, x2, y2, length, longerThanSide: length > triangleSideLength(radius) };
}

function randomEndpointsChord(radius: number): Chord {
  const t1 = Math.random() * 2 * Math.PI;
  const t2 = Math.random() * 2 * Math.PI;
  return makeChord(
    radius * Math.cos(t1),
    radius * Math.sin(t1),
    radius * Math.cos(t2),
    radius * Math.sin(t2),
    radius,
  );
}

function randomRadiusChord(radius: number): Chord {
  const phi = Math.random() * 2 * Math.PI;
  const d = Math.random() * radius;
  const mx = d * Math.cos(phi);
  const my = d * Math.sin(phi);
  const half = Math.sqrt(Math.max(radius * radius - d * d, 0));
  const perp = phi + Math.PI / 2;
  return makeChord(
    mx + half * Math.cos(perp),
    my + half * Math.sin(perp),
    mx - half * Math.cos(perp),
    my - half * Math.sin(perp),
    radius,
  );
}

function randomMidpointChord(radius: number): Chord {
  const theta = Math.random() * 2 * Math.PI;
  const rho = radius * Math.sqrt(Math.random());
  const mx = rho * Math.cos(theta);
  const my = rho * Math.sin(theta);
  const half = Math.sqrt(Math.max(radius * radius - rho * rho, 0));
  const perp = theta + Math.PI / 2;
  return makeChord(
    mx + half * Math.cos(perp),
    my + half * Math.sin(perp),
    mx - half * Math.cos(perp),
    my - half * Math.sin(perp),
    radius,
  );
}

export function generateChord(method: BertrandMethod, radius: number): Chord {
  switch (method) {
    case "endpoints":
      return randomEndpointsChord(radius);
    case "radius":
      return randomRadiusChord(radius);
    case "midpoint":
      return randomMidpointChord(radius);
  }
}

export function generateBatch(method: BertrandMethod, radius: number, count: number): Chord[] {
  return Array.from({ length: count }, () => generateChord(method, radius));
}
