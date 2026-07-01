export function mountScaledDotProductAttentionPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { sim: 4, scaled: true, dk: 16 };

  root.classList.add("scaled-dot-product-attention-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Similitud cruda QK <strong data-out="sim">4.0</strong><input data-key="sim" type="range" min="0" max="15" step="0.5" value="4"></label>
    <label>Dimensión dₖ <strong data-out="dk">16</strong><input data-key="dk" type="range" min="4" max="64" step="4" value="16"></label>
    <label><input data-key="scaled" type="checkbox" checked> Aplicar escalado por √dₖ</label>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("change", onInput);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = event.target.type === "checkbox" ? event.target.checked : Number(event.target.value);
    updateLabels(); draw();
  }
  function updateLabels() {
    controls.querySelector('[data-out="sim"]').textContent = state.sim.toFixed(1);
    controls.querySelector('[data-out="dk"]').textContent = state.dk.toFixed(0);
  }

  function softmax(values) {
    const max = Math.max(...values);
    const exp = values.map(v => Math.exp(v - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(v => v / sum);
  }

  function draw() {
    const scale = state.scaled ? Math.sqrt(state.dk) : 1;
    const logits = [state.sim, 1.5, -0.5].map(v => v / scale);
    const weights = softmax(logits);
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 340);
    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Atención escalada: pesos softmax sobre tokens", 24, 30);

    const baseY = 285, startX = 135, gap = 190, barW = 95;
    weights.forEach((w, i) => {
      const x = startX + i * gap;
      const h = w * 190;
      ctx.fillStyle = "rgba(59,130,246,.30)";
      ctx.fillRect(x, baseY - h, barW, h);
      ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2; ctx.strokeRect(x, baseY - h, barW, h);
      ctx.fillStyle = "#cbd5e1"; ctx.font = "800 13px system-ui";
      ctx.fillText(`Token ${i + 1}`, x + 20, baseY + 22);
      ctx.fillStyle = "#fff"; ctx.font = "800 13px ui-monospace, monospace";
      ctx.fillText(`${(w * 100).toFixed(1)}%`, x + 20, baseY - h - 10);
    });
    const mode = state.scaled ? `escalado √dₖ=${scale.toFixed(1)}` : "sin escalado";
    const warning = !state.scaled && weights[0] > 0.95 ? " Saturación: un token domina casi toda la atención." : "";
    readout.innerHTML = `${mode}. Entrada principal a softmax: ${(state.sim / scale).toFixed(2)}<br>Pesos: ${weights.map(w => (w * 100).toFixed(1) + "%").join(" · ")}.${warning}`;
  }

  updateLabels(); draw();
  return () => { controls.removeEventListener("input", onInput); controls.removeEventListener("change", onInput); };
}

export default mountScaledDotProductAttentionPlugin;
