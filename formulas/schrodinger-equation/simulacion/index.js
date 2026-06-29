export function mountSchrodingerEquationPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { width: 30, k: 0.16, speed: 1.2, time: 0, paused: false };
  let raf = 0;

  root.classList.add("schrodinger-equation-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Ancho inicial Δx <strong data-out="width">30</strong><input data-key="width" type="range" min="14" max="70" step="2" value="30"></label>
    <label>Número de onda k <strong data-out="k">0.16</strong><input data-key="k" type="range" min="0.05" max="0.35" step="0.01" value="0.16"></label>
    <label>Velocidad de grupo <strong data-out="speed">1.2</strong><input data-key="speed" type="range" min="0" max="3" step="0.1" value="1.2"></label>
    <button type="button" data-action="pause">Pausar</button>
    <button type="button" data-action="reset">Reiniciar</button>
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
    if (action === "pause") {
      state.paused = !state.paused;
      event.target.textContent = state.paused ? "Reanudar" : "Pausar";
    }
    if (action === "reset") state.time = 0;
  }

  function updateLabels() {
    controls.querySelector('[data-out="width"]').textContent = state.width.toFixed(0);
    controls.querySelector('[data-out="k"]').textContent = state.k.toFixed(2);
    controls.querySelector('[data-out="speed"]').textContent = state.speed.toFixed(1);
  }

  function drawCurve(kind, color, width) {
    const cy = 185;
    const cx = 410 + Math.sin(state.time * 0.08) * 190;
    const spread = Math.sqrt(state.width * state.width + Math.pow(state.time * 0.75 / Math.max(10, state.width), 2) * 120);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    for (let x = 30; x <= 790; x += 2) {
      const dx = x - cx;
      const gauss = Math.exp(-(dx * dx) / (2 * spread * spread));
      const value = kind === "prob" ? gauss * gauss : gauss * Math.cos(state.k * dx - state.time * 1.6);
      const y = cy - value * 82;
      if (x === 30) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    return spread;
  }

  function draw() {
    if (!state.paused) state.time += 0.045 * state.speed;
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "rgba(148,163,184,.28)";
    for (let y = 60; y <= 260; y += 40) { ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(790, y); ctx.stroke(); }
    const spread = drawCurve("real", "#3b82f6", 2);
    drawCurve("prob", "#a855f7", 4);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Schrödinger: paquete de onda libre y densidad |Ψ|²", 24, 30);
    readout.innerHTML = `Ancho efectivo visual ≈ ${spread.toFixed(1)} px<br>Azul: Re(Ψ). Violeta: |Ψ|². Un paquete estrecho se dispersa antes.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountSchrodingerEquationPlugin;
