export function mountKleinGordonEquationPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { mass: 1.0, k: 0.09, speed: 1.0, time: 0, paused: false };
  let raf = 0;

  root.classList.add("klein-gordon-equation-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(320 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Masa m <strong data-out="mass">1.0</strong><input data-key="mass" type="range" min="0" max="4" step="0.1" value="1.0"></label>
    <label>Número de onda k <strong data-out="k">0.09</strong><input data-key="k" type="range" min="0.03" max="0.18" step="0.01" value="0.09"></label>
    <label>Velocidad visual <strong data-out="speed">1.0</strong><input data-key="speed" type="range" min="0" max="2.5" step="0.1" value="1.0"></label>
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
    if (event.target.dataset.action !== "pause") return;
    state.paused = !state.paused;
    event.target.textContent = state.paused ? "Reanudar" : "Pausar";
  }

  function updateLabels() {
    controls.querySelector('[data-out="mass"]').textContent = state.mass.toFixed(1);
    controls.querySelector('[data-out="k"]').textContent = state.k.toFixed(2);
    controls.querySelector('[data-out="speed"]').textContent = state.speed.toFixed(1);
  }

  function draw() {
    if (!state.paused) state.time += 0.08 * state.speed;
    const cy = 160;
    const omega = Math.sqrt(state.k * state.k + state.mass * state.mass * 0.018);
    const phaseVelocity = omega / Math.max(state.k, 0.001);
    const groupVelocity = state.k / Math.max(omega, 0.001);
    ctx.clearRect(0, 0, 820, 320);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 320);
    ctx.strokeStyle = "rgba(148,163,184,.25)";
    for (let y = 70; y <= 250; y += 45) { ctx.beginPath(); ctx.moveTo(35, y); ctx.lineTo(785, y); ctx.stroke(); }
    ctx.beginPath();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    for (let x = 35; x <= 785; x += 2) {
      const envelope = 0.82 + 0.18 * Math.cos((x - 410) * 0.018);
      const y = cy - Math.sin(state.k * x - omega * state.time * 18) * 58 * envelope;
      if (x === 35) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Klein-Gordon: campo escalar relativista con término de masa", 24, 30);
    const massText = state.mass === 0 ? "campo no masivo ideal" : "campo masivo: dispersión dependiente de m";
    readout.innerHTML = `ω visual = ${omega.toFixed(3)} · v_fase ≈ ${phaseVelocity.toFixed(2)} · v_grupo ≈ ${groupVelocity.toFixed(2)}<br>${massText}.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountKleinGordonEquationPlugin;
