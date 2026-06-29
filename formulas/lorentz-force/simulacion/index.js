export function mountLorentzForcePlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { q: -1, b: 1.4, e: 0, speed: 4.5, active: false, x: 50, y: 180, vx: 4.5, vy: 0, path: [] };
  let raf = 0;

  root.classList.add("lorentz-force-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(360 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Carga q <strong data-out="q">-1</strong><input data-key="q" type="range" min="-1" max="1" step="2" value="-1"></label>
    <label>Campo B <strong data-out="b">1.4</strong><input data-key="b" type="range" min="0.1" max="3" step="0.1" value="1.4"></label>
    <label>Campo E vertical <strong data-out="e">0.0</strong><input data-key="e" type="range" min="-1.6" max="1.6" step="0.1" value="0"></label>
    <label>Velocidad inicial <strong data-out="speed">4.5</strong><input data-key="speed" type="range" min="2" max="8" step="0.2" value="4.5"></label>
    <button type="button" data-action="fire">Disparar</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
  }

  function onClick(event) {
    if (event.target.dataset.action === "fire") fire();
  }

  function fire() {
    state.x = 50;
    state.y = 180;
    state.vx = state.speed;
    state.vy = 0;
    state.path = [];
    state.active = true;
  }

  function updateLabels() {
    controls.querySelector('[data-out="q"]').textContent = state.q > 0 ? "+1" : "-1";
    controls.querySelector('[data-out="b"]').textContent = state.b.toFixed(1);
    controls.querySelector('[data-out="e"]').textContent = state.e.toFixed(1);
    controls.querySelector('[data-out="speed"]').textContent = state.speed.toFixed(1);
  }

  function drawField() {
    ctx.strokeStyle = "rgba(168,85,247,.18)";
    ctx.lineWidth = 1.5;
    for (let x = 28; x < 805; x += 42) {
      for (let y = 38; y < 340; y += 42) {
        ctx.beginPath();
        ctx.moveTo(x - 5, y - 5);
        ctx.lineTo(x + 5, y + 5);
        ctx.moveTo(x + 5, y - 5);
        ctx.lineTo(x - 5, y + 5);
        ctx.stroke();
      }
    }
    if (Math.abs(state.e) > 0.05) {
      ctx.strokeStyle = "rgba(56,189,248,.55)";
      for (let x = 55; x < 790; x += 65) arrow(x, state.e > 0 ? 305 : 55, x, state.e > 0 ? 250 : 110, "rgba(56,189,248,.55)");
    }
  }

  function arrow(x1, y1, x2, y2, color) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.save(); ctx.translate(x2, y2); ctx.rotate(a);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-7, -4); ctx.lineTo(-7, 4); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function physics() {
    if (!state.active) return;
    const dt = 0.065;
    const ax = state.q * state.vy * state.b;
    const ay = state.q * (state.e - state.vx * state.b);
    state.vx += ax * dt;
    state.vy += ay * dt;
    state.x += state.vx * dt * 9;
    state.y += state.vy * dt * 9;
    state.path.push({ x: state.x, y: state.y });
    if (state.path.length > 420) state.path.shift();
    if (state.x < -20 || state.x > 850 || state.y < -30 || state.y > 390) state.active = false;
  }

  function draw() {
    physics();
    ctx.clearRect(0, 0, 820, 360);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 820, 360);
    drawField();

    ctx.strokeStyle = "rgba(234,179,8,.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    state.path.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    ctx.stroke();

    if (state.active) {
      ctx.fillStyle = state.q > 0 ? "#f97316" : "#eab308";
      ctx.beginPath(); ctx.arc(state.x, state.y, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.stroke();
      arrow(state.x, state.y, state.x + state.vx * 6, state.y + state.vy * 6, "#facc15");
    }

    const radius = Math.abs(state.q * state.b) > 0 ? state.speed / Math.abs(state.q * state.b) : Infinity;
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Fuerza de Lorentz: q(E + v x B)", 24, 30);
    readout.innerHTML = `Radio visual sin E ≈ ${Number.isFinite(radius) ? radius.toFixed(2) : "infinito"}<br>q=${state.q}; B=${state.b.toFixed(1)}; E=${state.e.toFixed(1)}. Cambia el signo de q para invertir la curvatura.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); fire(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountLorentzForcePlugin;
