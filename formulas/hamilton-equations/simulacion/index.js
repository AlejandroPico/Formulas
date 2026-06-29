export function mountHamiltonEquationsPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { q: 1.8, p: 0, m: 1, k: 1, paused: false, history: [] };
  let raf = 0;

  root.classList.add("hamilton-sim");
  canvas.width = Math.round(900 * dpr);
  canvas.height = Math.round(420 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Masa m <strong data-out="m">1.00</strong><input data-key="m" type="range" min="0.5" max="4" step="0.1" value="1"></label>
    <label>Rigidez k <strong data-out="k">1.00</strong><input data-key="k" type="range" min="0.2" max="4" step="0.1" value="1"></label>
    <button type="button" data-action="reset">Reiniciar</button>
    <button type="button" data-action="pause">Pausar</button>
  `;

  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
  }

  function onClick(event) {
    const action = event.target.dataset.action;
    if (action === "reset") { state.q = 1.8; state.p = 0; state.history = []; }
    if (action === "pause") { state.paused = !state.paused; event.target.textContent = state.paused ? "Reanudar" : "Pausar"; }
  }

  function updateLabels() {
    controls.querySelector('[data-out="m"]').textContent = state.m.toFixed(2);
    controls.querySelector('[data-out="k"]').textContent = state.k.toFixed(2);
  }

  function step() {
    if (state.paused) return;
    const dt = 0.045;
    state.p += -state.k * state.q * dt;
    state.q += (state.p / state.m) * dt;
    state.history.push({ q: state.q, p: state.p });
    if (state.history.length > 220) state.history.shift();
  }

  function drawSpring(x0, y, x1) {
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    const turns = 16;
    for (let i = 1; i <= turns; i++) {
      const x = x0 + (x1 - x0) * i / turns;
      const yy = y + (i % 2 ? -18 : 18);
      ctx.lineTo(x, i === turns ? y : yy);
    }
    ctx.stroke();
  }

  function draw() {
    const H = state.p * state.p / (2 * state.m) + 0.5 * state.k * state.q * state.q;
    ctx.clearRect(0, 0, 900, 420);
    ctx.fillStyle = "#07111f";
    ctx.fillRect(0, 0, 900, 420);
    drawPhysical(24, 38, 410, 300);
    drawPhase(470, 38, 400, 300);
    readout.innerHTML = `qdot=p/m = ${(state.p/state.m).toFixed(3)}; pdot=-kq = ${(-state.k*state.q).toFixed(3)}<br>Hamiltoniano H = ${H.toFixed(4)}. La órbita del plano de fases visualiza la energía conservada.`;
  }

  function drawPhysical(x, y, w, h) {
    ctx.strokeStyle = "rgba(148,163,184,.35)";
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "700 14px system-ui";
    ctx.fillText("Espacio de configuración", x + 12, y + 24);
    const cy = y + h / 2;
    const center = x + w / 2;
    const massX = center + state.q * 70;
    ctx.fillStyle = "#334155";
    ctx.fillRect(x + 26, cy - 40, 12, 80);
    drawSpring(x + 38, cy, massX - 24);
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(massX - 24, cy - 24, 48, 48);
    ctx.strokeStyle = "#bfdbfe";
    ctx.strokeRect(massX - 24, cy - 24, 48, 48);
  }

  function drawPhase(x, y, w, h) {
    ctx.strokeStyle = "rgba(148,163,184,.35)";
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "700 14px system-ui";
    ctx.fillText("Espacio de fases p vs q", x + 12, y + 24);
    const cx = x + w / 2, cy = y + h / 2, scale = 68;
    ctx.strokeStyle = "#334155";
    ctx.beginPath(); ctx.moveTo(x + 12, cy); ctx.lineTo(x + w - 12, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, y + 36); ctx.lineTo(cx, y + h - 12); ctx.stroke();
    ctx.strokeStyle = "rgba(16,185,129,.65)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    state.history.forEach((pt, i) => {
      const px = cx + pt.q * scale;
      const py = cy - pt.p * scale;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.fillStyle = "#10b981";
    ctx.beginPath(); ctx.arc(cx + state.q * scale, cy - state.p * scale, 7, 0, Math.PI * 2); ctx.fill();
  }

  function loop() { step(); draw(); raf = requestAnimationFrame(loop); }
  updateLabels();
  loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountHamiltonEquationsPlugin;
