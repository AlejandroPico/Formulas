import { rangeControl, pluginLoop, clearCanvas, line, label, arrow, clamp } from "../../shared/plugin-utils.js";

export function mountNewtonSecondLawPlugin({ canvas, controls, readout }) {
  controls.innerHTML = `
    ${rangeControl("Fuerza neta F", "force", -40, 40, 0.5, 20, "N")}
    ${rangeControl("Masa m", "mass", 1, 25, 0.5, 5, "kg")}
    ${rangeControl("Rozamiento visual", "friction", 0, 0.08, 0.005, 0.025, "")}
    <button type="button" class="formula-plugin-button" data-reset>Reiniciar bloque</button>
  `;
  const state = { x: 0.22, v: 0, lastTime: 0 };
  controls.querySelector("[data-reset]").addEventListener("click", () => {
    state.x = 0.22;
    state.v = 0;
    state.lastTime = 0;
  });

  return pluginLoop(canvas, controls, readout, (ctx, w, h, values, time, palette) => {
    const force = values.force;
    const mass = values.mass;
    const friction = values.friction;
    const acceleration = force / mass;
    const dt = state.lastTime ? clamp(time - state.lastTime, 0.008, 0.035) : 0.016;
    state.lastTime = time;
    state.v += acceleration * dt * 0.72;
    state.v *= Math.max(0, 1 - friction * 5);
    state.x += state.v * dt * 0.34;
    if (state.x > 1.08) state.x = -0.08;
    if (state.x < -0.12) state.x = 1.06;

    clearCanvas(ctx, w, h, palette);
    const groundY = h * 0.70;
    line(ctx, 0, groundY, w, groundY, palette.muted, 4);
    for (let x = 0; x < w; x += 44) line(ctx, x, groundY + 10, x + 18, groundY + 10, palette.line, 1);

    const size = clamp(34 + mass * 2.2, 38, 88);
    const boxX = state.x * w;
    const boxY = groundY - size;
    drawBlock(ctx, boxX, boxY, size, palette);
    const direction = force >= 0 ? 0 : Math.PI;
    const forceLen = clamp(Math.abs(force) * 2.1, 18, 110);
    const accelLen = clamp(Math.abs(acceleration) * 18, 10, 120);
    arrow(ctx, boxX + size / 2, boxY + size / 2, direction, forceLen, palette.danger);
    arrow(ctx, boxX + size / 2, boxY - 18, direction, accelLen, palette.green);
    label(ctx, `F=${force.toFixed(1)} N`, clamp(boxX + size / 2 - 46, 10, w - 120), boxY + size + 30, palette);
    label(ctx, `a=${acceleration.toFixed(2)} m/s2`, clamp(boxX + size / 2 - 58, 10, w - 130), Math.max(28, boxY - 26), palette);
    label(ctx, `m=${mass.toFixed(1)} kg`, 18, 32, palette);

    readout.innerHTML = `
      <strong>Dinamica en tiempo real</strong>
      <span>F = m*a; ${force.toFixed(1)} = ${mass.toFixed(1)} * <b>${acceleration.toFixed(2)}</b></span>
      <span>v visual = ${state.v.toFixed(2)}</span>
      <em>La misma fuerza acelera menos a masas grandes; cambiar el signo de F invierte la aceleracion.</em>
    `;
  });
}

function drawBlock(ctx, x, y, size, palette) {
  const grad = ctx.createLinearGradient(x, y, x + size, y + size);
  grad.addColorStop(0, palette.accent);
  grad.addColorStop(1, palette.accent2);
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = palette.text;
  ctx.globalAlpha = 0.88;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, size, size);
  ctx.globalAlpha = 1;
}
