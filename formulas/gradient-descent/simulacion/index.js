export function mountGradientDescentPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { eta: 0.20, w: -4.0, running: false, history: [] };
  let raf = 0;
  let lastStep = 0;

  root.classList.add("gradient-descent-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Tasa de aprendizaje η <strong data-out="eta">0.20</strong><input data-key="eta" type="range" min="0.02" max="1.10" step="0.02" value="0.20"></label>
    <button type="button" data-action="start">Optimizar</button>
    <button type="button" data-action="step">Paso único</button>
    <button type="button" data-action="reset">Reiniciar</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function loss(w) { return w * w; }
  function gradient(w) { return 2 * w; }

  function reset() {
    state.w = -4;
    state.running = false;
    state.history = [{ w: state.w }];
  }

  function doStep() {
    const grad = gradient(state.w);
    state.w = state.w - state.eta * grad;
    state.history.push({ w: state.w });
    if (state.history.length > 60) state.history.shift();
    if (Math.abs(grad) < 0.01 || Math.abs(state.w) > 7) state.running = false;
  }

  function onInput(event) {
    if (event.target.dataset.key !== "eta") return;
    state.eta = Number(event.target.value);
    updateLabels();
  }

  function onClick(event) {
    const action = event.target.dataset.action;
    if (action === "start") state.running = true;
    if (action === "step") doStep();
    if (action === "reset") reset();
  }

  function updateLabels() {
    controls.querySelector('[data-out="eta"]').textContent = state.eta.toFixed(2);
  }

  function toScreen(w) {
    const cx = 410, originY = 285, sx = 70, sy = 13;
    return { x: cx + w * sx, y: originY - loss(w) * sy };
  }

  function draw() {
    const originY = 285;
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#334155"; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 70; px <= 750; px++) {
      const w = (px - 410) / 70;
      const y = originY - loss(w) * 13;
      if (px === 70) ctx.moveTo(px, y); else ctx.lineTo(px, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(56,189,248,.55)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    ctx.beginPath();
    state.history.forEach((pt, i) => {
      const p = toScreen(pt.w);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke(); ctx.setLineDash([]);
    state.history.forEach(pt => {
      const p = toScreen(pt.w);
      ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
    });
    const p = toScreen(state.w);
    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Descenso del gradiente sobre L(w)=w²", 24, 30);
    const grad = gradient(state.w);
    let msg = `w=${state.w.toFixed(3)} · ∇L=${grad.toFixed(3)} · L(w)=${loss(state.w).toFixed(4)}`;
    if (Math.abs(state.w) > 6) msg = "Divergencia: la tasa de aprendizaje es demasiado alta para esta función.";
    else if (Math.abs(grad) < 0.03) msg = "Convergencia: el peso está prácticamente en el mínimo global.";
    readout.innerHTML = `${msg}<br>Actualización: w siguiente = w - η∇L(w).`;
  }

  function loop(ts) {
    if (state.running && ts - lastStep > 250) { doStep(); lastStep = ts; }
    draw();
    raf = requestAnimationFrame(loop);
  }

  reset(); updateLabels(); loop(0);
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountGradientDescentPlugin;
