export function mountBlackScholesModelPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { sigma: 25, strike: 60, maturity: 0.5 };

  root.classList.add("black-scholes-model-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Volatilidad σ <strong data-out="sigma">25</strong>%<input data-key="sigma" type="range" min="10" max="70" step="1" value="25"></label>
    <label>Strike K <strong data-out="strike">60</strong><input data-key="strike" type="range" min="30" max="100" step="1" value="60"></label>
    <label>Vencimiento T <strong data-out="maturity">0.5</strong> años<input data-key="maturity" type="range" min="0.1" max="2.0" step="0.1" value="0.5"></label>
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
    controls.querySelector('[data-out="sigma"]').textContent = state.sigma.toFixed(0);
    controls.querySelector('[data-out="strike"]').textContent = state.strike.toFixed(0);
    controls.querySelector('[data-out="maturity"]').textContent = state.maturity.toFixed(1);
  }

  function normalCDF(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x >= 0 ? 1 - p : p;
  }

  function callPrice(S) {
    const K = state.strike;
    const T = state.maturity;
    const r = 0.05;
    const sigma = state.sigma / 100;
    const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  }

  function draw() {
    const ox = 70, oy = 285, w = 690, h = 220;
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy - h); ctx.lineTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();
    ctx.fillStyle = "#64748b"; ctx.font = "800 12px system-ui";
    ctx.fillText("S", ox + w - 8, oy + 20);
    ctx.fillText("Call", ox - 42, oy - h + 8);

    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const S = 10 + (px / w) * 130;
      const price = callPrice(S);
      const y = oy - Math.min(1, price / 80) * h;
      if (px === 0) ctx.moveTo(ox + px, y); else ctx.lineTo(ox + px, y);
    }
    ctx.strokeStyle = "#2563eb"; ctx.lineWidth = 3; ctx.stroke();

    const strikeX = ox + ((state.strike - 10) / 130) * w;
    ctx.strokeStyle = "#ef4444"; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(strikeX, oy); ctx.lineTo(strikeX, oy - h); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#991b1b"; ctx.fillText(`K=${state.strike.toFixed(0)}`, strikeX + 6, oy - h + 16);

    ctx.fillStyle = "#0f172a"; ctx.font = "800 14px system-ui";
    ctx.fillText("Black-Scholes: precio de una call europea", 24, 30);
    const atMoney = callPrice(state.strike);
    readout.innerHTML = `Call ATM aproximada: ${atMoney.toFixed(2)} · σ=${state.sigma.toFixed(0)}% · T=${state.maturity.toFixed(1)} años<br>A mayor volatilidad, mayor valor temporal de la opción.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountBlackScholesModelPlugin;
