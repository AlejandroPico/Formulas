export function mountMichaelisMentenKineticsPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { enzymes: [], particles: [], products: 0, paused: false, vmax: 1.0, km: 35 };
  let raf = 0;

  root.classList.add("michaelis-menten-kinetics-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(360 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Km <strong data-out="km">35</strong><input data-key="km" type="range" min="10" max="90" step="1" value="35"></label>
    <label>Vmax visual <strong data-out="vmax">1.0</strong><input data-key="vmax" type="range" min="0.4" max="2.0" step="0.1" value="1.0"></label>
    <button type="button" data-action="add">Inyectar sustrato (+15)</button>
    <button type="button" data-action="reset">Reiniciar</button>
    <button type="button" data-action="pause">Pausar</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function reset() {
    state.products = 0;
    state.particles = [];
    state.enzymes = Array.from({ length: 8 }, (_, i) => ({
      x: 70 + i * 70,
      y: 72 + (i % 2) * 70,
      occupied: false,
      timer: 0
    }));
    addSubstrate(25);
  }

  function addSubstrate(n = 15) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      state.particles.push({
        x: 42 + Math.random() * 520,
        y: 42 + Math.random() * 150,
        vx: Math.cos(a) * 2,
        vy: Math.sin(a) * 2,
        product: false,
        remove: false
      });
    }
  }

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
  }

  function onClick(event) {
    const action = event.target.dataset.action;
    if (action === "add") addSubstrate(15);
    if (action === "reset") reset();
    if (action === "pause") {
      state.paused = !state.paused;
      event.target.textContent = state.paused ? "Reanudar" : "Pausar";
    }
  }

  function updateLabels() {
    controls.querySelector('[data-out="km"]').textContent = state.km.toFixed(0);
    controls.querySelector('[data-out="vmax"]').textContent = state.vmax.toFixed(1);
  }

  function step() {
    const left = 25, right = 600, top = 35, bottom = 205;
    state.enzymes.forEach(e => {
      if (!e.occupied) return;
      e.timer -= 1;
      if (e.timer <= 0) {
        e.occupied = false;
        state.products += 1;
        const a = Math.random() * Math.PI * 2;
        state.particles.push({ x: e.x, y: e.y, vx: Math.cos(a) * 2.7, vy: Math.sin(a) * 2.7, product: true, remove: false });
      }
    });
    state.particles.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < left || s.x > right) { s.vx *= -1; s.x = Math.max(left, Math.min(right, s.x)); }
      if (s.y < top || s.y > bottom) { s.vy *= -1; s.y = Math.max(top, Math.min(bottom, s.y)); }
      if (s.product) return;
      for (const e of state.enzymes) {
        if (!e.occupied && Math.hypot(s.x - e.x, s.y - e.y) < 17) {
          e.occupied = true;
          e.timer = Math.max(25, 95 / state.vmax);
          s.remove = true;
          break;
        }
      }
    });
    state.particles = state.particles.filter(s => !s.remove).slice(-180);
  }

  function drawCurve() {
    const ox = 640, oy = 305, w = 150, h = 115;
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy - h); ctx.lineTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const S = x / w * 110;
      const v = state.vmax * S / (state.km + S);
      const y = oy - (v / 2.0) * h;
      if (x === 0) ctx.moveTo(ox + x, y); else ctx.lineTo(ox + x, y);
    }
    ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 3; ctx.stroke();
    const freeS = state.particles.filter(p => !p.product).length;
    const px = ox + Math.min(110, freeS) / 110 * w;
    const vv = state.vmax * freeS / (state.km + freeS);
    const py = oy - (vv / 2.0) * h;
    ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#cbd5e1"; ctx.font = "800 11px system-ui";
    ctx.fillText("v", ox - 14, oy - h + 4); ctx.fillText("[S]", ox + w - 18, oy + 16);
  }

  function draw() {
    if (!state.paused) step();
    const freeS = state.particles.filter(p => !p.product).length;
    const complex = state.enzymes.filter(e => e.occupied).length;
    const v = state.vmax * freeS / (state.km + freeS);
    ctx.clearRect(0, 0, 820, 360);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 360);
    ctx.strokeStyle = "#334155"; ctx.strokeRect(25, 35, 575, 170);

    state.enzymes.forEach(e => {
      ctx.beginPath();
      ctx.arc(e.x, e.y, 14, 0.18 * Math.PI, 1.82 * Math.PI, false);
      ctx.lineTo(e.x, e.y); ctx.closePath();
      ctx.fillStyle = e.occupied ? "#e2e8f0" : "#f43f5e"; ctx.fill();
    });
    state.particles.forEach(s => {
      ctx.fillStyle = s.product ? "#22c55e" : "#3b82f6";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.product ? 4 : 3.5, 0, Math.PI * 2); ctx.fill();
    });
    drawCurve();
    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Michaelis-Menten: saturación de enzimas por sustrato", 24, 24);
    readout.innerHTML = `[S] libre=${freeS} · [ES]=${complex} · productos=${state.products}<br>v = Vmax[S]/(Km+[S]) = ${v.toFixed(2)} unidades visuales. Saturación: ${complex}/${state.enzymes.length} enzimas ocupadas.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); reset(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountMichaelisMentenKineticsPlugin;
