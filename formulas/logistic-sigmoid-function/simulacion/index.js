export function mountLogisticSigmoidFunctionPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { x: 0 };

  root.classList.add("logistic-sigmoid-function-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `<label>Entrada x <strong data-out="x">0.0</strong><input data-key="x" type="range" min="-6" max="6" step="0.1" value="0"></label>`;
  controls.addEventListener("input", onInput);

  function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
  function onInput(event) {
    if (event.target.dataset.key !== "x") return;
    state.x = Number(event.target.value);
    updateLabels(); draw();
  }
  function updateLabels() { controls.querySelector('[data-out="x"]').textContent = state.x.toFixed(1); }

  function draw() {
    const ox = 70, oy = 285, w = 690, h = 220;
    const s = sigmoid(state.x);
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy - h / 2); ctx.lineTo(ox + w, oy - h / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox + w / 2, oy); ctx.lineTo(ox + w / 2, oy - h); ctx.stroke();

    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const x = -6 + (px / w) * 12;
      const y = oy - sigmoid(x) * h;
      if (px === 0) ctx.moveTo(ox + px, y); else ctx.lineTo(ox + px, y);
    }
    ctx.strokeStyle = "#ec4899"; ctx.lineWidth = 3; ctx.stroke();

    const cx = ox + ((state.x + 6) / 12) * w;
    const cy = oy - s * h;
    ctx.strokeStyle = "#94a3b8"; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(cx, oy); ctx.lineTo(cx, cy); ctx.lineTo(ox + w / 2, cy); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#0f172a"; ctx.font = "800 14px system-ui";
    ctx.fillText("Función sigmoide logística", 24, 30);
    const deriv = s * (1 - s);
    readout.innerHTML = `σ(${state.x.toFixed(1)}) = ${(s * 100).toFixed(1)}% · derivada = ${deriv.toFixed(3)}<br>Salida acotada entre 0 y 1, útil como probabilidad binaria.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountLogisticSigmoidFunctionPlugin;
