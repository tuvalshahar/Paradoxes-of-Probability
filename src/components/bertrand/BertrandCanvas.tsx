"use client";

import { triangleVertices, type Chord } from "@/lib/simulations/bertrand";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export const CANVAS_SIZE = 440;
const PADDING = 20;
const CENTER = CANVAS_SIZE / 2;
const RADIUS = CANVAS_SIZE / 2 - PADDING;

export interface BertrandCanvasHandle {
  radius: number;
  drawChord: (chord: Chord) => void;
  reset: () => void;
}

interface Theme {
  fg: string;
  muted: string;
  longer: string;
  shorter: string;
}

function readTheme(): Theme {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string) => style.getPropertyValue(name).trim();
  return {
    fg: read("--color-fg"),
    muted: read("--color-muted"),
    longer: read("--color-expect-2"),
    shorter: read("--color-reality"),
  };
}

function drawBase(ctx: CanvasRenderingContext2D, theme: Theme) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.beginPath();
  ctx.arc(CENTER, CENTER, RADIUS, 0, 2 * Math.PI);
  ctx.strokeStyle = theme.muted;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const vertices = triangleVertices(RADIUS);
  ctx.beginPath();
  vertices.forEach(([vx, vy], i) => {
    const px = CENTER + vx;
    const py = CENTER + vy;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.strokeStyle = theme.fg;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.stroke();
  ctx.setLineDash([]);
}

export const BertrandCanvas = forwardRef<BertrandCanvasHandle>(function BertrandCanvas(_props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const themeRef = useRef<Theme | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctxRef.current = ctx;
    const theme = readTheme();
    themeRef.current = theme;
    drawBase(ctx, theme);
  }, []);

  useImperativeHandle(ref, () => ({
    radius: RADIUS,
    drawChord(chord: Chord) {
      const ctx = ctxRef.current;
      const theme = themeRef.current;
      if (!ctx || !theme) return;

      ctx.beginPath();
      ctx.moveTo(CENTER + chord.x1, CENTER + chord.y1);
      ctx.lineTo(CENTER + chord.x2, CENTER + chord.y2);
      ctx.strokeStyle = chord.longerThanSide ? theme.longer : theme.shorter;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
    reset() {
      const ctx = ctxRef.current;
      const theme = themeRef.current;
      if (!ctx || !theme) return;
      drawBase(ctx, theme);
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Circle with an inscribed triangle and the random chords drawn so far, colored by whether each is longer or shorter than the triangle's side"
      style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
      className="mx-auto rounded-2xl border border-border bg-background-elevated"
    />
  );
});
