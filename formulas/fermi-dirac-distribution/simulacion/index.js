export function mountFermiDiracDistributionPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { temp: 0.08, ef: 0.5 };

  root.classList.add("fermi-dirac-distribution-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Temperatura T <strong data-out="temp">0.08</strong><input data-key="temp" type="range" min="0" max="0.35" step="0.01" value="0.08"></label>
    <label>Energía de Fermi E_F <strong data-out="ef">0.50</strong><input data-key="ef" type="range" min="0.25" max="0.75" step="0.01" value="0.50"></label>
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
    controls.querySelector('[data-out="temp"]').textContent = state.temp.toFixed(2);
    controls.querySelector('[data-out="ef"]').textContent = state.ef.toFixed(2);
  }

  function fermi(E) {
    if (state.temp <= 0.001) return E <= state.ef ? 1 : 0;
    return 1 / (Math.exp((E - state.ef) / state.temp) + 1);
  }

  function draw() {
    const ox = 70, oy = 285, w = 690, h = 225;
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 820, 340);

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy - h); ctx.lineTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();
    ctx.fillStyle = "#64748b";
    ctx.font = "800 12px system-ui";
    ctx.fillText("f(E)", ox - 44, oy - h + 6);
    ctx.fillText("E", ox + w - 10, oy + 22);
    ctx.fillText("1", ox - 22, oy - h + 5);
    ctx.fillText("0", ox - 22, oy + 5);

    const efX = ox + state.ef * w;
    ctx.strokeStyle = "#cbd5e1";
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(efX, oy); ctx.lineTo(efX, oy - h); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#64748b"; ctx.fillText("E_F", efX - 12, oy + 22);

    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const E = px / w;
      const y = oy - fermi(E) * h;
      if (px === 0) ctx.moveTo(ox + px, oy); 
      ctx.lineTo(ox + px, y);
    }
    ctx.lineTo(ox + w, oy);
    ctx.closePath();
    ctx.fillStyle = "rgba(239,68,68,.18)";
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    for (let px = 0; px <= w; px++) {
      const E = px / w;
      const y = oy - fermi(E) * h;
      if (px === 0) ctx.moveTo(ox + px, y); else ctx.lineTo(ox + px, y);
    }
    ctx.stroke();

    ctx.fillStyle = "#0f172a";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Fermi-Dirac: ocupación limitada por exclusión de Pauli", 24, 30);
    const regime = state.temp <= 0.001 ? "T≈0: escalón de Fermi casi perfecto." : "T>0: la frontera se suaviza por excitación térmica.";
    readout.innerHTML = `f(E_F) = ${fermi(state.ef).toFixed(2)} · ${regime}<br>Área roja: estados ocupados de forma media.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountFermiDiracDistributionPlugin;
