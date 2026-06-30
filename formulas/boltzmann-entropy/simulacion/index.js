export function mountBoltzmannEntropyPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { particles: [], open: false, paused: false, n: 42 };
  let raf = 0;

  root.classList.add("boltzmann-entropy-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(320 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <button type="button" data-action="ordered">Estado ordenado</button>
    <button type="button" data-action="open">Abrir compuerta</button>
    <button type="button" data-action="mix">Mezcla aleatoria</button>
    <button type="button" data-action="pause">Pausar</button>
  `;
  controls.addEventListener("click", onClick);

  function reset(ordered = true) {
    state.open = !ordered;
    state.particles = Array.from({ length: state.n }, () => ({
      x: ordered ? 42 + Math.random() * 320 : 42 + Math.random() * 736,
      y: 58 + Math.random() * 210,
      vx: (Math.random() - 0.5) * 3.2,
      vy: (Math.random() - 0.5) * 3.2
    }));
  }

  function onClick(event) {
    const action = event.target.dataset.action;
    if (action === "ordered") reset(true);
    if (action === "open") state.open = true;
    if (action === "mix") reset(false);
    if (action === "pause") {
      state.paused = !state.paused;
      event.target.textContent = state.paused ? "Reanudar" : "Pausar";
    }
  }

  function logFactorial(n) {
    let s = 0;
    for (let i = 2; i <= n; i++) s += Math.log(i);
    return s;
  }

  function step() {
    const left = 36, right = 784, top = 48, bottom = 278, mid = 410;
    state.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < left || p.x > right) { p.vx *= -1; p.x = Math.max(left, Math.min(right, p.x)); }
      if (p.y < top || p.y > bottom) { p.vy *= -1; p.y = Math.max(top, Math.min(bottom, p.y)); }
      if (!state.open && p.x > mid - 8 && p.x < mid + 8) {
        if ((p.vx > 0 && p.x < mid) || (p.vx < 0 && p.x > mid)) p.vx *= -1;
      }
    });
  }

  function draw() {
    if (!state.paused) step();
    const mid = 410;
    let leftCount = 0;
    state.particles.forEach(p => { if (p.x < mid) leftCount++; });
    const rightCount = state.n - leftCount;
    const logW = logFactorial(state.n) - logFactorial(leftCount) - logFactorial(rightCount);

    ctx.clearRect(0, 0, 820, 320);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 320);
    ctx.strokeStyle = "#334155"; ctx.lineWidth = 3;
    ctx.strokeRect(36, 48, 748, 230);
    if (!state.open) { ctx.beginPath(); ctx.moveTo(mid, 48); ctx.lineTo(mid, 278); ctx.stroke(); }
    else { ctx.strokeStyle = "rgba(148,163,184,.25)"; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(mid, 48); ctx.lineTo(mid, 278); ctx.stroke(); ctx.setLineDash([]); }

    state.particles.forEach(p => {
      ctx.fillStyle = "#10b981";
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Boltzmann: S = kB ln W", 24, 30);
    readout.innerHTML = `Izq=${leftCount} · Der=${rightCount}<br>ln(W) = ${logW.toFixed(2)}; con kB=1, S visual = ${logW.toFixed(2)}.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  reset(true); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("click", onClick); };
}

export default mountBoltzmannEntropyPlugin;
