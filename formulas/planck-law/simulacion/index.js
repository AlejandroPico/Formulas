export function mountPlanckLawPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { temp: 4800 };

  root.classList.add("planck-law-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Temperatura T <strong data-out="temp">4800</strong> K<input data-key="temp" type="range" min="2500" max="9000" step="100" value="4800"></label>
  `;
  controls.addEventListener("input", onInput);

  function onInput(event) {
    if (event.target.dataset.key !== "temp") return;
    state.temp = Number(event.target.value);
    updateLabels();
    draw();
  }

  function updateLabels() {
    controls.querySelector('[data-out="temp"]').textContent = state.temp.toFixed(0);
  }

  function radiance(lambdaNm, t) {
    const lambda = lambdaNm * 1e-9;
    const c2 = 1.4387769e-2;
    const x = c2 / (lambda * t);
    return 1 / (Math.pow(lambdaNm, 5) * (Math.exp(Math.min(80, x)) - 1));
  }

  function starColor(t) {
    if (t < 3500) return "rojo-anaranjado";
    if (t < 5200) return "naranja/amarillo";
    if (t < 6500) return "blanco cálido";
    return "blanco-azulado";
  }

  function drawVisibleBand(ox, oy, w, h) {
    const x1 = ox + ((380 - 150) / 1850) * w;
    const x2 = ox + ((750 - 150) / 1850) * w;
    const grad = ctx.createLinearGradient(x1, 0, x2, 0);
    grad.addColorStop(0, "rgba(124,58,237,.22)");
    grad.addColorStop(.25, "rgba(59,130,246,.22)");
    grad.addColorStop(.5, "rgba(34,197,94,.22)");
    grad.addColorStop(.72, "rgba(234,179,8,.22)");
    grad.addColorStop(1, "rgba(239,68,68,.22)");
    ctx.fillStyle = grad;
    ctx.fillRect(x1, oy - h, x2 - x1, h);
  }

  function draw() {
    const ox = 70, oy = 285, w = 690, h = 225;
    const minL = 150, maxL = 2000;
    const samples = [];
    let max = 0;
    for (let i = 0; i <= 360; i++) {
      const lambda = minL + (maxL - minL) * i / 360;
      const b = radiance(lambda, state.temp);
      samples.push({ lambda, b });
      if (b > max) max = b;
    }
    const peak = 2.897771955e6 / state.temp;
    const peakX = ox + ((peak - minL) / (maxL - minL)) * w;

    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 340);
    drawVisibleBand(ox, oy, w, h);
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy - h); ctx.lineTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();
    ctx.fillStyle = "#94a3b8"; ctx.font = "800 12px system-ui";
    ctx.fillText("λ", ox + w - 10, oy + 22);
    ctx.fillText("Bλ", ox - 35, oy - h + 6);
    ctx.fillText("visible", ox + 115, oy - h + 18);

    ctx.beginPath();
    samples.forEach((s, i) => {
      const x = ox + ((s.lambda - minL) / (maxL - minL)) * w;
      const y = oy - (s.b / max) * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#eab308"; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = "#f97316"; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(peakX, oy); ctx.lineTo(peakX, oy - h); ctx.stroke(); ctx.setLineDash([]);

    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Ley de Planck: espectro de cuerpo negro", 24, 30);
    readout.innerHTML = `Pico de Wien λmax ≈ ${peak.toFixed(0)} nm · color aproximado: ${starColor(state.temp)}<br>La curva está normalizada para comparar forma y desplazamiento del pico.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountPlanckLawPlugin;
