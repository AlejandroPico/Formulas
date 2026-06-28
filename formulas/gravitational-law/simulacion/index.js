import { rangeControl, pluginLoop, readControls, clearCanvas, line, dot, label, arrow, attachDrag, colorAlpha, clamp } from "../../shared/plugin-utils.js";

export function mountGravityPlugin({ canvas, controls, readout }) {
  controls.innerHTML = `
    ${rangeControl("Masa 1 m1", "m1", 10, 220, 1, 80, "kg")}
    ${rangeControl("Masa 2 m2", "m2", 10, 220, 1, 120, "kg")}
    ${rangeControl("Escala de fuerza", "scale", 0.4, 3, 0.1, 1.2, "x")}
  `;
  const bodies = { b1: { x: .30, y: .52 }, b2: { x: .72, y: .52 } };
  const detach = attachDrag(canvas, hit, move);
  const dispose = pluginLoop(canvas, controls, readout, draw);
  return () => { detach(); dispose(); };

  function hit(pos) {
    const values = readControls(controls);
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const r1 = 16 + Math.cbrt(values.m1) * 4;
    const r2 = 16 + Math.cbrt(values.m2) * 4;
    if (Math.hypot(pos.x - bodies.b1.x * w, pos.y - bodies.b1.y * h) <= r1 + 12) return "b1";
    if (Math.hypot(pos.x - bodies.b2.x * w, pos.y - bodies.b2.y * h) <= r2 + 12) return "b2";
    return null;
  }

  function move(which, pos) {
    bodies[which].x = clamp(pos.x / (canvas.clientWidth || 1), .08, .92);
    bodies[which].y = clamp(pos.y / (canvas.clientHeight || 1), .16, .86);
  }

  function draw(ctx, w, h, values, time, palette) {
    const m1 = values.m1;
    const m2 = values.m2;
    const p1 = { x: bodies.b1.x * w, y: bodies.b1.y * h, r: 12 + Math.cbrt(m1) * 4.2 };
    const p2 = { x: bodies.b2.x * w, y: bodies.b2.y * h, r: 12 + Math.cbrt(m2) * 4.2 };
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const r = Math.max(30, Math.hypot(dx, dy));
    const force = 0.5 * m1 * m2 / (r * r);
    const angle = Math.atan2(dy, dx);
    clearCanvas(ctx, w, h, palette);
    drawStarfield(ctx, w, h, palette);
    ctx.setLineDash([6, 7]);
    line(ctx, p1.x, p1.y, p2.x, p2.y, palette.line, 1.5);
    ctx.setLineDash([]);
    const arrowLen = clamp(force * 95 * values.scale, 18, 130);
    arrow(ctx, p1.x, p1.y, angle, arrowLen, palette.warning);
    arrow(ctx, p2.x, p2.y, angle + Math.PI, arrowLen, palette.warning);
    drawBody(ctx, p1, palette.accent, "m1", palette);
    drawBody(ctx, p2, palette.accent2, "m2", palette);
    label(ctx, `r = ${r.toFixed(0)} px`, (p1.x + p2.x) / 2 - 42, (p1.y + p2.y) / 2 - 10, palette);
    readout.innerHTML = `
      <strong>Gravitacion universal</strong>
      <span>F = G * (${m1.toFixed(0)} * ${m2.toFixed(0)}) / ${r.toFixed(0)}^2 = <b>${force.toFixed(4)}</b> unidades</span>
      <em>Arrastra las masas. Al duplicar la distancia, la fuerza cae aproximadamente a la cuarta parte.</em>
    `;
  }
}

function drawBody(ctx, body, color, text, palette) {
  ctx.save();
  ctx.shadowBlur = 18;
  ctx.shadowColor = color;
  dot(ctx, body.x, body.y, body.r, color);
  ctx.shadowBlur = 0;
  ctx.fillStyle = palette.text;
  ctx.font = "900 13px system-ui";
  ctx.fillText(text, body.x - 7, body.y - body.r - 8);
  ctx.restore();
}

function drawStarfield(ctx, w, h, palette) {
  ctx.save();
  ctx.fillStyle = colorAlpha(palette.text, 0.18);
  for (let i = 0; i < 80; i++) ctx.fillRect((i * 73) % w, (i * 47) % h, 1.4, 1.4);
  ctx.restore();
}
