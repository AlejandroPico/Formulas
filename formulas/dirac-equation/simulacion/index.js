export function mountDiracEquationPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const modes = {
    electronUp: { label: "e−", name: "Electrón · spin arriba", color: "#3b82f6", spin: -1, spinor: "[1, 0, 0, 0]^T" },
    electronDown: { label: "e−", name: "Electrón · spin abajo", color: "#3b82f6", spin: 1, spinor: "[0, 1, 0, 0]^T" },
    positron: { label: "e+", name: "Positrón · antimateria", color: "#ec4899", spin: -1, spinor: "[0, 0, 1, 0]^T" }
  };
  const state = { mode: "electronUp", angle: 0, paused: false };
  let raf = 0;

  root.classList.add("dirac-equation-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(300 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <button type="button" data-mode="electronUp">Electrón ↑</button>
    <button type="button" data-mode="electronDown">Electrón ↓</button>
    <button type="button" data-mode="positron">Positrón</button>
    <button type="button" data-action="pause">Pausar</button>
  `;
  controls.addEventListener("click", onClick);

  function onClick(event) {
    const mode = event.target.dataset.mode;
    if (mode) state.mode = mode;
    if (event.target.dataset.action === "pause") {
      state.paused = !state.paused;
      event.target.textContent = state.paused ? "Reanudar" : "Pausar";
    }
    updateButtons();
  }

  function updateButtons() {
    controls.querySelectorAll("[data-mode]").forEach(btn => btn.classList.toggle("active", btn.dataset.mode === state.mode));
  }

  function arrow(x1, y1, x2, y2, color) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.save(); ctx.translate(x2, y2); ctx.rotate(a);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-10, -6); ctx.lineTo(-10, 6); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function draw() {
    if (!state.paused) state.angle += 0.035;
    const mode = modes[state.mode];
    const cx = 380, cy = 150;
    ctx.clearRect(0, 0, 760, 300);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 760, 300);

    ctx.strokeStyle = mode.color; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.05) {
      const r = 64 + Math.sin(a * 4 + state.angle * 2) * 9;
      const x = cx + Math.cos(a + state.angle * 0.2) * r;
      const y = cy + Math.sin(a) * r * 0.58;
      if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = mode.color; ctx.shadowBlur = 18; ctx.shadowColor = mode.color;
    ctx.beginPath(); ctx.arc(cx, cy, 24, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff"; ctx.font = "800 15px system-ui"; ctx.textAlign = "center"; ctx.fillText(mode.label, cx, cy + 5); ctx.textAlign = "left";
    arrow(cx, cy, cx, cy + mode.spin * 62, "#eab308");

    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Dirac: espín, espinores y antimateria", 24, 30);
    readout.innerHTML = `${mode.name}<br>Espinor didáctico: ψ = ${mode.spinor}. La ecuación permite soluciones de materia y antimateria.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateButtons(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("click", onClick); };
}

export default mountDiracEquationPlugin;
