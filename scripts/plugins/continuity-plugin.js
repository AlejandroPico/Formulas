import { rangeControl, pluginLoop, clearCanvas, line, dot, label, colorAlpha, clamp } from "./plugin-utils.js";

export function mountContinuityPlugin({ canvas, controls, readout }) {
  controls.innerHTML = `
    ${rangeControl("Área de entrada A₁", "a1", 60, 160, 1, 120, "cm²")}
    ${rangeControl("Velocidad de entrada v₁", "v1", 0.5, 5, 0.1, 1.6, "m/s")}
    ${rangeControl("Área de salida A₂", "a2", 30, 160, 1, 72, "cm²")}
  `;
  const particles = Array.from({ length: 86 }, () => ({ x: Math.random(), lane: Math.random() * 2 - 1, phase: Math.random() }));

  return pluginLoop(canvas, controls, readout, (ctx, w, h, values, time, palette) => {
    const A1 = values.a1;
    const A2 = values.a2;
    const v1 = values.v1;
    const q = A1 * v1;
    const v2 = q / A2;
    const cy = h * 0.52;
    const r1 = clamp(h * 0.18 * Math.sqrt(A1 / 100), 28, h * 0.30);
    const r2 = clamp(h * 0.18 * Math.sqrt(A2 / 100), 20, h * 0.30);

    clearCanvas(ctx, w, h, palette);
    drawChannel(ctx, w, cy, r1, r2, palette);
    drawFlowParticles(ctx, w, cy, r1, r2, v1, v2, time, particles, palette);
    drawSection(ctx, w * 0.18, cy, r1, palette.warning, "A₁");
    drawSection(ctx, w * 0.82, cy, r2, palette.danger, "A₂");
    drawVelocityArrow(ctx, w * 0.22, cy + r1 + 24, v1, palette.accent, "v₁", palette);
    drawVelocityArrow(ctx, w * 0.72, cy + r2 + 24, v2, palette.accent2, "v₂", palette);
    label(ctx, `Q = A·v = ${q.toFixed(1)}`, Math.max(18, w / 2 - 64), 32, palette);

    readout.innerHTML = `
      <strong>Conservación de caudal</strong>
      <span>A₁v₁ = ${A1.toFixed(0)}·${v1.toFixed(1)} = <b>${q.toFixed(1)}</b></span>
      <span>A₂v₂ = ${A2.toFixed(0)}·${v2.toFixed(2)} = <b>${q.toFixed(1)}</b></span>
      <em>Si el área se estrecha, la velocidad aumenta para conservar el flujo de masa.</em>
    `;
  });
}

function drawChannel(ctx, w, cy, r1, r2, palette) {
  const shape = new Path2D();
  shape.moveTo(0, cy - r1);
  shape.lineTo(w * 0.32, cy - r1);
  shape.bezierCurveTo(w * 0.45, cy - r1, w * 0.55, cy - r2, w * 0.68, cy - r2);
  shape.lineTo(w, cy - r2);
  shape.lineTo(w, cy + r2);
  shape.lineTo(w * 0.68, cy + r2);
  shape.bezierCurveTo(w * 0.55, cy + r2, w * 0.45, cy + r1, w * 0.32, cy + r1);
  shape.lineTo(0, cy + r1);
  shape.closePath();
  ctx.fillStyle = colorAlpha(palette.accent, 0.14);
  ctx.fill(shape);
  ctx.strokeStyle = palette.muted;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, cy - r1);
  ctx.lineTo(w * 0.32, cy - r1);
  ctx.bezierCurveTo(w * 0.45, cy - r1, w * 0.55, cy - r2, w * 0.68, cy - r2);
  ctx.lineTo(w, cy - r2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, cy + r1);
  ctx.lineTo(w * 0.32, cy + r1);
  ctx.bezierCurveTo(w * 0.45, cy + r1, w * 0.55, cy + r2, w * 0.68, cy + r2);
  ctx.lineTo(w, cy + r2);
  ctx.stroke();
}

function drawFlowParticles(ctx, w, cy, r1, r2, v1, v2, time, particles, palette) {
  particles.forEach((p, i) => {
    const baseSpeed = 0.045 + v1 * 0.018;
    const xNorm = (p.x + time * baseSpeed * (0.75 + p.phase)) % 1;
    const transition = smoothstep(0.32, 0.68, xNorm);
    const radius = r1 + (r2 - r1) * transition;
    const localV = v1 + (v2 - v1) * transition;
    const x = xNorm * w;
    const y = cy + p.lane * radius * 0.72;
    dot(ctx, x, y, clamp(2.3 + localV * 0.26, 2.4, 4.2), palette.accent2);
    if (i % 9 === 0) line(ctx, x - 18, y, x - 4, y, colorAlpha(palette.accent2, 0.45), 1.4);
  });
}

function drawSection(ctx, x, cy, r, color, text) {
  ctx.save();
  ctx.setLineDash([5, 5]);
  line(ctx, x, cy - r, x, cy + r, color, 2.2);
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.font = "900 13px system-ui";
  ctx.fillText(text, x - 10, cy - r - 10);
  ctx.restore();
}

function drawVelocityArrow(ctx, x, y, speed, color, text, palette) {
  const len = clamp(speed * 24, 22, 118);
  line(ctx, x, y, x + len, y, color, 3);
  ctx.beginPath();
  ctx.moveTo(x + len, y);
  ctx.lineTo(x + len - 9, y - 5);
  ctx.lineTo(x + len - 9, y + 5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  label(ctx, `${text}=${speed.toFixed(2)}`, x, y + 30, palette);
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
