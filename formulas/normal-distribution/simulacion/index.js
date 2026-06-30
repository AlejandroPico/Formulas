export function mountNormalDistributionPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { mu: 0, sigma: 35, band: 1 };

  root.classList.add("normal-distribution-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Media μ <strong data-out="mu">0</strong><input data-key="mu" type="range" min="-120" max="120" step="1" value="0"></label>
    <label>Desviación σ <strong data-out="sigma">35</strong><input data-key="sigma" type="range" min="15" max="80" step="1" value="35"></label>
    <label>Banda sombreada ±<strong data-out="band">1</strong>σ<input data-key="band" type="range" min="1" max="3" step="1" value="1"></label>
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
    controls.querySelector('[data-out="mu"]').textContent = state.mu.toFixed(0);
    controls.querySelector('[data-out="sigma"]').textContent = state.sigma.toFixed(0);
    controls.querySelector('[data-out="band"]').textContent = state.band.toFixed(0);
  }

  function densityAt(x, meanX) {
    const dx = x - meanX;
    return Math.exp(-(dx * dx) / (2 * state.sigma * state.sigma));
  }

  function bandProbability() {
    return state.band === 1 ? "68.2%" : state.band === 2 ? "95.4%" : "99.7%";
  }

  function draw() {
    const ox = 50, oy = 285, w = 720, h = 215;
    const meanX = 410 + state.mu;
    const leftBand = meanX - state.band * state.sigma;
    const rightBand = meanX + state.band * state.sigma;
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();

    ctx.beginPath();
    let started = false;
    for (let x = ox; x <= ox + w; x += 2) {
      if (x < leftBand || x > rightBand) continue;
      const y = oy - densityAt(x, meanX) * h;
      if (!started) { ctx.moveTo(x, oy); ctx.lineTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(Math.min(ox + w, rightBand), oy);
    ctx.closePath();
    ctx.fillStyle = "rgba(16,185,129,.18)"; ctx.fill();

    ctx.beginPath();
    for (let x = ox; x <= ox + w; x += 2) {
      const y = oy - densityAt(x, meanX) * h;
      if (x === ox) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#10b981"; ctx.lineWidth = 3; ctx.stroke();

    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(meanX, oy); ctx.lineTo(meanX, oy - h - 10); ctx.stroke();
    ctx.fillStyle = "#0f172a"; ctx.font = "800 14px system-ui";
    ctx.fillText("Distribución normal: centro, dispersión y área", 24, 30);
    ctx.fillStyle = "#64748b"; ctx.font = "800 12px system-ui";
    ctx.fillText("μ", meanX - 5, oy + 20);
    readout.innerHTML = `μ=${state.mu.toFixed(0)} · σ=${state.sigma.toFixed(0)} · banda ±${state.band}σ ≈ ${bandProbability()} del área.<br>La probabilidad se interpreta como área bajo la curva.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountNormalDistributionPlugin;
