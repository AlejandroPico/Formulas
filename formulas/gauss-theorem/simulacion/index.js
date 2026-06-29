export function mountGaussTheoremPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { radius: 115, strength: 1.3, sign: 1 };

  root.classList.add("gauss-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(430 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Radio R <strong data-out="radius">115</strong><input data-key="radius" type="range" min="45" max="175" step="5" value="115"></label>
    <label>Divergencia <strong data-out="strength">1.30</strong><input data-key="strength" type="range" min="0" max="3" step="0.1" value="1.3"></label>
    <button type="button" data-action="sign">Fuente positiva</button>
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
    if (event.target.dataset.action !== "sign") return;
    state.sign *= -1;
    event.target.textContent = state.sign > 0 ? "Fuente positiva" : "Sumidero negativo";
    draw();
  }

  function updateLabels() {
    controls.querySelector('[data-out="radius"]').textContent = state.radius.toFixed(0);
    controls.querySelector('[data-out="strength"]').textContent = state.strength.toFixed(2);
  }

  function arrow(x, y, angle, len, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(len, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(len, 0); ctx.lineTo(len - 5, -3); ctx.lineTo(len - 5, 3); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function draw() {
    const cx = 380, cy = 210;
    ctx.clearRect(0, 0, 760, 430);
    ctx.fillStyle = "#07111f";
    ctx.fillRect(0, 0, 760, 430);

    for (let x = 55; x < 730; x += 48) {
      for (let y = 45; y < 395; y += 48) {
        const dx = x - cx, dy = y - cy;
        const r = Math.hypot(dx, dy) || 1;
        const angle = Math.atan2(dy, dx) + (state.sign < 0 ? Math.PI : 0);
        const len = Math.min(28, 5 + state.strength * r * 0.035);
        arrow(x, y, angle, len, state.sign > 0 ? "rgba(56,189,248,.55)" : "rgba(248,113,113,.55)");
      }
    }

    ctx.beginPath();
    ctx.arc(cx, cy, state.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(244,63,94,.08)";
    ctx.fill();
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    const div = state.sign * state.strength * 2;
    const area = Math.PI * state.radius * state.radius / 1000;
    const flux = div * area;
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "700 14px system-ui";
    ctx.fillText("Flujo por frontera cerrada = divergencia acumulada", 24, 30);
    readout.innerHTML = `div F = ${div.toFixed(2)}; área encerrada escalada = ${area.toFixed(2)}<br>Flujo neto ≈ ${flux.toFixed(2)}. ${flux >= 0 ? "Sale flujo neto de la superficie." : "Entra flujo neto hacia la superficie."}`;
  }

  updateLabels();
  draw();
  return () => { controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountGaussTheoremPlugin;
