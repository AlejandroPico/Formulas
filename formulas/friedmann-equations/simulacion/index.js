export function mountFriedmannEquationsPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { omegaM: 0.3, omegaL: 0.7, preset: "lambda" };

  root.classList.add("friedmann-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(360 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Omega materia <strong data-out="omegaM">0.30</strong><input data-key="omegaM" type="range" min="0.05" max="2.2" step="0.05" value="0.3"></label>
    <label>Omega Lambda <strong data-out="omegaL">0.70</strong><input data-key="omegaL" type="range" min="0" max="1.8" step="0.05" value="0.7"></label>
    <button type="button" data-preset="closed">Cerrado</button>
    <button type="button" data-preset="flat">Plano</button>
    <button type="button" data-preset="lambda">Acelerado</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    state.preset = "custom";
    updateLabels();
    draw();
  }

  function onClick(event) {
    const preset = event.target.dataset.preset;
    if (!preset) return;
    if (preset === "closed") { state.omegaM = 1.55; state.omegaL = 0; }
    if (preset === "flat") { state.omegaM = 1; state.omegaL = 0; }
    if (preset === "lambda") { state.omegaM = 0.3; state.omegaL = 0.7; }
    state.preset = preset;
    controls.querySelector('[data-key="omegaM"]').value = state.omegaM;
    controls.querySelector('[data-key="omegaL"]').value = state.omegaL;
    updateLabels();
    draw();
  }

  function updateLabels() {
    controls.querySelector('[data-out="omegaM"]').textContent = state.omegaM.toFixed(2);
    controls.querySelector('[data-out="omegaL"]').textContent = state.omegaL.toFixed(2);
    controls.querySelectorAll('[data-preset]').forEach(btn => btn.classList.toggle("active", btn.dataset.preset === state.preset));
  }

  function model(t) {
    const m = state.omegaM;
    const l = state.omegaL;
    const sum = m + l;
    let a = Math.pow(t, 0.62) * (1 + l * t * t * 1.15);
    if (m > 1.15 && l < 0.15) a *= Math.max(0, 1 - Math.pow(t, 2.3) * (m - 1) * 0.55);
    if (sum < 0.85) a *= 0.75 + 0.45 * t;
    return Math.max(0, Math.min(2.6, a));
  }

  function draw() {
    const ox = 62, oy = 300, w = 700, h = 245;
    const omegaK = 1 - state.omegaM - state.omegaL;
    ctx.clearRect(0, 0, 820, 360);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 820, 360);

    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, 42); ctx.lineTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px system-ui";
    ctx.fillText("a(t)", ox + 8, 56);
    ctx.fillText("tiempo", ox + w - 48, oy + 22);
    ctx.fillText("Big Bang", ox - 24, oy + 20);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 260; i++) {
      const t = i / 260;
      const a = model(t);
      const x = ox + t * w;
      const y = oy - a / 2.6 * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Friedmann: factor de escala y densidades cosmológicas", 24, 28);
    const fate = state.omegaL > 0.45 ? "expansión acelerada" : state.omegaM > 1.2 ? "posible recolidso" : "expansión desacelerada";
    const curvature = Math.abs(omegaK) < 0.04 ? "aprox. plano" : omegaK > 0 ? "curvatura abierta" : "curvatura cerrada";
    readout.innerHTML = `Omega_k = 1 - Omega_m - Omega_Lambda = ${omegaK.toFixed(2)} (${curvature})<br>Lectura cualitativa: ${fate}.`;
  }

  updateLabels();
  draw();
  return () => { controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountFriedmannEquationsPlugin;
