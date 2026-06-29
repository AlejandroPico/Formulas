export function mountKirchhoffLawsPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { voltage: 12, r1: 10, r2: 20, phase: 0 };
  let raf = 0;

  root.classList.add("kirchhoff-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(360 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Voltaje V <strong data-out="voltage">12</strong> V<input data-key="voltage" type="range" min="3" max="24" step="1" value="12"></label>
    <label>Rama R1 <strong data-out="r1">10</strong> ohm<input data-key="r1" type="range" min="4" max="60" step="1" value="10"></label>
    <label>Rama R2 <strong data-out="r2">20</strong> ohm<input data-key="r2" type="range" min="4" max="60" step="1" value="20"></label>
  `;
  controls.addEventListener("input", onInput);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
  }

  function updateLabels() {
    controls.querySelector('[data-out="voltage"]').textContent = state.voltage.toFixed(0);
    controls.querySelector('[data-out="r1"]').textContent = state.r1.toFixed(0);
    controls.querySelector('[data-out="r2"]').textContent = state.r2.toFixed(0);
  }

  function movingDot(points, t, color) {
    const segs = [];
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      segs.push({ a, b, len }); total += len;
    }
    let d = (t % 1) * total;
    for (const s of segs) {
      if (d > s.len) { d -= s.len; continue; }
      const u = d / s.len;
      const x = s.a.x + (s.b.x - s.a.x) * u;
      const y = s.a.y + (s.b.y - s.a.y) * u;
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      return;
    }
  }

  function drawPath(points, color, width = 5) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
    points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    ctx.stroke();
  }

  function resistor(x, y, color, label) {
    ctx.fillStyle = color; ctx.fillRect(x, y, 64, 22);
    ctx.strokeStyle = "#f8fafc"; ctx.strokeRect(x, y, 64, 22);
    ctx.fillStyle = "#fff"; ctx.font = "800 12px system-ui"; ctx.fillText(label, x + 23, y + 15);
  }

  function draw() {
    const V = state.voltage;
    const I1 = V / state.r1;
    const I2 = V / state.r2;
    const It = I1 + I2;
    state.phase += 0.008 + Math.min(0.04, It * 0.01);

    ctx.clearRect(0, 0, 760, 360);
    ctx.fillStyle = "#07111f"; ctx.fillRect(0, 0, 760, 360);
    const main = [{ x: 55, y: 180 }, { x: 210, y: 180 }];
    const upper = [{ x: 210, y: 180 }, { x: 210, y: 92 }, { x: 550, y: 92 }, { x: 550, y: 180 }];
    const lower = [{ x: 210, y: 180 }, { x: 210, y: 268 }, { x: 550, y: 268 }, { x: 550, y: 180 }];
    const out = [{ x: 550, y: 180 }, { x: 705, y: 180 }];
    drawPath(main, "#3b82f6", 6); drawPath(upper, "#ec4899", 5); drawPath(lower, "#10b981", 5); drawPath(out, "#64748b", 5);
    resistor(345, 81, "#ec4899", "R1"); resistor(345, 257, "#10b981", "R2");
    ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(210, 180, 9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(550, 180, 9, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 8; i++) movingDot(main, state.phase + i / 8, "#bfdbfe");
    for (let i = 0; i < 6; i++) movingDot(upper, state.phase * (I1 / Math.max(It, 0.01)) + i / 6, "#f9a8d4");
    for (let i = 0; i < 6; i++) movingDot(lower, state.phase * (I2 / Math.max(It, 0.01)) + i / 6, "#86efac");

    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui"; ctx.fillText("Kirchhoff: nodos y mallas en paralelo", 24, 30);
    ctx.fillStyle = "#93c5fd"; ctx.fillText(`It = ${It.toFixed(2)} A`, 58, 165);
    ctx.fillStyle = "#f9a8d4"; ctx.fillText(`I1 = ${I1.toFixed(2)} A`, 360, 72);
    ctx.fillStyle = "#86efac"; ctx.fillText(`I2 = ${I2.toFixed(2)} A`, 360, 247);
    readout.innerHTML = `Nodo: Itotal = I1 + I2 = ${It.toFixed(3)} A = ${I1.toFixed(3)} + ${I2.toFixed(3)}<br>Mallas: cada rama en paralelo cae ${V.toFixed(0)} V, igual que la fuente.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); };
}

export default mountKirchhoffLawsPlugin;
