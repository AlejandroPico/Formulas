export function mountGibbsFreeEnergyPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { h: 20, s: 80, temp: 298 };

  root.classList.add("gibbs-free-energy-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(330 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>ΔH <strong data-out="h">20</strong> kJ<input data-key="h" type="range" min="-80" max="80" step="1" value="20"></label>
    <label>ΔS <strong data-out="s">80</strong> J/K<input data-key="s" type="range" min="-160" max="160" step="2" value="80"></label>
    <label>T <strong data-out="temp">298</strong> K<input data-key="temp" type="range" min="0" max="800" step="5" value="298"></label>
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
    controls.querySelector('[data-out="h"]').textContent = state.h.toFixed(0);
    controls.querySelector('[data-out="s"]').textContent = state.s.toFixed(0);
    controls.querySelector('[data-out="temp"]').textContent = state.temp.toFixed(0);
  }

  function drawScale(cx, cy, dg) {
    const angle = Math.max(-0.42, Math.min(0.42, dg * 0.012));
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + 58); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 34, cy + 58); ctx.lineTo(cx + 34, cy + 58); ctx.stroke();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-210, 0); ctx.lineTo(210, 0); ctx.stroke();
    ctx.fillStyle = dg < 0 ? "#22c55e" : "#f43f5e"; ctx.fillRect(-230, 24, 64, 8);
    ctx.fillStyle = dg >= 0 ? "#22c55e" : "#f43f5e"; ctx.fillRect(166, 24, 64, 8);
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-198, 0); ctx.lineTo(-230, 24); ctx.lineTo(-166, 24); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(198, 0); ctx.lineTo(166, 24); ctx.lineTo(230, 24); ctx.closePath(); ctx.stroke();
    ctx.restore();
  }

  function drawTempLine(dg) {
    const x0 = 80, y0 = 285, w = 680;
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + w, y0); ctx.stroke();
    const tx = x0 + (state.temp / 800) * w;
    ctx.strokeStyle = dg < 0 ? "#22c55e" : "#f43f5e";
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(tx, y0 - 18); ctx.lineTo(tx, y0 + 18); ctx.stroke();
    if (state.s !== 0) {
      const tc = (state.h * 1000) / state.s;
      if (tc >= 0 && tc <= 800) {
        const cx = x0 + (tc / 800) * w;
        ctx.strokeStyle = "#eab308"; ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(cx, y0 - 28); ctx.lineTo(cx, y0 + 28); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#92400e"; ctx.font = "800 11px system-ui"; ctx.fillText("Tcrit", cx - 16, y0 - 34);
      }
    }
  }

  function draw() {
    const dg = state.h - state.temp * (state.s / 1000);
    ctx.clearRect(0, 0, 820, 330);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, 820, 330);
    ctx.fillStyle = "#0f172a"; ctx.font = "800 14px system-ui";
    ctx.fillText("Gibbs: ΔG = ΔH - TΔS", 24, 30);
    ctx.fillStyle = "#22c55e"; ctx.fillText("ESPONTÁNEO ΔG<0", 38, 62);
    ctx.fillStyle = "#f43f5e"; ctx.fillText("NO ESPONTÁNEO ΔG>0", 622, 62);
    drawScale(410, 140, dg);
    drawTempLine(dg);
    const tcrit = state.s === 0 ? "sin umbral" : `${((state.h * 1000) / state.s).toFixed(0)} K`;
    readout.innerHTML = `ΔG = ${state.h.toFixed(0)} - ${state.temp.toFixed(0)}·(${(state.s / 1000).toFixed(3)}) = ${dg.toFixed(2)} kJ<br>${dg < 0 ? "Proceso termodinámicamente favorable." : dg > 0 ? "No espontáneo en estas condiciones." : "Equilibrio: ΔG = 0."} Tcrit ≈ ${tcrit}.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountGibbsFreeEnergyPlugin;
