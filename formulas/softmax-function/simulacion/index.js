export function mountSoftmaxFunctionPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { z1: 2, z2: 1, z3: -1, temperature: 1 };
  const labels = ["Gato", "Perro", "Ave"];

  root.classList.add("softmax-function-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Logit Gato z₁ <strong data-out="z1">2.0</strong><input data-key="z1" type="range" min="-3" max="5" step="0.1" value="2"></label>
    <label>Logit Perro z₂ <strong data-out="z2">1.0</strong><input data-key="z2" type="range" min="-3" max="5" step="0.1" value="1"></label>
    <label>Logit Ave z₃ <strong data-out="z3">-1.0</strong><input data-key="z3" type="range" min="-3" max="5" step="0.1" value="-1"></label>
    <label>Temperatura visual τ <strong data-out="temperature">1.0</strong><input data-key="temperature" type="range" min="0.4" max="3" step="0.1" value="1"></label>
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
    ["z1", "z2", "z3", "temperature"].forEach(key => {
      controls.querySelector(`[data-out="${key}"]`).textContent = state[key].toFixed(1);
    });
  }

  function probabilities() {
    const logits = [state.z1, state.z2, state.z3].map(v => v / state.temperature);
    const max = Math.max(...logits);
    const exp = logits.map(v => Math.exp(v - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(v => v / sum);
  }

  function draw() {
    const probs = probabilities();
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, 820, 340);
    ctx.fillStyle = "#0f172a"; ctx.font = "800 14px system-ui";
    ctx.fillText("Softmax: logits convertidos en probabilidades", 24, 30);

    const startY = 90;
    probs.forEach((p, i) => {
      const y = startY + i * 70;
      const z = [state.z1, state.z2, state.z3][i];
      ctx.fillStyle = "#475569"; ctx.font = "800 13px system-ui";
      ctx.fillText(`${labels[i]}  z=${z.toFixed(1)}`, 70, y + 12);
      ctx.fillStyle = "#e2e8f0"; ctx.fillRect(190, y, 470, 22);
      ctx.fillStyle = "#a855f7"; ctx.fillRect(190, y, 470 * p, 22);
      ctx.fillStyle = "#0f172a"; ctx.font = "800 15px ui-monospace, monospace";
      ctx.fillText(`${(p * 100).toFixed(1)}%`, 680, y + 17);
    });

    const total = probs.reduce((a, b) => a + b, 0);
    const winner = labels[probs.indexOf(Math.max(...probs))];
    readout.innerHTML = `Suma de probabilidades = ${(total * 100).toFixed(1)}%. Clase dominante: ${winner}.<br>Se resta el máximo logit internamente para estabilidad numérica.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountSoftmaxFunctionPlugin;
