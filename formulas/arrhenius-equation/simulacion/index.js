export function mountArrheniusEquationPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { temp: 320, ea: 55, a: 1.0 };

  root.classList.add("arrhenius-equation-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Temperatura T <strong data-out="temp">320</strong> K<input data-key="temp" type="range" min="250" max="850" step="10" value="320"></label>
    <label>Energía de activación Ea <strong data-out="ea">55</strong> kJ/mol<input data-key="ea" type="range" min="10" max="120" step="1" value="55"></label>
    <label>Factor A <strong data-out="a">1.0</strong><input data-key="a" type="range" min="0.2" max="5" step="0.1" value="1.0"></label>
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
    controls.querySelector('[data-out="temp"]').textContent = state.temp.toFixed(0);
    controls.querySelector('[data-out="ea"]').textContent = state.ea.toFixed(0);
    controls.querySelector('[data-out="a"]').textContent = state.a.toFixed(1);
  }

  function distribution(e) {
    const scale = state.temp / 12;
    return e * Math.exp(-e / scale);
  }

  function draw() {
    const ox = 70, oy = 285, w = 690, h = 220;
    const eMax = 160;
    const R = 8.314;
    const k = state.a * Math.exp(-(state.ea * 1000) / (R * state.temp));
    const reactive = Math.exp(-(state.ea * 1000) / (R * state.temp));
    const barrierX = ox + (state.ea / eMax) * w;
    const samples = [];
    let max = 0;
    for (let i = 0; i <= 240; i++) {
      const e = (i / 240) * eMax;
      const y = distribution(e);
      samples.push({ e, y });
      max = Math.max(max, y);
    }

    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy - h); ctx.lineTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();
    ctx.fillStyle = "#94a3b8"; ctx.font = "800 12px system-ui";
    ctx.fillText("energía molecular", ox + w - 115, oy + 22);
    ctx.fillText("población", ox - 45, oy - h + 8);

    ctx.beginPath();
    samples.forEach((s, i) => {
      const x = ox + (s.e / eMax) * w;
      const y = oy - (s.y / max) * h;
      if (i === 0) ctx.moveTo(x, oy);
      ctx.lineTo(x, y);
    });
    ctx.lineTo(ox + w, oy);
    ctx.closePath();
    ctx.fillStyle = "rgba(59,130,246,.20)"; ctx.fill();

    ctx.beginPath();
    samples.filter(s => s.e >= state.ea).forEach((s, i) => {
      const x = ox + (s.e / eMax) * w;
      const y = oy - (s.y / max) * h;
      if (i === 0) ctx.moveTo(x, oy);
      ctx.lineTo(x, y);
    });
    ctx.lineTo(ox + w, oy);
    ctx.closePath();
    ctx.fillStyle = "rgba(249,115,22,.42)"; ctx.fill();

    ctx.beginPath();
    samples.forEach((s, i) => {
      const x = ox + (s.e / eMax) * w;
      const y = oy - (s.y / max) * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 3; ctx.stroke();

    ctx.strokeStyle = "#f97316"; ctx.lineWidth = 3; ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(barrierX, oy); ctx.lineTo(barrierX, oy - h); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#fed7aa"; ctx.fillText("Ea", barrierX - 8, oy - h - 8);

    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Arrhenius: temperatura, barrera de activación y velocidad", 24, 30);
    readout.innerHTML = `k = A·exp(-Ea/RT) = ${k.toExponential(3)}<br>Fracción reactiva aproximada: ${(reactive * 100).toExponential(2)}%. Zona naranja: moléculas sobre Ea.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountArrheniusEquationPlugin;
