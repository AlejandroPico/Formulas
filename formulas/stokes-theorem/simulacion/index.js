export function mountStokesTheoremPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { curl: 1.4, radius: 95, particles: [] };
  let raf = 0;

  root.classList.add("stokes-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(430 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  for (let i = 0; i < 70; i++) state.particles.push({ r: 20 + Math.random() * 170, a: Math.random() * Math.PI * 2 });

  controls.innerHTML = `
    <label>Rotacional <strong data-out="curl">1.40</strong><input data-key="curl" type="range" min="0" max="3" step="0.1" value="1.4"></label>
    <label>Radio del borde <strong data-out="radius">95</strong><input data-key="radius" type="range" min="45" max="150" step="5" value="95"></label>
  `;
  controls.addEventListener("input", onInput);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
  }

  function updateLabels() {
    controls.querySelector('[data-out="curl"]').textContent = state.curl.toFixed(2);
    controls.querySelector('[data-out="radius"]').textContent = state.radius.toFixed(0);
  }

  function arrowHead(x, y, angle, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-9, -5); ctx.lineTo(-9, 5); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function draw() {
    const cx = 380, cy = 215;
    ctx.clearRect(0, 0, 760, 430);
    ctx.fillStyle = "#07111f";
    ctx.fillRect(0, 0, 760, 430);

    state.particles.forEach(p => {
      p.a += state.curl * 0.012 * (90 / (p.r + 30));
      const x = cx + Math.cos(p.a) * p.r;
      const y = cy + Math.sin(p.a) * p.r;
      const t = p.a + Math.PI / 2;
      ctx.strokeStyle = "rgba(168,85,247,.42)";
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(t) * 15, y + Math.sin(t) * 15); ctx.stroke();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, state.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(16,185,129,.06)";
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
      arrowHead(cx + Math.cos(a) * state.radius, cy + Math.sin(a) * state.radius, a + Math.PI / 2, "#10b981");
    }

    const area = Math.PI * state.radius * state.radius / 10000;
    const circulation = state.curl * area;
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "700 14px system-ui";
    ctx.fillText("Circulación del borde = rotacional acumulado en la superficie", 24, 30);
    readout.innerHTML = `rotacional = ${state.curl.toFixed(2)}; área escalada = ${area.toFixed(2)}<br>Integral de línea ≈ ${circulation.toFixed(3)}. La frontera mide el giro interior acumulado.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels();
  loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); };
}

export default mountStokesTheoremPlugin;
