export function mountPoissonEquationPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { rho: 50, showField: true };

  root.classList.add("poisson-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(430 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Densidad fuente rho <strong data-out="rho">50</strong><input data-key="rho" type="range" min="-100" max="100" step="5" value="50"></label>
    <button type="button" data-action="field">Campo: visible</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
    draw();
  }

  function onClick(event) {
    if (event.target.dataset.action !== "field") return;
    state.showField = !state.showField;
    event.target.textContent = `Campo: ${state.showField ? "visible" : "oculto"}`;
    draw();
  }

  function updateLabels() {
    controls.querySelector('[data-out="rho"]').textContent = String(state.rho);
  }

  function arrow(x, y, angle, len, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(len, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(len, 0); ctx.lineTo(len - 5, -3); ctx.lineTo(len - 5, 3); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function draw() {
    const cx = 380, cy = 215;
    const rho = state.rho;
    const abs = Math.abs(rho);
    const positive = rho >= 0;
    ctx.clearRect(0, 0, 760, 430);
    ctx.fillStyle = "#07111f";
    ctx.fillRect(0, 0, 760, 430);

    if (state.showField && abs > 0) {
      for (let x = 70; x < 710; x += 58) {
        for (let y = 54; y < 390; y += 58) {
          const dx = x - cx, dy = y - cy;
          const r = Math.hypot(dx, dy) || 1;
          const angle = Math.atan2(dy, dx) + (positive ? 0 : Math.PI);
          const len = Math.min(26, 7 + abs * 0.12 / Math.max(0.4, r / 120));
          arrow(x, y, angle, len, positive ? "rgba(239,68,68,.48)" : "rgba(59,130,246,.48)");
        }
      }
    }

    const rings = 8;
    for (let i = 1; i <= rings; i++) {
      const r = 22 + i * (14 + abs * 0.18);
      if (r > 210) break;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = positive ? `rgba(239,68,68,${0.78 - i * 0.07})` : `rgba(59,130,246,${0.78 - i * 0.07})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (abs > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, 13 + abs * 0.14, 0, Math.PI * 2);
      ctx.fillStyle = positive ? "#ef4444" : "#3b82f6";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "800 18px system-ui";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(positive ? "+" : "−", cx, cy);
    }
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "700 14px system-ui";
    ctx.fillText("∇²φ = fuente: la curvatura del potencial sigue a rho", 24, 30);

    if (rho === 0) readout.innerHTML = "rho = 0: ∇²φ = 0. Caso de Laplace sin fuente interna.";
    else readout.innerHTML = `rho = ${rho}; signo ${positive ? "positivo" : "negativo"}. La fuente curva el potencial y orienta el campo.`;
  }

  updateLabels();
  draw();
  return () => { controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountPoissonEquationPlugin;
