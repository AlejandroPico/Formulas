import { rangeControl, pluginLoop, clearCanvas, line, dot, label } from "./plugin-utils.js";

export function mountEulerPlugin({ canvas, controls, readout }) {
  controls.innerHTML = [
    rangeControl("Angulo x", "theta", 0, 6.2832, 0.001, 0.785, "rad"),
    '<button type="button" class="formula-plugin-button" data-pi>Fijar x = pi</button>',
    '<button type="button" class="formula-plugin-button" data-play>Animar</button>'
  ].join("");
  const state = { playing: false };
  controls.querySelector("[data-pi]").addEventListener("click", () => {
    controls.querySelector("input[name='theta']").value = Math.PI.toFixed(3);
  });
  controls.querySelector("[data-play]").addEventListener("click", event => {
    state.playing = !state.playing;
    event.currentTarget.textContent = state.playing ? "Pausar" : "Animar";
  });

  return pluginLoop(canvas, controls, readout, (ctx, w, h, values, time, palette) => {
    const input = controls.querySelector("input[name='theta']");
    if (state.playing) input.value = (time % (Math.PI * 2)).toFixed(3);
    const theta = Number(input.value);
    const cosValue = Math.cos(theta);
    const sinValue = Math.sin(theta);
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * 0.34;
    clearCanvas(ctx, w, h, palette);
    drawAxes(ctx, cx, cy, r * 1.35, palette);
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    const px = cx + cosValue * r;
    const py = cy - sinValue * r;
    line(ctx, cx, cy, px, cy, palette.danger, 4);
    line(ctx, px, cy, px, py, palette.accent, 4);
    line(ctx, cx, cy, px, py, palette.accent2, 3);
    ctx.strokeStyle = palette.accent2;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 34, 0, -theta, true);
    ctx.stroke();
    dot(ctx, px, py, 7, palette.green);
    label(ctx, `x = ${theta.toFixed(3)} rad`, 18, 30, palette);
    const nearPi = Math.abs(theta - Math.PI) < 0.025;
    readout.innerHTML = nearPi
      ? `<strong>Identidad de Euler</strong><span>e^(i*pi) = -1</span><em>Por tanto: e^(i*pi) + 1 = 0.</em>`
      : `<strong>Formula de Euler</strong><span>e^(i*x) = cos(x) + i sin(x) = ${cosValue.toFixed(3)} + ${sinValue.toFixed(3)}i</span><em>El punto recorre el circulo unitario.</em>`;
  });
}

function drawAxes(ctx, cx, cy, len, palette) {
  line(ctx, cx - len, cy, cx + len, cy, palette.line, 1.5);
  line(ctx, cx, cy + len, cx, cy - len, palette.line, 1.5);
  ctx.fillStyle = palette.muted;
  ctx.font = "800 12px system-ui";
  ctx.fillText("Re", cx + len - 24, cy - 8);
  ctx.fillText("Im", cx + 8, cy - len + 18);
}
