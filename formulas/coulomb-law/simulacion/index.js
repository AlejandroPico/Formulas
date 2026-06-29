export function mountCoulombLawPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { q1: 3, q2: -3, x1: 160, x2: 560, drag: null, scale: 1 };

  root.classList.add("coulomb-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(330 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.style.touchAction = "none";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Carga q1 <strong data-out="q1">+3</strong> microC<input data-key="q1" type="range" min="-5" max="5" step="1" value="3"></label>
    <label>Carga q2 <strong data-out="q2">-3</strong> microC<input data-key="q2" type="range" min="-5" max="5" step="1" value="-3"></label>
    <label>Escala distancia <strong data-out="scale">1.0</strong><input data-key="scale" type="range" min="0.5" max="3" step="0.1" value="1"></label>
  `;

  controls.addEventListener("input", onInput);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
    draw();
  }

  function pos(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * (760 / rect.width), y: (event.clientY - rect.top) * (330 / rect.height) };
  }

  function onPointerDown(event) {
    const p = pos(event);
    if (Math.abs(p.x - state.x1) < 28) state.drag = "q1";
    else if (Math.abs(p.x - state.x2) < 28) state.drag = "q2";
    if (state.drag) canvas.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event) {
    if (!state.drag) return;
    const p = pos(event);
    if (state.drag === "q1") state.x1 = Math.max(55, Math.min(state.x2 - 70, p.x));
    if (state.drag === "q2") state.x2 = Math.max(state.x1 + 70, Math.min(705, p.x));
    draw();
  }

  function onPointerUp() { state.drag = null; }

  function updateLabels() {
    controls.querySelector('[data-out="q1"]').textContent = signed(state.q1);
    controls.querySelector('[data-out="q2"]').textContent = signed(state.q2);
    controls.querySelector('[data-out="scale"]').textContent = state.scale.toFixed(1);
  }

  function signed(value) { return value > 0 ? `+${value}` : String(value); }

  function arrow(x, y, angle, len, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(len, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(len, 0); ctx.lineTo(len - 8, -5); ctx.lineTo(len - 8, 5); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function charge(x, y, q, label) {
    ctx.fillStyle = q > 0 ? "#ef4444" : q < 0 ? "#3b82f6" : "#64748b";
    ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.font = "800 13px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(`${label} ${signed(q)}`, x, y);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }

  function draw() {
    const y = 165;
    const rPx = Math.abs(state.x2 - state.x1);
    const rMeters = (rPx / 120) * state.scale;
    const ke = 8.99;
    const force = state.q1 === 0 || state.q2 === 0 ? 0 : ke * Math.abs(state.q1 * state.q2) / Math.max(0.12, rMeters * rMeters);
    const same = state.q1 * state.q2 > 0;
    const interaction = state.q1 * state.q2 === 0 ? "sin interaccion" : same ? "repulsion" : "atraccion";
    const len = Math.min(120, 15 + force * 3.2);

    ctx.clearRect(0, 0, 760, 330);
    ctx.fillStyle = "#07111f"; ctx.fillRect(0, 0, 760, 330);
    ctx.strokeStyle = "rgba(148,163,184,.35)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(710, y); ctx.stroke();
    ctx.strokeStyle = "rgba(226,232,240,.35)"; ctx.setLineDash([7, 7]);
    ctx.beginPath(); ctx.moveTo(state.x1, y + 46); ctx.lineTo(state.x2, y + 46); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#cbd5e1"; ctx.font = "700 13px system-ui";
    ctx.fillText(`r = ${rMeters.toFixed(2)} m`, (state.x1 + state.x2) / 2 - 34, y + 68);

    if (force > 0.01) {
      arrow(state.x1, y - 34, same ? Math.PI : 0, len, "#eab308");
      arrow(state.x2, y - 34, same ? 0 : Math.PI, len, "#eab308");
    }
    charge(state.x1, y, state.q1, "q1");
    charge(state.x2, y, state.q2, "q2");

    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Ley de Coulomb: signo, distancia y fuerza electrostatica", 24, 30);
    readout.innerHTML = `F proporcional a |q1 q2| / r^2 = ${force.toFixed(2)} unidades visuales<br>${interaction}. Arrastra las cargas para cambiar la distancia.`;
  }

  updateLabels();
  draw();
  return () => {
    controls.removeEventListener("input", onInput);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
  };
}

export default mountCoulombLawPlugin;
