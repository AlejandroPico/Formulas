export function mountLorentzTransformationsPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { beta: 0, x: -150, groundTime: 0, trainTime: 0, paused: false, flash: 0 };
  let raf = 0;

  root.classList.add("lorentz-transformations-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(330 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Velocidad v/c <strong data-out="beta">0.00</strong><input data-key="beta" type="range" min="0" max="0.99" step="0.01" value="0"></label>
    <button type="button" data-action="flash">Evento luminoso</button>
    <button type="button" data-action="pause">Pausar</button>
    <button type="button" data-action="reset">Reiniciar</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function gamma() {
    return 1 / Math.sqrt(1 - state.beta * state.beta);
  }

  function onInput(event) {
    if (event.target.dataset.key !== "beta") return;
    state.beta = Number(event.target.value);
    updateLabels();
  }

  function onClick(event) {
    const action = event.target.dataset.action;
    if (action === "flash") state.flash = 1;
    if (action === "pause") {
      state.paused = !state.paused;
      event.target.textContent = state.paused ? "Reanudar" : "Pausar";
    }
    if (action === "reset") reset();
  }

  function reset() {
    state.x = -150;
    state.groundTime = 0;
    state.trainTime = 0;
    state.flash = 0;
  }

  function updateLabels() {
    controls.querySelector('[data-out="beta"]').textContent = state.beta.toFixed(2);
  }

  function clock(x, y, label, t, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.stroke();
    const a = -Math.PI / 2 + t;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 17, y + Math.sin(a) * 17); ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "800 12px system-ui";
    ctx.fillText(label, x - 26, y + 42);
  }

  function draw() {
    const g = gamma();
    const trackY = 205;
    const ownLength = 170;
    const contracted = ownLength / g;
    if (!state.paused) {
      state.groundTime += 0.045;
      state.trainTime += 0.045 / g;
      state.x += 1.2 + state.beta * 7.2;
      if (state.x > 940) reset();
      state.flash = Math.max(0, state.flash - 0.018);
    }

    ctx.clearRect(0, 0, 820, 330);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 820, 330);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, trackY); ctx.lineTo(820, trackY); ctx.stroke();

    for (let x = 20; x < 820; x += 50) {
      ctx.strokeStyle = "#334155";
      ctx.beginPath(); ctx.moveTo(x, trackY - 8); ctx.lineTo(x + 26, trackY + 8); ctx.stroke();
    }

    const trainX = state.x;
    const trainY = trackY - 48;
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(trainX - contracted / 2, trainY, contracted, 38);
    ctx.strokeStyle = "#93c5fd";
    ctx.strokeRect(trainX - contracted / 2, trainY, contracted, 38);
    ctx.fillStyle = "#dbeafe";
    ctx.font = "800 12px system-ui";
    ctx.fillText("tren", trainX - 14, trainY + 24);

    if (state.flash > 0) {
      const r = (1 - state.flash) * 150;
      ctx.strokeStyle = `rgba(253,224,71,${state.flash})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(410, trainY + 19, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(410, trainY + 19, r * 0.55, 0, Math.PI * 2); ctx.stroke();
    }

    clock(90, 80, "plataforma", state.groundTime, "#94a3b8");
    clock(220, 80, "tren", state.trainTime, "#60a5fa");
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("Transformaciones de Lorentz: gamma, tiempo y longitud", 24, 30);

    readout.innerHTML = `γ = ${g.toFixed(4)}<br>Longitud observada = L0/γ = ${contracted.toFixed(1)} px · ritmo del reloj móvil = ${(100 / g).toFixed(1)}%`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountLorentzTransformationsPlugin;
