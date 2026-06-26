import { rangeControl, pluginLoop, clearCanvas, line, label, triangle, colorAlpha, roundRect } from "./plugin-utils.js";

export function mountPythagoreanPlugin({ canvas, controls, readout }) {
  controls.innerHTML = `
    ${rangeControl("Cateto a", "a", 1, 10, 0.1, 6, "")}
    ${rangeControl("Cateto b", "b", 1, 10, 0.1, 6, "")}
    <button type="button" class="formula-plugin-button" data-345>Preset 3-4-5</button>
  `;
  controls.querySelector("[data-345]").addEventListener("click", () => {
    controls.querySelector("input[name='a']").value = 3;
    controls.querySelector("input[name='b']").value = 4;
  });
  return pluginLoop(canvas, controls, readout, (ctx, w, h, values, time, palette) => {
    const a = values.a;
    const b = values.b;
    const c = Math.hypot(a, b);
    clearCanvas(ctx, w, h, palette);
    const pad = Math.min(w, h) * .12;
    const scale = Math.min((w - pad * 2) / (a + b + 1), (h - pad * 2) / (a + b + 1));
    const O = { x: pad + b * scale, y: h - pad - b * scale };
    const A = { x: O.x + a * scale, y: O.y };
    const B = { x: O.x, y: O.y - b * scale };
    drawSquare(ctx, O, A, -1, colorAlpha(palette.accent, .20), palette.accent);
    drawSquare(ctx, O, B, -1, colorAlpha(palette.danger, .20), palette.danger);
    drawSquare(ctx, A, B, 1, colorAlpha(palette.green, .20), palette.green);
    triangle(ctx, A, B, O, palette.accent, palette.danger, palette.green, palette);
    drawRightAngle(ctx, O, palette);
    label(ctx, `a=${a.toFixed(1)}`, (O.x + A.x) / 2 - 20, O.y + 28, palette);
    label(ctx, `b=${b.toFixed(1)}`, O.x - 56, (O.y + B.y) / 2, palette);
    label(ctx, `c=${c.toFixed(2)}`, (A.x + B.x) / 2 + 14, (A.y + B.y) / 2 - 8, palette);
    readout.innerHTML = `<strong>Areas equivalentes</strong><span>${a.toFixed(1)}^2 + ${b.toFixed(1)}^2 = ${c.toFixed(2)}^2</span><span>${(a*a).toFixed(2)} + ${(b*b).toFixed(2)} = ${(c*c).toFixed(2)}</span><em>El cuadrado de la hipotenusa equivale a la suma de los cuadrados de los catetos.</em>`;
  });
}

function drawSquare(ctx, P, Q, side, fill, stroke) {
  const dx = Q.x - P.x, dy = Q.y - P.y, len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len * side, ny = dx / len * side;
  const A = { x: P.x + nx * len, y: P.y + ny * len };
  const B = { x: Q.x + nx * len, y: Q.y + ny * len };
  ctx.beginPath();
  ctx.moveTo(P.x, P.y); ctx.lineTo(Q.x, Q.y); ctx.lineTo(B.x, B.y); ctx.lineTo(A.x, A.y); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = stroke; ctx.lineWidth = 1.6; ctx.stroke();
}

function drawRightAngle(ctx, O, palette) {
  ctx.strokeStyle = palette.muted;
  ctx.lineWidth = 1.7;
  ctx.strokeRect(O.x, O.y - 22, 22, 22);
}
