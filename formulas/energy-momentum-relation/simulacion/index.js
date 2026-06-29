export function mountEnergyMomentumRelationPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { rest: 4, momentum: 3, scale: 28 };

  root.classList.add("energy-momentum-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(350 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Energía de reposo m0c² <strong data-out="rest">4.0</strong> eV<input data-key="rest" type="range" min="0" max="8" step="0.5" value="4"></label>
    <label>Momento pc <strong data-out="momentum">3.0</strong> eV<input data-key="momentum" type="range" min="0" max="8" step="0.5" value="3"></label>
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
    controls.querySelector('[data-out="rest"]').textContent = state.rest.toFixed(1);
    controls.querySelector('[data-out="momentum"]').textContent = state.momentum.toFixed(1);
  }

  function drawArrow(x1, y1, x2, y2, color, width = 4) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.save();
    ctx.translate(x2, y2);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, -6);
    ctx.lineTo(-10, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    const ox = 125, oy = 275;
    const m = state.rest;
    const p = state.momentum;
    const e = Math.hypot(m, p);
    const xb = ox + m * state.scale;
    const yb = oy;
    const xt = xb;
    const yt = oy - p * state.scale;
    ctx.clearRect(0, 0, 760, 350);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 760, 350);

    ctx.strokeStyle = "#e2e8f0";
    for (let x = 40; x < 730; x += 35) { ctx.beginPath(); ctx.moveTo(x, 35); ctx.lineTo(x, 310); ctx.stroke(); }
    for (let y = 35; y < 320; y += 35) { ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(730, y); ctx.stroke(); }

    if (m > 0 && p > 0) {
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(xb - 14, yb - 14, 14, 14);
    }

    drawArrow(ox, oy, xb, yb, "#3b82f6", 5);
    drawArrow(xb, yb, xt, yt, "#ef4444", 5);
    drawArrow(ox, oy, xt, yt, "#10b981", 6);

    ctx.fillStyle = "#0f172a";
    ctx.font = "800 13px system-ui";
    if (m > 0) ctx.fillText("m0c²", ox + Math.max(8, (xb - ox) / 2 - 14), oy + 24);
    if (p > 0) ctx.fillText("pc", xb + 14, oy - Math.max(10, (oy - yt) / 2));
    ctx.fillText("E", (ox + xt) / 2 - 10, (oy + yt) / 2 - 14);

    let extra = "caso mixto: energía por reposo y por momento";
    if (m === 0 && p > 0) extra = "caso sin masa: E = pc";
    if (p === 0 && m > 0) extra = "caso en reposo: E = m0c²";
    if (m === 0 && p === 0) extra = "sin energía de reposo ni momento";

    ctx.fillStyle = "#0f172a";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Triángulo relativista: E² = (pc)² + (m0c²)²", 24, 28);
    readout.innerHTML = `E² = ${p.toFixed(1)}² + ${m.toFixed(1)}² = ${(e * e).toFixed(2)}<br>E = ${e.toFixed(3)} eV · ${extra}`;
  }

  updateLabels();
  draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountEnergyMomentumRelationPlugin;
