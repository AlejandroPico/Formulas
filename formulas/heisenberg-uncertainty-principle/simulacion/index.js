export function mountHeisenbergUncertaintyPrinciplePlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { dx: 110, phase: 0, paused: false };
  let raf = 0;

  root.classList.add("heisenberg-uncertainty-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(330 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Incertidumbre espacial Δx <strong data-out="dx">110</strong><input data-key="dx" type="range" min="30" max="210" step="5" value="110"></label>
    <button type="button" data-action="pause">Pausar</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function onInput(event) {
    if (event.target.dataset.key !== "dx") return;
    state.dx = Number(event.target.value);
    updateLabels();
  }

  function onClick(event) {
    if (event.target.dataset.action !== "pause") return;
    state.paused = !state.paused;
    event.target.textContent = state.paused ? "Reanudar" : "Pausar";
  }

  function updateLabels() {
    controls.querySelector('[data-out="dx"]').textContent = state.dx.toFixed(0);
  }

  function arrow(x1, y1, x2, y2) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = "#10b981"; ctx.fillStyle = "#10b981"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.save(); ctx.translate(x2, y2); ctx.rotate(a);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-8, -4); ctx.lineTo(-8, 4); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function draw() {
    if (!state.paused) state.phase += 0.025;
    const cx = 380, cy = 165;
    const dy = state.dx * 0.62;
    const dp = 2600 / state.dx;
    ctx.clearRect(0, 0, 760, 330);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 760, 330);
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2.5; ctx.setLineDash([7, 6]);
    ctx.strokeRect(cx - state.dx / 2, cy - dy / 2, state.dx, dy); ctx.setLineDash([]);
    ctx.fillStyle = "rgba(239,68,68,.08)"; ctx.fillRect(cx - state.dx / 2, cy - dy / 2, state.dx, dy);

    for (let i = 0; i < 26; i++) {
      const a = i * 2.399 + state.phase;
      const rr = Math.sqrt((i + 1) / 26);
      const px = cx + Math.cos(a) * state.dx * 0.42 * rr;
      const py = cy + Math.sin(a) * dy * 0.42 * rr;
      ctx.fillStyle = "rgba(56,189,248,.55)";
      ctx.beginPath(); ctx.arc(px, py, 2.6, 0, Math.PI * 2); ctx.fill();
    }

    for (let i = 0; i < 9; i++) {
      const a = state.phase * 1.7 + i * Math.PI * 2 / 9;
      const len = dp * (0.55 + (i % 3) * 0.12);
      arrow(cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len);
    }

    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Heisenberg: estrechar posición ensancha momento", 24, 30);
    readout.innerHTML = `Δx = ${state.dx.toFixed(0)} · Δp visual = ${dp.toFixed(1)}<br>Producto visual Δx·Δp = ${(state.dx * dp).toFixed(0)} constante.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountHeisenbergUncertaintyPrinciplePlugin;
