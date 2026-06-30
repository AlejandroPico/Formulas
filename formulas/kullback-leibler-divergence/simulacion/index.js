export function mountKullbackLeiblerDivergencePlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { muQ: 50, sigmaQ: 32 };

  root.classList.add("kullback-leibler-divergence-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Desplazamiento de Q <strong data-out="muQ">50</strong><input data-key="muQ" type="range" min="-140" max="140" step="1" value="50"></label>
    <label>Anchura de Q <strong data-out="sigmaQ">32</strong><input data-key="sigmaQ" type="range" min="18" max="70" step="1" value="32"></label>
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
    controls.querySelector('[data-out="muQ"]').textContent = state.muQ.toFixed(0);
    controls.querySelector('[data-out="sigmaQ"]').textContent = state.sigmaQ.toFixed(0);
  }

  function normal(x, mu, sigma) {
    return Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
  }

  function drawCurve(mu, sigma, color) {
    const ox = 70, oy = 270, w = 690, h = 210;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const x = px - w / 2;
      const y = oy - normal(x, mu, sigma) * h * 82;
      if (px === 0) ctx.moveTo(ox + px, y); else ctx.lineTo(ox + px, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function draw() {
    const ox = 70, oy = 270, w = 690, h = 210;
    const muP = 0, sigmaP = 32;
    let kl = 0;
    const dx = 1;
    for (let px = 0; px <= w; px++) {
      const x = px - w / 2;
      const p = normal(x, muP, sigmaP) + 1e-12;
      const q = normal(x, state.muQ, state.sigmaQ) + 1e-12;
      kl += p * Math.log(p / q) * dx;
    }

    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();

    drawCurve(muP, sigmaP, "#3b82f6");
    drawCurve(state.muQ, state.sigmaQ, "#ef4444");

    ctx.fillStyle = "#0f172a";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Divergencia KL: pérdida al aproximar P mediante Q", 24, 30);
    ctx.fillStyle = "#3b82f6"; ctx.fillText("P objetivo", 80, 60);
    ctx.fillStyle = "#ef4444"; ctx.fillText("Q aproximación", 178, 60);
    const note = kl < 0.02 ? "Distribuciones casi idénticas." : "La aproximación Q ya introduce pérdida de información.";
    readout.innerHTML = `D_KL(P||Q) ≈ ${Math.max(0, kl).toFixed(3)} nats<br>${note} Cambiar orden daría otra divergencia.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountKullbackLeiblerDivergencePlugin;
