export function mountEulerLagrangePlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { length: 145, gravity: 9.8, damping: 0.004, theta: Math.PI / 4, omega: 0, paused: false };
  let raf = 0;

  root.classList.add("el-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(420 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Longitud l <strong data-out="length">145</strong><input data-key="length" type="range" min="70" max="210" step="5" value="145"></label>
    <label>Gravedad g <strong data-out="gravity">9.8</strong><input data-key="gravity" type="range" min="1" max="25" step="0.2" value="9.8"></label>
    <label>Amortiguamiento <strong data-out="damping">0.004</strong><input data-key="damping" type="range" min="0" max="0.025" step="0.001" value="0.004"></label>
    <button type="button" data-action="reset">Reiniciar</button>
    <button type="button" data-action="pause">Pausar</button>
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
    const action = event.target.dataset.action;
    if (action === "reset") { state.theta = Math.PI / 4; state.omega = 0; }
    if (action === "pause") { state.paused = !state.paused; event.target.textContent = state.paused ? "Reanudar" : "Pausar"; }
  }

  function updateLabels() {
    controls.querySelector('[data-out="length"]').textContent = state.length.toFixed(0);
    controls.querySelector('[data-out="gravity"]').textContent = state.gravity.toFixed(1);
    controls.querySelector('[data-out="damping"]').textContent = state.damping.toFixed(3);
  }

  function step() {
    if (state.paused) return;
    const dt = 0.18;
    const alpha = -(state.gravity / state.length) * Math.sin(state.theta) - state.damping * state.omega;
    state.omega += alpha * dt;
    state.theta += state.omega * dt;
  }

  function draw() {
    ctx.clearRect(0, 0, 760, 420);
    ctx.fillStyle = "#07111f";
    ctx.fillRect(0, 0, 760, 420);
    const ox = 380, oy = 70;
    const bx = ox + state.length * Math.sin(state.theta);
    const by = oy + state.length * Math.cos(state.theta);

    ctx.strokeStyle = "rgba(148,163,184,.35)";
    ctx.beginPath();
    ctx.moveTo(80, oy);
    ctx.lineTo(680, oy);
    ctx.stroke();

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(bx, by);
    ctx.stroke();

    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(bx, by, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fde68a";
    ctx.stroke();

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "700 14px system-ui";
    ctx.fillText("L = T - V", 30, 34);
    ctx.fillText("theta'' + (g/l) sin(theta) + amortiguamiento = 0", 30, 58);

    const kinetic = 0.5 * Math.pow(state.length * state.omega, 2) / 10000;
    const potential = state.gravity * state.length * (1 - Math.cos(state.theta)) / 1000;
    drawBar(520, 300, 50, 80, kinetic, 2.2, "#60a5fa", "T");
    drawBar(590, 300, 50, 80, potential, 2.2, "#f87171", "V");
    readout.innerHTML = `theta=${state.theta.toFixed(3)} rad; omega=${state.omega.toFixed(3)}<br>T≈${kinetic.toFixed(3)}; V≈${potential.toFixed(3)}; L=T−V≈${(kinetic-potential).toFixed(3)}`;
  }

  function drawBar(x, y, w, h, value, max, color, label) {
    const filled = Math.max(0, Math.min(h, (value / max) * h));
    ctx.strokeStyle = "rgba(226,232,240,.6)";
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = color;
    ctx.fillRect(x, y + h - filled, w, filled);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(label, x + 18, y + h + 20);
  }

  function loop() {
    step();
    draw();
    raf = requestAnimationFrame(loop);
  }

  updateLabels();
  loop();
  return () => {
    cancelAnimationFrame(raf);
    controls.removeEventListener("input", onInput);
    controls.removeEventListener("click", onClick);
  };
}

export default mountEulerLagrangePlugin;
