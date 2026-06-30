export function mountQuantumCommutatorPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { mode: "compare", phase: 0 };
  let raf = 0;

  root.classList.add("quantum-commutator-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(310 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <button type="button" data-mode="xp">X luego P</button>
    <button type="button" data-mode="px">P luego X</button>
    <button type="button" data-mode="compare">Comparar</button>
  `;
  controls.addEventListener("click", onClick);

  function onClick(event) {
    const mode = event.target.dataset.mode;
    if (!mode) return;
    state.mode = mode;
    updateButtons();
    draw();
  }

  function updateButtons() {
    controls.querySelectorAll("[data-mode]").forEach(btn => btn.classList.toggle("active", btn.dataset.mode === state.mode));
  }

  function curveY(x, order) {
    const cx = 410, cy = 160;
    const dx = x - cx;
    const env = Math.exp(-(dx * dx) / 26000);
    const shift = order === "xp" ? 0 : 0.75;
    const amp = order === "xp" ? dx * 0.28 : dx * 0.28 + 18;
    return cy - env * Math.sin(dx * 0.055 + shift + state.phase) * amp;
  }

  function drawCurve(order, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 50; x <= 770; x += 2) {
      const y = curveY(x, order);
      if (x === 50) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, 820, 310);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 820, 310);
    ctx.strokeStyle = "rgba(148,163,184,.25)";
    ctx.beginPath(); ctx.moveTo(45, 160); ctx.lineTo(775, 160); ctx.stroke();

    if (state.mode === "xp" || state.mode === "compare") drawCurve("xp", "#3b82f6");
    if (state.mode === "px" || state.mode === "compare") drawCurve("px", "#ef4444");
    if (state.mode === "compare") {
      ctx.strokeStyle = "rgba(234,179,8,.65)";
      ctx.setLineDash([5, 5]);
      for (let x = 115; x <= 705; x += 80) {
        ctx.beginPath(); ctx.moveTo(x, curveY(x, "xp")); ctx.lineTo(x, curveY(x, "px")); ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Conmutador: el orden operativo cambia el resultado", 24, 30);
    const text = state.mode === "compare" ? "Comparación: XP y PX no coinciden." : state.mode === "xp" ? "Orden: P(Xψ)." : "Orden: X(Pψ).";
    readout.innerHTML = `${text}<br>[X,P] = XP - PX = iℏ: la diferencia no desaparece.`;
  }

  function loop() { state.phase += 0.01; draw(); raf = requestAnimationFrame(loop); }
  updateButtons(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("click", onClick); };
}

export default mountQuantumCommutatorPlugin;
