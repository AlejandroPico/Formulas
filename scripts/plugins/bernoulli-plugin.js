import { rangeControl, pluginLoop, clearCanvas, line, dot, label, colorAlpha, clamp } from "./plugin-utils.js";

export function mountBernoulliPlugin({ canvas, controls, readout }) {
  controls.innerHTML = `
    ${rangeControl("Sección de salida A₂", "a2", 20, 100, 1, 52, "%")}
    ${rangeControl("Velocidad inicial v₁", "v1", 0.5, 8, 0.1, 2.0, "m/s")}
    ${rangeControl("Densidad ρ", "rho", 500, 2000, 50, 1000, "kg/m³")}
  `;
  const particles = Array.from({ length: 72 }, () => ({ x: Math.random(), lane: Math.random() * 2 - 1 }));
  return pluginLoop(canvas, controls, readout, (ctx, w, h, values, time, palette) => {
    const a2Pct = values.a2 / 100;
    const v1 = values.v1;
    const rho = values.rho;
    const p1 = 300000;
    const r1 = Math.min(h * 0.26, 78);
    const r2 = Math.max(18, r1 * Math.sqrt(a2Pct));
    const v2 = v1 / a2Pct;
    const p2 = p1 + 0.5 * rho * (v1 * v1 - v2 * v2);
    const cy = h * 0.46;
    clearCanvas(ctx, w, h, palette);
    drawPipe(ctx, w, cy, r1, r2, palette);
    drawParticles(ctx, w, cy, r1, r2, v1, time, particles, palette);
    drawManometer(ctx, 52, cy - r1 - 18, p1, 320000, palette.accent, "P₁");
    drawManometer(ctx, w - 92, cy - r2 - 18, Math.max(0, p2), 320000, palette.accent2, "P₂");
    label(ctx, `v₁ ${v1.toFixed(1)} m/s`, 32, cy + r1 + 28, palette);
    label(ctx, `v₂ ${v2.toFixed(1)} m/s`, w - 144, cy + r2 + 28, palette);
    readout.innerHTML = `
      <strong>Bernoulli / Venturi</strong>
      <span>P₁ ${(p1 / 1000).toFixed(0)} kPa · ½ρv₁² ${(0.5 * rho * v1 * v1 / 1000).toFixed(2)} kPa</span>
      <span>P₂ ${(Math.max(0, p2) / 1000).toFixed(1)} kPa · ½ρv₂² ${(0.5 * rho * v2 * v2 / 1000).toFixed(2)} kPa</span>
      <em>Al estrecharse el tubo, la velocidad sube y la presión estática baja.</em>
    `;
  });
}

function drawPipe(ctx, w, cy, r1, r2, palette) {
  const shape = new Path2D();
  shape.moveTo(0, cy - r1);
  shape.bezierCurveTo(w * 0.43, cy - r1, w * 0.57, cy - r2, w, cy - r2);
  shape.lineTo(w, cy + r2);
  shape.bezierCurveTo(w * 0.57, cy + r2, w * 0.43, cy + r1, 0, cy + r1);
  shape.closePath();
  ctx.fillStyle = colorAlpha(palette.accent, 0.14);
  ctx.fill(shape);
  ctx.strokeStyle = palette.muted;
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(0, cy - r1); ctx.bezierCurveTo(w * 0.43, cy - r1, w * 0.57, cy - r2, w, cy - r2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, cy + r1); ctx.bezierCurveTo(w * 0.43, cy + r1, w * 0.57, cy + r2, w, cy + r2); ctx.stroke();
}

function drawParticles(ctx, w, cy, r1, r2, v1, time, particles, palette) {
  ctx.fillStyle = palette.accent2;
  particles.forEach((p, i) => {
    const xNorm = (p.x + time * (0.06 + v1 * 0.018 + i * 0.0003)) % 1;
    const smooth = xNorm * xNorm * (3 - 2 * xNorm);
    const r = r1 + (r2 - r1) * smooth;
    dot(ctx, xNorm * w, cy + p.lane * r * 0.72, 2.7, palette.accent2);
  });
}

function drawManometer(ctx, x, y, pressure, maxPressure, color, title) {
  const h = 62;
  const fill = clamp(pressure / maxPressure, 0, 1) * h;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, 18, h);
  ctx.fillStyle = colorAlpha(color, 0.50);
  ctx.fillRect(x + 2, y + h - fill, 14, fill);
  ctx.fillStyle = color;
  ctx.font = "800 12px system-ui";
  ctx.fillText(title, x - 2, y - 6);
}
