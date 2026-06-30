export function mountBackpropagationPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { error: 1.5, local1: 1.2, local2: 0.8, t: 1, paused: false };
  let raf = 0;

  root.classList.add("backpropagation-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Error de salida ∂L/∂ŷ <strong data-out="error">1.5</strong><input data-key="error" type="range" min="0.2" max="3.0" step="0.1" value="1.5"></label>
    <label>Derivada local ∂ŷ/∂h <strong data-out="local2">0.8</strong><input data-key="local2" type="range" min="0.2" max="1.6" step="0.1" value="0.8"></label>
    <label>Derivada local ∂h/∂w₁ <strong data-out="local1">1.2</strong><input data-key="local1" type="range" min="0.2" max="2.0" step="0.1" value="1.2"></label>
    <button type="button" data-action="pause">Pausar</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  const nodes = [
    { x: 120, y: 170, label: "Entrada x" },
    { x: 410, y: 170, label: "Oculta h" },
    { x: 700, y: 170, label: "Salida ŷ" }
  ];

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
    ["error", "local1", "local2"].forEach(key => {
      controls.querySelector(`[data-out="${key}"]`).textContent = state[key].toFixed(1);
    });
  }

  function drawNode(node) {
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath(); ctx.arc(node.x, node.y, 24, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#cbd5e1"; ctx.font = "800 13px system-ui";
    ctx.fillText(node.label, node.x - 34, node.y + 48);
  }

  function pulse(from, to, progress, color) {
    const x = from.x + (to.x - from.x) * progress;
    const y = from.y + (to.y - from.y) * progress;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
  }

  function draw() {
    if (!state.paused) {
      state.t -= 0.012;
      if (state.t <= 0) state.t = 1;
    }
    const gradW2 = state.error * state.local2;
    const gradW1 = state.error * state.local2 * state.local1;

    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#334155"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(nodes[0].x, nodes[0].y); ctx.lineTo(nodes[1].x, nodes[1].y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(nodes[1].x, nodes[1].y); ctx.lineTo(nodes[2].x, nodes[2].y); ctx.stroke();

    ctx.strokeStyle = "rgba(56,189,248,.45)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(nodes[0].x, nodes[0].y + 28); ctx.lineTo(nodes[2].x, nodes[2].y + 28); ctx.stroke();
    pulse(nodes[0], nodes[1], 1 - state.t, "#38bdf8");
    pulse(nodes[1], nodes[2], 1 - state.t, "#38bdf8");
    pulse(nodes[2], nodes[1], state.t, "#ef4444");
    pulse(nodes[1], nodes[0], state.t, "#ef4444");

    nodes.forEach(drawNode);
    ctx.fillStyle = "#94a3b8"; ctx.font = "800 12px ui-monospace, monospace";
    ctx.fillText(`∂L/∂w₂=${gradW2.toFixed(2)}`, 510, 140);
    ctx.fillText(`∂L/∂w₁=${gradW1.toFixed(2)}`, 220, 140);
    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Backpropagation: regla de la cadena hacia atrás", 24, 30);

    readout.innerHTML = `∂L/∂w₁ = ${state.error.toFixed(1)} · ${state.local2.toFixed(1)} · ${state.local1.toFixed(1)} = ${gradW1.toFixed(2)}<br>El flujo rojo representa gradientes; el azul, activaciones hacia delante.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountBackpropagationPlugin;
