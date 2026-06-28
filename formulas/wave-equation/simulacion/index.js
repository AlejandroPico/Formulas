import { rangeControl, pluginLoop, clearCanvas, line, label, clamp } from "../../shared/plugin-utils.js";

export function mountWaveEquationPlugin({ canvas, controls, readout }) {
  controls.innerHTML = `
    ${rangeControl("Velocidad de onda c", "speed", 0.4, 3.8, 0.1, 1.7, "")}
    ${rangeControl("Amortiguacion", "damping", 0, 0.018, 0.001, 0.004, "")}
    ${rangeControl("Tension visual", "tension", 0.35, 1.4, 0.05, 0.85, "")}
    <button type="button" class="formula-plugin-button" data-pulse>Pulso gaussiano</button>
    <button type="button" class="formula-plugin-button" data-mode>Modo seno</button>
  `;
  const state = { u: [], prev: [], next: [], width: 0 };
  const ensure = width => ensureBuffers(state, Math.max(80, Math.floor(width)));
  controls.querySelector("[data-pulse]").addEventListener("click", () => injectPulse(state));
  controls.querySelector("[data-mode]").addEventListener("click", () => injectMode(state));

  return pluginLoop(canvas, controls, readout, (ctx, w, h, values, time, palette) => {
    ensure(w);
    stepWave(state, values.speed, values.damping, values.tension);
    drawWave(ctx, w, h, state, palette);
    const energy = state.u.reduce((sum, value, i) => {
      const velocity = value - (state.prev[i] || 0);
      return sum + value * value + velocity * velocity;
    }, 0) / state.u.length;
    readout.innerHTML = `
      <strong>Ecuacion de onda 1D</strong>
      <span>u_tt = c^2 u_xx; c=<b>${values.speed.toFixed(1)}</b></span>
      <span>energia visual=${energy.toFixed(2)}</span>
      <em>El pulso se propaga, refleja en los extremos y se amortigua suavemente para mantener la simulacion estable.</em>
    `;
  });
}

function ensureBuffers(state, width) {
  if (state.width === width && state.u.length) return;
  state.width = width;
  state.u = new Array(width).fill(0);
  state.prev = new Array(width).fill(0);
  state.next = new Array(width).fill(0);
  injectPulse(state);
}

function injectPulse(state) {
  const mid = Math.floor(state.width / 2);
  for (let i = 0; i < state.width; i += 1) {
    const d = i - mid;
    const value = Math.exp(-(d * d) / 420) * 54;
    state.u[i] = value;
    state.prev[i] = value;
  }
}

function injectMode(state) {
  for (let i = 0; i < state.width; i += 1) {
    const x = i / Math.max(1, state.width - 1);
    const value = Math.sin(Math.PI * x) * 46;
    state.u[i] = value;
    state.prev[i] = value * 0.98;
  }
}

function stepWave(state, c, damping, tension) {
  const r = clamp(c * 0.18, 0.05, 0.72);
  const r2 = r * r * tension;
  state.next[0] = 0;
  state.next[state.width - 1] = 0;
  for (let i = 1; i < state.width - 1; i += 1) {
    state.next[i] = 2 * state.u[i] - state.prev[i] + r2 * (state.u[i + 1] - 2 * state.u[i] + state.u[i - 1]);
    state.next[i] *= 1 - damping;
  }
  const oldPrev = state.prev;
  state.prev = state.u;
  state.u = state.next;
  state.next = oldPrev;
}

function drawWave(ctx, w, h, state, palette) {
  clearCanvas(ctx, w, h, palette);
  const cy = h / 2;
  line(ctx, 0, cy, w, cy, palette.line, 1.5);
  ctx.save();
  ctx.strokeStyle = palette.accent2;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < state.width; i += 1) {
    const x = (i / (state.width - 1)) * w;
    const y = cy - state.u[i];
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
  label(ctx, "extremos fijos", 18, 30, palette);
  label(ctx, "propagacion y reflexion", Math.max(18, w - 178), 30, palette);
}
