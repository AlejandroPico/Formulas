export function mountShannonHartleyCapacityPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { bandwidth: 100, snrDb: 15 };

  root.classList.add("shannon-hartley-capacity-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Ancho de banda B <strong data-out="bandwidth">100</strong> kHz<input data-key="bandwidth" type="range" min="20" max="240" step="5" value="100"></label>
    <label>SNR <strong data-out="snrDb">15</strong> dB<input data-key="snrDb" type="range" min="0" max="36" step="1" value="15"></label>
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
    controls.querySelector('[data-out="bandwidth"]').textContent = state.bandwidth.toFixed(0);
    controls.querySelector('[data-out="snrDb"]').textContent = state.snrDb.toFixed(0);
  }

  function draw() {
    const ox = 70, oy = 270, w = 690, h = 210;
    const snrLinear = Math.pow(10, state.snrDb / 10);
    const capacity = state.bandwidth * 1000 * Math.log2(1 + snrLinear);
    const bWidth = Math.max(40, (state.bandwidth / 240) * (w - 30));
    const noiseHeight = 34;
    const signalHeight = Math.min(h - 25, noiseHeight + Math.log2(1 + snrLinear) * 18);

    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy - h); ctx.lineTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "800 12px system-ui";
    ctx.fillText("frecuencia", ox + w - 70, oy + 20);
    ctx.fillText("potencia / Hz", ox - 50, oy - h + 8);

    ctx.fillStyle = "rgba(239,68,68,.28)";
    ctx.fillRect(ox + 1, oy - noiseHeight, bWidth, noiseHeight);
    ctx.strokeStyle = "#ef4444";
    ctx.strokeRect(ox + 1, oy - noiseHeight, bWidth, noiseHeight);
    ctx.fillStyle = "rgba(34,197,94,.30)";
    ctx.fillRect(ox + 1, oy - signalHeight, bWidth, signalHeight - noiseHeight);
    ctx.strokeStyle = "#22c55e";
    ctx.strokeRect(ox + 1, oy - signalHeight, bWidth, signalHeight - noiseHeight);

    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Señal S", ox + 12, oy - signalHeight + 16);
    ctx.fillText("Ruido N", ox + 12, oy - noiseHeight + 16);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(ox + 1, oy + 8); ctx.lineTo(ox + bWidth, oy + 8); ctx.stroke();
    ctx.fillStyle = "#93c5fd";
    ctx.fillText(`B = ${state.bandwidth.toFixed(0)} kHz`, ox + bWidth / 2 - 36, oy + 28);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Shannon-Hartley: capacidad máxima de un canal ruidoso", 24, 30);
    const efficiency = Math.log2(1 + snrLinear);
    readout.innerHTML = `S/N lineal = ${snrLinear.toFixed(2)} · eficiencia = ${efficiency.toFixed(2)} bit/s/Hz<br>C = B·log₂(1+S/N) = ${(capacity / 1000).toFixed(1)} kbps.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountShannonHartleyCapacityPlugin;
