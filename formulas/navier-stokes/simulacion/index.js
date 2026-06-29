export function mountNavierStokesPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { mu: 1.4, u: 2.5, r: 34, t: 0, pts: [] };
  let raf = 0;

  root.classList.add("navier-stokes-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(360 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  for (let i = 0; i < 110; i++) state.pts.push(makePoint(Math.random() * 820));

  controls.innerHTML = `
    <label>Viscosidad <strong data-out="mu">1.4</strong><input data-key="mu" type="range" min="0.5" max="3.2" step="0.1" value="1.4"></label>
    <label>Velocidad <strong data-out="u">2.5</strong><input data-key="u" type="range" min="0.7" max="5" step="0.1" value="2.5"></label>
    <label>Radio <strong data-out="r">34</strong><input data-key="r" type="range" min="20" max="56" step="2" value="34"></label>
  `;
  controls.addEventListener("input", onInput);

  function makePoint(x = -10) {
    return { x, y: 20 + Math.random() * 320, a: Math.random() * 6.28, s: 0.75 + Math.random() * 0.6 };
  }

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
  }

  function updateLabels() {
    controls.querySelector('[data-out="mu"]').textContent = state.mu.toFixed(1);
    controls.querySelector('[data-out="u"]').textContent = state.u.toFixed(1);
    controls.querySelector('[data-out="r"]').textContent = state.r.toFixed(0);
  }

  function draw() {
    const cx = 260, cy = 180;
    const re = state.u * state.r * 42 / state.mu;
    const wiggle = Math.min(1.25, re / 210);
    state.t += 0.035;
    ctx.clearRect(0, 0, 820, 360);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 820, 360);

    state.pts.forEach((p, i) => {
      p.x += state.u * p.s;
      const dx = p.x - cx;
      const dy = p.y - cy;
      const d = Math.hypot(dx, dy) || 1;
      if (d < state.r + 44 && p.x < cx + state.r + 18) {
        p.y += Math.sign(dy || 1) * (state.r + 44 - d) * 0.055 / state.mu;
      }
      let yy = p.y;
      if (p.x > cx + state.r) {
        const q = p.x - cx - state.r;
        const fade = Math.max(0, 1 - q / 430);
        const band = Math.max(0, 1 - Math.abs(dy) / 95);
        yy += Math.sin(q * 0.07 - state.t * 8 + p.a) * 18 * wiggle * fade * band;
      }
      if (p.x > 840 || p.y < -30 || p.y > 390) state.pts[i] = makePoint(-10);
      ctx.fillStyle = "rgba(56,189,248,.62)";
      ctx.beginPath();
      ctx.arc(p.x, yy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, state.r, 0, Math.PI * 2);
    ctx.fillStyle = "#f43f5e";
    ctx.fill();
    ctx.strokeStyle = "#fecdd3";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Navier-Stokes: flujo visual alrededor de un cilindro", 24, 30);
    readout.innerHTML = `Re visual ≈ ${re.toFixed(0)}<br>Mayor viscosidad suaviza el flujo; mayor velocidad aumenta la estela.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels();
  loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); };
}

export default mountNavierStokesPlugin;
