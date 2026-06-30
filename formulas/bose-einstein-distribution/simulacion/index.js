export function mountBoseEinsteinDistributionPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const levels = [245, 195, 145, 95, 55];
  const state = { temp: 0.38, mu: -0.08, paused: false, particles: [] };
  let raf = 0;

  root.classList.add("bose-einstein-distribution-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(320 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Temperatura T <strong data-out="temp">0.38</strong><input data-key="temp" type="range" min="0.08" max="1.4" step="0.02" value="0.38"></label>
    <label>Potencial químico μ <strong data-out="mu">-0.08</strong><input data-key="mu" type="range" min="-1.2" max="-0.02" step="0.02" value="-0.08"></label>
    <button type="button" data-action="pause">Pausar</button>
    <button type="button" data-action="shuffle">Repartir de nuevo</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function init() {
    state.particles = Array.from({ length: 80 }, (_, i) => ({
      x: 70 + Math.random() * 690,
      y: 160,
      target: i % levels.length,
      jitter: Math.random() * Math.PI * 2
    }));
    assignLevels();
  }

  function occupation(e) {
    const t = Math.max(0.04, state.temp);
    const denom = Math.exp((e - state.mu) / t) - 1;
    return Math.max(0, 1 / Math.max(denom, 0.02));
  }

  function assignLevels() {
    const weights = [0, 0.5, 1, 1.55, 2.15].map(occupation);
    const total = weights.reduce((a, b) => a + b, 0);
    state.particles.forEach(p => {
      let r = Math.random() * total;
      let idx = 0;
      for (; idx < weights.length - 1; idx++) { r -= weights[idx]; if (r <= 0) break; }
      p.target = idx;
    });
  }

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
    assignLevels();
  }

  function onClick(event) {
    const action = event.target.dataset.action;
    if (action === "pause") {
      state.paused = !state.paused;
      event.target.textContent = state.paused ? "Reanudar" : "Pausar";
    }
    if (action === "shuffle") assignLevels();
  }

  function updateLabels() {
    controls.querySelector('[data-out="temp"]').textContent = state.temp.toFixed(2);
    controls.querySelector('[data-out="mu"]').textContent = state.mu.toFixed(2);
  }

  function draw() {
    if (!state.paused && Math.random() < 0.025) assignLevels();
    const counts = Array(levels.length).fill(0);
    ctx.clearRect(0, 0, 820, 320);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 820, 320);

    levels.forEach((y, i) => {
      ctx.strokeStyle = "rgba(148,163,184,.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(55, y); ctx.lineTo(765, y); ctx.stroke();
      ctx.fillStyle = "#94a3b8";
      ctx.font = "800 12px system-ui";
      ctx.fillText(`E${i}`, 25, y + 4);
    });

    state.particles.forEach(p => {
      const targetY = levels[p.target];
      p.y += (targetY - p.y) * 0.12;
      counts[p.target] += 1;
      const x = p.x + Math.sin(performance.now() * 0.003 + p.jitter) * (2 + state.temp * 3);
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath(); ctx.arc(x, p.y, 4, 0, Math.PI * 2); ctx.fill();
    });

    const condensate = counts[0] / state.particles.length;
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Bose-Einstein: ocupación múltiple del mismo estado", 24, 28);
    readout.innerHTML = `Ocupación E0: ${counts[0]} / ${state.particles.length} (${Math.round(condensate * 100)}%)<br>${condensate > 0.65 ? "Régimen visual de condensación: muchos bosones comparten el estado fundamental." : "Régimen térmico: la ocupación se reparte por niveles excitados."}`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); init(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountBoseEinsteinDistributionPlugin;
