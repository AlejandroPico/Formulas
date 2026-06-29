export function mountGeneralRelativityPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { mass: 45, compactness: 0.45, showLight: true };

  root.classList.add("general-relativity-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(420 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Masa <strong data-out="mass">45</strong><input data-key="mass" type="range" min="0" max="90" step="1" value="45"></label>
    <label>Compactación <strong data-out="compactness">0.45</strong><input data-key="compactness" type="range" min="0.1" max="1" step="0.01" value="0.45"></label>
    <button type="button" data-action="light">Rayo de luz: visible</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
    draw();
  }

  function onClick(event) {
    if (event.target.dataset.action !== "light") return;
    state.showLight = !state.showLight;
    event.target.textContent = `Rayo de luz: ${state.showLight ? "visible" : "oculto"}`;
    draw();
  }

  function updateLabels() {
    controls.querySelector('[data-out="mass"]').textContent = state.mass.toFixed(0);
    controls.querySelector('[data-out="compactness"]').textContent = state.compactness.toFixed(2);
  }

  function warpPoint(x, y) {
    const cx = 410, cy = 210;
    const dx = x - cx;
    const dy = y - cy;
    const d = Math.hypot(dx, dy) || 1;
    const pull = state.mass * state.compactness * 115 / (d + 55);
    return { x: x + dx / d * pull, y: y + dy / d * pull };
  }

  function drawGrid() {
    ctx.strokeStyle = "rgba(100,116,139,.62)";
    ctx.lineWidth = 1;
    for (let y = 24; y <= 396; y += 28) {
      ctx.beginPath();
      for (let x = 20; x <= 800; x += 8) {
        const p = warpPoint(x, y);
        if (x === 20) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
    for (let x = 24; x <= 796; x += 28) {
      ctx.beginPath();
      for (let y = 20; y <= 400; y += 8) {
        const p = warpPoint(x, y);
        if (y === 20) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
  }

  function drawLightRay() {
    if (!state.showLight) return;
    ctx.strokeStyle = "#fde047";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 40; x <= 780; x += 6) {
      const dx = x - 410;
      const bend = state.mass * state.compactness * 0.9 * Math.exp(-(dx * dx) / 48000);
      const y = 116 + bend;
      if (x === 40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function draw() {
    const cx = 410, cy = 210;
    const horizon = state.mass * state.compactness > 62;
    const bodyRadius = 12 + state.mass * (horizon ? 0.22 : 0.18);
    const rs = state.mass * state.compactness * 0.55;
    ctx.clearRect(0, 0, 820, 420);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 820, 420);
    drawGrid();
    drawLightRay();

    if (state.mass > 0) {
      if (horizon) {
        ctx.fillStyle = "#000";
        ctx.beginPath(); ctx.arc(cx, cy, Math.max(20, bodyRadius), 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 3; ctx.stroke();
      } else {
        ctx.fillStyle = "#f97316";
        ctx.shadowBlur = 24;
        ctx.shadowColor = "#f97316";
        ctx.beginPath(); ctx.arc(cx, cy, bodyRadius, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.strokeStyle = "rgba(168,85,247,.75)";
      ctx.setLineDash([6, 5]);
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(8, rs), 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Campo de Einstein: geometría acoplada a energía-momento", 24, 30);
    readout.innerHTML = `Curvatura visual ∝ masa · compactación = ${(state.mass * state.compactness).toFixed(1)}<br>${horizon ? "Régimen compacto extremo: aparece horizonte visual." : "Régimen no extremo: desviación gravitacional moderada."}`;
  }

  updateLabels();
  draw();
  return () => { controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountGeneralRelativityPlugin;
