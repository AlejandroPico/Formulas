import { rangeControl, pluginLoop, clearCanvas, line, dot, label } from "../../shared/plugin-utils.js";

export function mountQuadraticPlugin({ canvas, controls, readout }) {
  controls.innerHTML = `
    ${rangeControl("Coeficiente a", "a", -4, 4, 0.1, 1, "")}
    ${rangeControl("Coeficiente b", "b", -7, 7, 0.1, 0, "")}
    ${rangeControl("Coeficiente c", "c", -7, 7, 0.1, -2, "")}
  `;
  return pluginLoop(canvas, controls, readout, (ctx, w, h, values, time, palette) => {
    const a = Math.abs(values.a) < 0.08 ? (values.a < 0 ? -0.08 : 0.08) : values.a;
    const b = values.b;
    const c = values.c;
    const disc = b * b - 4 * a * c;
    const origin = { x: w / 2, y: h * 0.64 };
    const sx = Math.max(28, w / 18);
    const sy = Math.max(22, h / 15);
    clearCanvas(ctx, w, h, palette);
    drawGrid(ctx, w, h, origin, sx, sy, palette);
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= w; px += 2) {
      const x = (px - origin.x) / sx;
      const y = a * x * x + b * x + c;
      const py = origin.y - y * sy;
      if (py < -h || py > h * 2) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
    }
    ctx.stroke();
    const xv = -b / (2 * a);
    const yv = a * xv * xv + b * xv + c;
    ctx.setLineDash([5, 5]);
    line(ctx, origin.x + xv * sx, 20, origin.x + xv * sx, h - 18, palette.muted, 1.2);
    ctx.setLineDash([]);
    dot(ctx, origin.x + xv * sx, origin.y - yv * sy, 5, palette.accent2);
    let roots;
    if (disc > 0) {
      const x1 = (-b + Math.sqrt(disc)) / (2 * a);
      const x2 = (-b - Math.sqrt(disc)) / (2 * a);
      dot(ctx, origin.x + x1 * sx, origin.y, 6, palette.danger);
      dot(ctx, origin.x + x2 * sx, origin.y, 6, palette.danger);
      roots = `x1=${x1.toFixed(2)} · x2=${x2.toFixed(2)} · dos cortes reales`;
    } else if (Math.abs(disc) < 0.01) {
      const x0 = -b / (2 * a);
      dot(ctx, origin.x + x0 * sx, origin.y, 7, palette.warning);
      roots = `x=${x0.toFixed(2)} · raiz doble`;
    } else {
      roots = `raices complejas · no corta el eje X`;
    }
    label(ctx, `Delta = ${disc.toFixed(2)}`, 18, 30, palette);
    readout.innerHTML = `<strong>Parabola y formula cuadratica</strong><span>${a.toFixed(2)}x^2 + (${b.toFixed(2)})x + (${c.toFixed(2)}) = 0</span><span>${roots}</span><em>El discriminante decide si la parabola corta, toca o no corta el eje X.</em>`;
  });
}

function drawGrid(ctx, w, h, origin, sx, sy, palette) {
  ctx.save();
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  for (let x = origin.x % sx; x < w; x += sx) line(ctx, x, 0, x, h, palette.line, 1);
  for (let y = origin.y % sy; y < h; y += sy) line(ctx, 0, y, w, y, palette.line, 1);
  line(ctx, 0, origin.y, w, origin.y, palette.muted, 1.6);
  line(ctx, origin.x, 0, origin.x, h, palette.muted, 1.6);
  ctx.restore();
}
