export function mountDeBroglieRelationPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { p: 2, speed: 1.1, time: 0, paused: false };
  let raf = 0;

  root.classList.add("de-broglie-relation-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(300 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Momento p <strong data-out="p">2.0</strong><input data-key="p" type="range" min="0.6" max="6" step="0.1" value="2"></label>
    <label>Velocidad de fase visual <strong data-out="speed">1.1</strong><input data-key="speed" type="range" min="0" max="3" step="0.1" value="1.1"></label>
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
    controls.querySelector('[data-out="p"]').textContent = state.p.toFixed(1);
    controls.querySelector('[data-out="speed"]').textContent = state.speed.toFixed(1);
  }

  function draw() {
    if (!state.paused) state.time += 0.07 * state.speed;
    const h = 120;
    const lambda = h / state.p;
    const k = 2 * Math.PI / lambda;
    const cy = 150;
    ctx.clearRect(0, 0, 820, 300);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 300);
    ctx.strokeStyle = "rgba(148,163,184,.25)";
    ctx.beginPath(); ctx.moveTo(35, cy); ctx.lineTo(785, cy); ctx.stroke();

    ctx.strokeStyle = "#10b981"; ctx.lineWidth = 3; ctx.beginPath();
    for (let x = 35; x <= 785; x += 2) {
      const y = cy - Math.sin(k * x - state.time) * 48;
      if (x === 35) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    const px = 410;
    const py = cy - Math.sin(k * px - state.time) * 48;
    ctx.fillStyle = "#f59e0b"; ctx.shadowBlur = 14; ctx.shadowColor = "#f59e0b";
    ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

    ctx.strokeStyle = "rgba(245,158,11,.75)"; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(px, cy + 62); ctx.lineTo(px + lambda, cy + 62); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#fde68a"; ctx.font = "800 12px system-ui"; ctx.fillText("λ", px + lambda / 2 - 4, cy + 82);
    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("de Broglie: mayor momento implica menor longitud de onda", 24, 30);
    readout.innerHTML = `λ = h / p = ${h.toFixed(0)} / ${state.p.toFixed(1)} = ${lambda.toFixed(1)} px<br>Al aumentar p, la onda asociada se comprime.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountDeBroglieRelationPlugin;
