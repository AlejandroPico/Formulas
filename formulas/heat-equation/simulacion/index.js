export function mountHeatEquationPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const n = 170;
  const state = { alpha: 0.16, paused: false, u: Array(n).fill(15), next: Array(n).fill(15), drawing: false };
  let raf = 0;

  root.classList.add("heat-equation-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(350 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.style.touchAction = "none";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Difusividad alpha <strong data-out="alpha">0.16</strong><input data-key="alpha" type="range" min="0.02" max="0.42" step="0.01" value="0.16"></label>
    <button type="button" data-action="pause">Pausar</button>
    <button type="button" data-action="reset">Reiniciar</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);
  canvas.addEventListener("pointerdown", event => { state.drawing = true; canvas.setPointerCapture?.(event.pointerId); inject(event); });
  canvas.addEventListener("pointermove", event => { if (state.drawing) inject(event); });
  canvas.addEventListener("pointerup", () => { state.drawing = false; });
  canvas.addEventListener("pointercancel", () => { state.drawing = false; });

  seed();

  function seed() {
    state.u.fill(15);
    const c = Math.floor(n / 2);
    for (let k = -4; k <= 4; k++) state.u[c + k] = 115 - Math.abs(k) * 9;
  }

  function onInput(event) {
    if (event.target.dataset.key !== "alpha") return;
    state.alpha = Number(event.target.value);
    updateLabels();
  }

  function onClick(event) {
    const action = event.target.dataset.action;
    if (action === "pause") {
      state.paused = !state.paused;
      event.target.textContent = state.paused ? "Reanudar" : "Pausar";
    }
    if (action === "reset") seed();
  }

  function updateLabels() {
    controls.querySelector('[data-out="alpha"]').textContent = state.alpha.toFixed(2);
  }

  function inject(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (820 / rect.width);
    const c = Math.max(0, Math.min(n - 1, Math.floor((x / 820) * n)));
    for (let k = -7; k <= 7; k++) {
      const i = c + k;
      if (i >= 0 && i < n) state.u[i] = Math.min(130, state.u[i] + (8 - Math.abs(k)) * 7);
    }
  }

  function step() {
    const a = Math.min(0.45, state.alpha);
    for (let i = 1; i < n - 1; i++) state.next[i] = state.u[i] + a * (state.u[i + 1] - 2 * state.u[i] + state.u[i - 1]);
    state.next[0] = state.next[1];
    state.next[n - 1] = state.next[n - 2];
    [state.u, state.next] = [state.next, state.u];
  }

  function color(temp) {
    const t = Math.max(0, Math.min(1, temp / 120));
    const r = Math.round(35 + 220 * t);
    const g = Math.round(96 + 70 * (1 - Math.abs(t - 0.45) * 1.7));
    const b = Math.round(210 - 180 * t);
    return `rgb(${r},${g},${b})`;
  }

  function draw() {
    if (!state.paused) step();
    const maxT = Math.max(...state.u);
    ctx.clearRect(0, 0, 820, 350);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 820, 350);
    ctx.strokeStyle = "#e2e8f0";
    for (let y = 40; y <= 220; y += 45) { ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(790, y); ctx.stroke(); }

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    state.u.forEach((v, i) => {
      const x = 30 + i * (760 / (n - 1));
      const y = 230 - v * 1.45;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    const barY = 265;
    const w = 760 / n;
    state.u.forEach((v, i) => { ctx.fillStyle = color(v); ctx.fillRect(30 + i * w, barY, w + 0.6, 30); });
    ctx.strokeStyle = "#cbd5e1"; ctx.strokeRect(30, barY, 760, 30);
    ctx.fillStyle = "#0f172a"; ctx.font = "800 14px system-ui";
    ctx.fillText("Ecuacion del calor: difusion de un perfil termico", 24, 28);
    readout.innerHTML = `Temperatura maxima ≈ ${maxT.toFixed(1)}; alpha = ${state.alpha.toFixed(2)}<br>Haz clic o arrastra sobre la barra para inyectar calor local.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountHeatEquationPlugin;
