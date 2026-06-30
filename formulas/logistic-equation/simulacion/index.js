export function mountLogisticEquationPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { r: 0.3, K: 120, N0: 5 };

  root.classList.add("logistic-equation-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Tasa de crecimiento r <strong data-out="r">0.30</strong><input data-key="r" type="range" min="0.1" max="0.9" step="0.05" value="0.3"></label>
    <label>Capacidad de carga K <strong data-out="K">120</strong><input data-key="K" type="range" min="50" max="160" step="5" value="120"></label>
    <label>Población inicial N₀ <strong data-out="N0">5</strong><input data-key="N0" type="range" min="2" max="50" step="1" value="5"></label>
  `;
  controls.addEventListener("input", onInput);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
    draw();
  }

  function updateLabels() {
    controls.querySelector('[data-out="r"]').textContent = state.r.toFixed(2);
    controls.querySelector('[data-out="K"]').textContent = state.K.toFixed(0);
    controls.querySelector('[data-out="N0"]').textContent = state.N0.toFixed(0);
  }

  function draw() {
    const ox = 70, oy = 285, w = 690, h = 220;
    const yScale = h / 170;
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy - h); ctx.lineTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();

    ctx.strokeStyle = "#ef4444"; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(ox, oy - state.K * yScale); ctx.lineTo(ox + w, oy - state.K * yScale); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#fca5a5"; ctx.font = "800 12px system-ui"; ctx.fillText(`K=${state.K}`, ox + w - 55, oy - state.K * yScale - 8);

    let N = state.N0;
    const dt = 0.22;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      if (px > 0) N += state.r * N * (1 - N / state.K) * dt;
      const y = oy - N * yScale;
      if (px === 0) ctx.moveTo(ox + px, y); else ctx.lineTo(ox + px, y);
    }
    ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 3; ctx.stroke();

    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Ecuación logística: crecimiento con saturación", 24, 30);
    const d0 = state.r * state.N0 * (1 - state.N0 / state.K);
    readout.innerHTML = `dN/dt inicial ≈ ${d0.toFixed(2)} · r=${state.r.toFixed(2)} · K=${state.K.toFixed(0)}<br>Al acercarse N a K, el factor 1-N/K tiende a cero.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountLogisticEquationPlugin;
