export function mountMaxwellEquationsPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { freq: 1.5, amp: 62, time: 0, showEnvelope: true };
  let raf = 0;

  root.classList.add("maxwell-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(390 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Frecuencia f <strong data-out="freq">1.5</strong> Hz<input data-key="freq" type="range" min="0.4" max="3.5" step="0.1" value="1.5"></label>
    <label>Amplitud <strong data-out="amp">62</strong><input data-key="amp" type="range" min="25" max="95" step="5" value="62"></label>
    <button type="button" data-action="envelope">Envolvente: visible</button>
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
    if (event.target.dataset.action !== "envelope") return;
    state.showEnvelope = !state.showEnvelope;
    event.target.textContent = `Envolvente: ${state.showEnvelope ? "visible" : "oculta"}`;
  }

  function updateLabels() {
    controls.querySelector('[data-out="freq"]').textContent = state.freq.toFixed(1);
    controls.querySelector('[data-out="amp"]').textContent = state.amp.toFixed(0);
  }

  function arrow(x1, y1, x2, y2, color) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.save(); ctx.translate(x2, y2); ctx.rotate(angle);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-7, -4); ctx.lineTo(-7, 4); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function draw() {
    const cy = 205;
    const start = 42;
    const end = 780;
    const k = state.freq * 0.055;
    state.time += 0.035 * state.freq;
    ctx.clearRect(0, 0, 820, 390);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 390);

    ctx.strokeStyle = "#334155"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(start, cy); ctx.lineTo(end, cy); ctx.stroke();
    arrow(end - 42, cy, end, cy, "#94a3b8");
    ctx.fillStyle = "#cbd5e1"; ctx.font = "700 13px system-ui"; ctx.fillText("propagacion", end - 108, cy - 12);

    for (let x = start; x < end; x += 16) {
      const phase = k * (x - start) - state.time;
      const e = Math.sin(phase) * state.amp;
      const b = Math.sin(phase) * state.amp * 0.62;
      arrow(x, cy, x, cy - e, "#ef4444");
      arrow(x, cy, x + b * 0.65, cy + b * 0.42, "#3b82f6");
    }

    if (state.showEnvelope) {
      ctx.strokeStyle = "rgba(239,68,68,.55)"; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let x = start; x <= end; x += 2) {
        const y = cy - Math.sin(k * (x - start) - state.time) * state.amp;
        if (x === start) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = "rgba(59,130,246,.42)"; ctx.beginPath();
      for (let x = start; x <= end; x += 3) {
        const y = cy + Math.sin(k * (x - start) - state.time) * state.amp * 0.28;
        if (x === start) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Onda electromagnetica: E y B acoplados", 24, 30);
    ctx.fillStyle = "#fca5a5"; ctx.fillText("E", 38, 58);
    ctx.fillStyle = "#93c5fd"; ctx.fillText("B", 64, 58);
    readout.innerHTML = `Frecuencia = ${state.freq.toFixed(1)} Hz; amplitud visual = ${state.amp.toFixed(0)}<br>Un campo E variable induce B, y un campo B variable induce E: la perturbacion se propaga como luz.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountMaxwellEquationsPlugin;
