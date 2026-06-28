export function mountCauchyRiemannPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { x: 1.2, y: 0.8, mode: "analytic" };

  root.classList.add("cr-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(420 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Función<select data-key="mode"><option value="analytic">f(z)=z²</option><option value="nonanalytic">f(z)=conjugado(z)</option></select></label>
    <label>x <strong data-out="x">1.20</strong><input data-key="x" type="range" min="-4" max="4" step="0.05" value="1.2"></label>
    <label>y <strong data-out="y">0.80</strong><input data-key="y" type="range" min="-2.6" max="2.6" step="0.05" value="0.8"></label>
  `;
  controls.addEventListener("input", onInput);
  canvas.addEventListener("pointerdown", onPointer);
  canvas.addEventListener("pointermove", onPointerMove);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = key === "mode" ? event.target.value : Number(event.target.value);
    updateLabels();
    draw();
  }

  function onPointer(event) {
    canvas.setPointerCapture?.(event.pointerId);
    setFromPointer(event);
  }

  function onPointerMove(event) {
    if (event.buttons !== 1) return;
    setFromPointer(event);
  }

  function setFromPointer(event) {
    const rect = canvas.getBoundingClientRect();
    const px = (event.clientX - rect.left) * (760 / rect.width);
    const py = (event.clientY - rect.top) * (420 / rect.height);
    state.x = clamp((px - 380) / 70, -4, 4);
    state.y = clamp((210 - py) / 70, -2.6, 2.6);
    controls.querySelector('[data-key="x"]').value = state.x;
    controls.querySelector('[data-key="y"]').value = state.y;
    updateLabels();
    draw();
  }

  function values() {
    const x = state.x;
    const y = state.y;
    if (state.mode === "analytic") {
      return { u: x * x - y * y, v: 2 * x * y, ux: 2 * x, uy: -2 * y, vx: 2 * y, vy: 2 * x };
    }
    return { u: x, v: -y, ux: 1, uy: 0, vx: 0, vy: -1 };
  }

  function updateLabels() {
    controls.querySelector('[data-out="x"]').textContent = state.x.toFixed(2);
    controls.querySelector('[data-out="y"]').textContent = state.y.toFixed(2);
  }

  function drawGrid() {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 760, 420);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let x = 30; x < 760; x += 70) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 420); ctx.stroke(); }
    for (let y = 0; y < 420; y += 70) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(760, y); ctx.stroke(); }
    ctx.strokeStyle = "#94a3b8";
    ctx.beginPath(); ctx.moveTo(0, 210); ctx.lineTo(760, 210); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(380, 0); ctx.lineTo(380, 420); ctx.stroke();
  }

  function draw() {
    const v = values();
    const px = 380 + state.x * 70;
    const py = 210 - state.y * 70;
    const ok1 = Math.abs(v.ux - v.vy) < 1e-9;
    const ok2 = Math.abs(v.uy + v.vx) < 1e-9;
    drawGrid();
    ctx.fillStyle = ok1 && ok2 ? "#22c55e" : "#ef4444";
    ctx.beginPath();
    ctx.arc(px, py, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 13px system-ui";
    ctx.fillText(`z = ${state.x.toFixed(2)} + ${state.y.toFixed(2)}i`, px + 14, py - 10);
    readout.innerHTML = `u_x=${v.ux.toFixed(2)}; v_y=${v.vy.toFixed(2)} ${ok1 ? "OK" : "NO"}<br>u_y=${v.uy.toFixed(2)}; -v_x=${(-v.vx).toFixed(2)} ${ok2 ? "OK" : "NO"}<br>${ok1 && ok2 ? "Se cumplen las condiciones de Cauchy-Riemann." : "No se cumplen las condiciones de Cauchy-Riemann."}`;
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  updateLabels();
  draw();
  return () => {
    controls.removeEventListener("input", onInput);
    canvas.removeEventListener("pointerdown", onPointer);
    canvas.removeEventListener("pointermove", onPointerMove);
  };
}

export default mountCauchyRiemannPlugin;
