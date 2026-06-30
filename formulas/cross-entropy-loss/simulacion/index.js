export function mountCrossEntropyLossPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { yhat: 0.5 };

  root.classList.add("cross-entropy-loss-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Probabilidad de la clase correcta ŷ <strong data-out="yhat">0.50</strong><input data-key="yhat" type="range" min="0.01" max="0.99" step="0.01" value="0.50"></label>
  `;
  controls.addEventListener("input", onInput);

  function onInput(event) {
    if (event.target.dataset.key !== "yhat") return;
    state.yhat = Number(event.target.value);
    updateLabels();
    draw();
  }

  function updateLabels() {
    controls.querySelector('[data-out="yhat"]').textContent = state.yhat.toFixed(2);
  }

  function draw() {
    const ox = 70, oy = 285, w = 690, h = 225;
    const loss = -Math.log(state.yhat);
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy - h); ctx.lineTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();
    ctx.fillStyle = "#64748b"; ctx.font = "800 12px system-ui";
    ctx.fillText("ŷ correcto", ox + w - 70, oy + 20);
    ctx.fillText("pérdida", ox - 48, oy - h + 8);

    ctx.beginPath();
    let started = false;
    for (let px = 1; px <= w; px++) {
      const yhat = px / w;
      const y = oy - Math.min(1, -Math.log(yhat) / 4) * h;
      if (!started) { ctx.moveTo(ox + px, y); started = true; }
      else ctx.lineTo(ox + px, y);
    }
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 3; ctx.stroke();

    const cx = ox + state.yhat * w;
    const cy = oy - Math.min(1, loss / 4) * h;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#94a3b8";
    ctx.beginPath(); ctx.moveTo(cx, oy); ctx.lineTo(cx, cy); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#0f172a"; ctx.font = "800 14px system-ui";
    ctx.fillText("Entropía cruzada: castigo por baja confianza en la clase correcta", 24, 30);
    const note = state.yhat > 0.85 ? "Predicción fuerte para la clase correcta: penalización baja." : state.yhat < 0.15 ? "Predicción muy mala: la penalización se dispara." : "Zona intermedia: el modelo aún no confía lo suficiente.";
    readout.innerHTML = `L = -ln(${state.yhat.toFixed(2)}) = ${loss.toFixed(4)}<br>${note}`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountCrossEntropyLossPlugin;
