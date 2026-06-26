import { rangeControl, pluginLoop, clearCanvas, line, dot, label, clamp } from "./plugin-utils.js";

export function mountTaylorPlugin({ canvas, controls, readout }) {
  controls.innerHTML = `
    ${rangeControl("Grado impar", "degree", 1, 11, 2, 5, "")}
    ${rangeControl("Punto x", "x0", -3.14, 3.14, 0.01, 1.20, "rad")}
    ${rangeControl("Zoom horizontal", "zoom", 35, 85, 1, 52, "")}
  `;
  return pluginLoop(canvas, controls, readout, (ctx, w, h, values, time, palette) => {
    const degree = Math.round(values.degree) | 1;
    const x0 = values.x0;
    const sx = values.zoom;
    const sy = Math.min(h * 0.28, 92);
    const origin = { x: w / 2, y: h / 2 };
    clearCanvas(ctx, w, h, palette);
    drawAxes(ctx, w, h, origin, sx, sy, palette);
    drawCurve(ctx, w, h, origin, sx, sy, Math.sin, palette.accent, 2.4, false);
    drawCurve(ctx, w, h, origin, sx, sy, x => taylorSin(x, degree), palette.danger, 3, true);

    const real = Math.sin(x0);
    const approx = taylorSin(x0, degree);
    const px = origin.x + x0 * sx;
    dot(ctx, px, origin.y - real * sy, 5.5, palette.accent);
    dot(ctx, px, origin.y - approx * sy, 6.5, palette.danger);
    line(ctx, px, 20, px, h - 20, palette.line, 1.2);
    label(ctx, "sin(x)", 18, 30, palette);
    label(ctx, `Taylor grado ${degree}`, 18, 60, palette);

    const error = Math.abs(real - approx);
    readout.innerHTML = `
      <strong>Serie de Taylor de sin(x)</strong>
      <span>P${degree}(x) = ${buildPolynomialText(degree)}</span>
      <span>x=${x0.toFixed(2)} · real=${real.toFixed(4)} · aprox=${approx.toFixed(4)} · error=<b>${error.toExponential(2)}</b></span>
      <em>Cerca del centro bastan pocos términos; más grado amplía la zona de aproximación útil.</em>
    `;
  });
}

function drawAxes(ctx, w, h, origin, sx, sy, palette) {
  line(ctx, 0, origin.y, w, origin.y, palette.muted, 1.5);
  line(ctx, origin.x, 0, origin.x, h, palette.muted, 1.5);
  ctx.fillStyle = palette.muted;
  ctx.font = "760 11px system-ui";
  [-3.1416, -1.5708, 1.5708, 3.1416].forEach((value, index) => {
    const x = origin.x + value * sx;
    line(ctx, x, origin.y - 5, x, origin.y + 5, palette.muted, 1);
    ctx.fillText(["-pi", "-pi/2", "pi/2", "pi"][index], x - 14, origin.y + 20);
  });
  [-1, 1].forEach(value => {
    const y = origin.y - value * sy;
    line(ctx, origin.x - 5, y, origin.x + 5, y, palette.muted, 1);
    ctx.fillText(String(value), origin.x + 8, y + 4);
  });
}

function drawCurve(ctx, w, h, origin, sx, sy, fn, color, width, dashed) {
  ctx.save();
  if (dashed) ctx.setLineDash([7, 5]);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  let started = false;
  for (let px = 0; px <= w; px += 2) {
    const x = (px - origin.x) / sx;
    const y = fn(x);
    const py = origin.y - y * sy;
    if (py < -h || py > h * 2) { started = false; continue; }
    if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

function taylorSin(x, degree) {
  let sum = 0;
  for (let n = 0; n <= (degree - 1) / 2; n += 1) {
    const p = 2 * n + 1;
    const term = Math.pow(x, p) / factorial(p);
    sum += n % 2 ? -term : term;
  }
  return clamp(sum, -6, 6);
}

function factorial(n) {
  let value = 1;
  for (let i = 2; i <= n; i += 1) value *= i;
  return value;
}

function buildPolynomialText(degree) {
  const parts = ["x"];
  if (degree >= 3) parts.push("- x^3/3!");
  if (degree >= 5) parts.push("+ x^5/5!");
  if (degree >= 7) parts.push("- x^7/7!");
  if (degree >= 9) parts.push("+ x^9/9!");
  if (degree >= 11) parts.push("- x^11/11!");
  return parts.join(" ");
}
