export function mountCauchyIntegralFormulaPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { x: 42, y: -24, radius: 115, scale: 46 };

  root.classList.add("cauchy-integral-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(430 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Radio del contorno <strong data-out="radius">115</strong><input data-key="radius" type="range" min="65" max="170" step="5" value="115"></label>
    <button type="button" data-action="center">Enviar z0 al centro</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);
  canvas.addEventListener("pointerdown", onPointer);
  canvas.addEventListener("pointermove", onPointerMove);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
    draw();
  }

  function onClick(event) {
    if (event.target.dataset.action !== "center") return;
    state.x = 0;
    state.y = 0;
    draw();
  }

  function onPointer(event) {
    canvas.setPointerCapture?.(event.pointerId);
    setPoint(event);
  }

  function onPointerMove(event) {
    if (event.buttons !== 1) return;
    setPoint(event);
  }

  function setPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const px = (event.clientX - rect.left) * (760 / rect.width);
    const py = (event.clientY - rect.top) * (430 / rect.height);
    state.x = px - 380;
    state.y = py - 215;
    draw();
  }

  function updateLabels() {
    controls.querySelector('[data-out="radius"]').textContent = state.radius.toFixed(0);
  }

  function fValue() {
    const zr = state.x / state.scale;
    const zi = -state.y / state.scale;
    return { re: 2 + 0.8 * zr - 0.25 * zi, im: 0.6 * zi + 0.2 * zr };
  }

  function draw() {
    const cx = 380, cy = 215;
    const dist = Math.hypot(state.x, state.y);
    const inside = dist < state.radius;
    const val = fValue();
    ctx.clearRect(0, 0, 760, 430);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 760, 430);

    ctx.strokeStyle = "#e2e8f0";
    for (let x = 30; x < 760; x += 46) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 430); ctx.stroke(); }
    for (let y = 0; y < 430; y += 46) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(760, y); ctx.stroke(); }

    ctx.beginPath();
    ctx.arc(cx, cy, state.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(239,68,68,.06)";
    ctx.fill();
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.stroke();

    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
      const x = cx + Math.cos(a) * state.radius;
      const y = cy + Math.sin(a) * state.radius;
      arrowHead(x, y, a + Math.PI / 2, "#ef4444");
    }

    ctx.fillStyle = inside ? "#3b82f6" : "#64748b";
    ctx.beginPath();
    ctx.arc(cx + state.x, cy + state.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 13px system-ui";
    ctx.fillText("z0", cx + state.x + 14, cy + state.y - 8);
    ctx.fillText("contorno gamma", cx - state.radius + 10, cy - state.radius - 12);

    const result = inside ? `${val.re.toFixed(2)} ${val.im >= 0 ? "+" : "-"} ${Math.abs(val.im).toFixed(2)}i` : "0";
    readout.innerHTML = `${inside ? "z0 está dentro del contorno" : "z0 está fuera del contorno"}<br>1/(2πi) · integral = ${result}`;
  }

  function arrowHead(x, y, angle, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-8, -4); ctx.lineTo(-8, 4); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  updateLabels();
  draw();
  return () => {
    controls.removeEventListener("input", onInput);
    controls.removeEventListener("click", onClick);
    canvas.removeEventListener("pointerdown", onPointer);
    canvas.removeEventListener("pointermove", onPointerMove);
  };
}

export default mountCauchyIntegralFormulaPlugin;
