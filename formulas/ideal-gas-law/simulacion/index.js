export function mountIdealGasLawPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { volume: 0.75, temp: 300, moles: 1.0, paused: false, particles: [] };
  let raf = 0;

  root.classList.add("ideal-gas-law-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Volumen V <strong data-out="volume">75</strong>%<input data-key="volume" type="range" min="0.35" max="1" step="0.01" value="0.75"></label>
    <label>Temperatura T <strong data-out="temp">300</strong> K<input data-key="temp" type="range" min="150" max="700" step="10" value="300"></label>
    <label>Cantidad n <strong data-out="moles">1.0</strong> mol<input data-key="moles" type="range" min="0.4" max="2.0" step="0.1" value="1.0"></label>
    <button type="button" data-action="pause">Pausar</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function initParticles() {
    state.particles = Array.from({ length: 54 }, () => {
      const a = Math.random() * Math.PI * 2;
      return { x: 80 + Math.random() * 660, y: 150 + Math.random() * 120, vx: Math.cos(a), vy: Math.sin(a) };
    });
  }

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
  }

  function onClick(event) {
    if (event.target.dataset.action !== "pause") return;
    state.paused = !state.paused;
    event.target.textContent = state.paused ? "Reanudar" : "Pausar";
  }

  function updateLabels() {
    controls.querySelector('[data-out="volume"]').textContent = Math.round(state.volume * 100);
    controls.querySelector('[data-out="temp"]').textContent = state.temp.toFixed(0);
    controls.querySelector('[data-out="moles"]').textContent = state.moles.toFixed(1);
  }

  function draw() {
    const left = 60, right = 760, bottom = 290;
    const height = 85 + state.volume * 185;
    const top = bottom - height;
    const count = Math.round(30 * state.moles);
    const pressure = state.moles * 8.314 * state.temp / Math.max(0.2, state.volume);
    const speed = Math.sqrt(state.temp / 300) * 2.4;

    if (!state.paused) {
      state.particles.forEach((p, i) => {
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        if (p.x < left + 7 || p.x > right - 7) { p.vx *= -1; p.x = Math.max(left + 7, Math.min(right - 7, p.x)); }
        if (p.y < top + 7 || p.y > bottom - 7) { p.vy *= -1; p.y = Math.max(top + 7, Math.min(bottom - 7, p.y)); }
      });
    }

    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 340);
    ctx.fillStyle = "rgba(56,189,248,.08)"; ctx.fillRect(left, top, right - left, bottom - top);
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 4; ctx.strokeRect(left, top, right - left, bottom - top);
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(left - 10, top); ctx.lineTo(right + 10, top); ctx.stroke();

    state.particles.slice(0, count).forEach(p => {
      if (p.y < top + 7) p.y = top + 8;
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Gas ideal: presión por choques contra el pistón", 24, 30);
    readout.innerHTML = `P visual = nRT/V = ${pressure.toFixed(0)} unidades<br>n=${state.moles.toFixed(1)} mol · T=${state.temp.toFixed(0)} K · V=${Math.round(state.volume * 100)}%.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  initParticles(); updateLabels(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountIdealGasLawPlugin;
