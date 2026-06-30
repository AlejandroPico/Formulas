export function mountBornRulePlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { sigma: 58, hits: [], flash: null };

  root.classList.add("born-rule-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Anchura de |ψ|² <strong data-out="sigma">58</strong><input data-key="sigma" type="range" min="25" max="120" step="1" value="58"></label>
    <button type="button" data-action="one">Medir 1 vez</button>
    <button type="button" data-action="many">Medir 100 veces</button>
    <button type="button" data-action="reset">Reiniciar</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function onInput(event) {
    if (event.target.dataset.key !== "sigma") return;
    state.sigma = Number(event.target.value);
    controls.querySelector('[data-out="sigma"]').textContent = state.sigma.toFixed(0);
    draw();
  }

  function onClick(event) {
    const action = event.target.dataset.action;
    if (action === "one") measure(1);
    if (action === "many") measure(100);
    if (action === "reset") { state.hits = []; state.flash = null; draw(); }
  }

  function gaussianRandom() {
    const u1 = Math.max(Math.random(), 1e-9);
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  function measure(n) {
    const cx = 410;
    for (let i = 0; i < n; i++) {
      const x = Math.max(50, Math.min(770, cx + gaussianRandom() * state.sigma));
      state.hits.push(x);
      if (state.hits.length > 900) state.hits.shift();
      state.flash = x;
    }
    draw();
  }

  function drawCurve() {
    const cx = 410, base = 240;
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let x = 40; x <= 780; x += 2) {
      const dx = x - cx;
      const d = Math.exp(-(dx * dx) / (2 * state.sigma * state.sigma));
      const y = base - d * 135;
      if (x === 40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function drawHistogram() {
    const bins = 36;
    const counts = Array(bins).fill(0);
    state.hits.forEach(x => {
      const idx = Math.max(0, Math.min(bins - 1, Math.floor((x - 50) / 720 * bins)));
      counts[idx] += 1;
    });
    const max = Math.max(1, ...counts);
    const w = 720 / bins;
    counts.forEach((c, i) => {
      const h = c / max * 80;
      ctx.fillStyle = "rgba(239,68,68,.45)";
      ctx.fillRect(50 + i * w, 300 - h, w - 2, h);
    });
  }

  function draw() {
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "rgba(148,163,184,.25)";
    ctx.beginPath(); ctx.moveTo(40, 240); ctx.lineTo(780, 240); ctx.stroke();
    drawHistogram();
    drawCurve();
    if (state.flash !== null) {
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(state.flash, 65); ctx.lineTo(state.flash, 300); ctx.stroke();
      ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(state.flash, 240, 6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Regla de Born: los puntos medidos reconstruyen |ψ|²", 24, 30);
    readout.innerHTML = `Mediciones acumuladas: ${state.hits.length}<br>La curva es |ψ|²; el histograma rojo son resultados de medición.`;
  }

  draw();
  return () => { controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountBornRulePlugin;
