export function mountOhmsLawPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { voltage: 9, resistance: 25, electrons: Array.from({ length: 32 }, () => Math.random() * 1000) };
  let raf = 0;

  root.classList.add("ohm-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(330 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Voltaje V <strong data-out="voltage">9</strong> V<input data-key="voltage" type="range" min="1" max="24" step="1" value="9"></label>
    <label>Resistencia R <strong data-out="resistance">25</strong> ohm<input data-key="resistance" type="range" min="2" max="80" step="1" value="25"></label>
  `;
  controls.addEventListener("input", onInput);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
  }

  function updateLabels() {
    controls.querySelector('[data-out="voltage"]').textContent = state.voltage.toFixed(0);
    controls.querySelector('[data-out="resistance"]').textContent = state.resistance.toFixed(0);
  }

  function pointOnLoop(p) {
    if (p < 560) return { x: 100 + p, y: 75 };
    if (p < 720) return { x: 660, y: 75 + (p - 560) };
    if (p < 1280) return { x: 660 - (p - 720), y: 235 };
    return { x: 100, y: 235 - (p - 1280) };
  }

  function resistor(x, y, w, h, heat) {
    const glow = Math.min(0.7, heat / 80);
    ctx.fillStyle = `rgba(249,115,22,${0.55 + glow})`;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#fed7aa"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#fff7ed"; ctx.font = "800 12px system-ui"; ctx.fillText("R", x + w / 2 - 4, y + h / 2 + 4);
  }

  function draw() {
    const I = state.voltage / state.resistance;
    const P = state.voltage * I;
    ctx.clearRect(0, 0, 760, 330);
    ctx.fillStyle = "#07111f"; ctx.fillRect(0, 0, 760, 330);

    ctx.strokeStyle = "#334155"; ctx.lineWidth = 13;
    ctx.strokeRect(100, 75, 560, 160);
    resistor(330, 57, 100, 36, P);
    ctx.fillStyle = "#ef4444"; ctx.fillRect(365, 217, 30, 36);
    ctx.fillStyle = "#f8fafc"; ctx.font = "800 13px system-ui"; ctx.fillText("+", 372, 212); ctx.fillText("-", 385, 270);

    const speed = Math.max(0.2, I * 8);
    ctx.fillStyle = "#facc15";
    state.electrons.forEach((pos, i) => {
      state.electrons[i] = (pos + speed) % 1440;
      const p = pointOnLoop(state.electrons[i]);
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Ley de Ohm: V = I R", 24, 30);
    ctx.fillStyle = "#22c55e"; ctx.fillText(`I = ${I.toFixed(2)} A`, 500, 40);
    ctx.fillStyle = "#fb923c"; ctx.fillText(`P = ${P.toFixed(2)} W`, 500, 62);
    readout.innerHTML = `I = V / R = ${state.voltage.toFixed(0)} / ${state.resistance.toFixed(0)} = ${I.toFixed(3)} A<br>P = V · I = ${P.toFixed(3)} W. Mas potencia implica mas disipacion en la resistencia.`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels();
  loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); };
}

export default mountOhmsLawPlugin;
