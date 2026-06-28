export function mountFourierTransformPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { f1: 2, a1: 1, f2: 6, a2: 0.7, f3: 10, a3: 0.35, phase: 0 };
  let raf = 0;

  root.classList.add("fourier-sim");
  canvas.width = Math.round(900 * dpr);
  canvas.height = Math.round(420 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = [
    control("f1", "Frecuencia 1", 1, 16, 1, state.f1),
    control("a1", "Amplitud 1", 0, 1.5, 0.05, state.a1),
    control("f2", "Frecuencia 2", 1, 18, 1, state.f2),
    control("a2", "Amplitud 2", 0, 1.5, 0.05, state.a2),
    control("f3", "Frecuencia 3", 1, 20, 1, state.f3),
    control("a3", "Amplitud 3", 0, 1.5, 0.05, state.a3)
  ].join("");

  controls.addEventListener("input", onInput);

  function control(key, label, min, max, step, value) {
    return `<label>${label} <strong data-out="${key}">${value}</strong><input data-key="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
  }

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
    draw();
  }

  function updateLabels() {
    controls.querySelectorAll("[data-out]").forEach(out => {
      const key = out.dataset.out;
      out.textContent = key.startsWith("a") ? state[key].toFixed(2) : String(state[key]);
    });
  }

  function signal(t) {
    return state.a1 * Math.sin(2 * Math.PI * state.f1 * t + state.phase)
      + state.a2 * Math.sin(2 * Math.PI * state.f2 * t)
      + state.a3 * Math.sin(2 * Math.PI * state.f3 * t - state.phase * 0.5);
  }

  function axes(x, y, w, h, title) {
    ctx.strokeStyle = "rgba(148,163,184,.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    ctx.beginPath();
    ctx.moveTo(x, y + h / 2);
    ctx.lineTo(x + w, y + h / 2);
    ctx.stroke();
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "700 14px system-ui";
    ctx.fillText(title, x + 12, y + 24);
  }

  function drawTime(x, y, w, h) {
    axes(x, y, w, h, "Dominio temporal: f(t)");
    ctx.beginPath();
    for (let px = 0; px <= w; px += 1) {
      const t = px / w;
      const py = y + h / 2 - signal(t) * h * 0.18;
      if (px === 0) ctx.moveTo(x + px, py); else ctx.lineTo(x + px, py);
    }
    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  function drawSpectrum(x, y, w, h) {
    axes(x, y, w, h, "Dominio frecuencial: magnitud");
    const base = y + h - 34;
    ctx.strokeStyle = "rgba(148,163,184,.55)";
    ctx.beginPath();
    ctx.moveTo(x + 28, base);
    ctx.lineTo(x + w - 18, base);
    ctx.stroke();
    [[state.f1, state.a1, "#60a5fa"], [state.f2, state.a2, "#f87171"], [state.f3, state.a3, "#2dd4bf"]].forEach(([freq, amp, color]) => {
      const px = x + 28 + (freq / 20) * (w - 56);
      const top = base - Math.max(8, amp * (h - 95));
      ctx.strokeStyle = color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(px, base);
      ctx.lineTo(px, top);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, top, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "700 11px system-ui";
      ctx.fillText(`${freq} Hz`, px - 15, top - 10);
    });
  }

  function draw() {
    ctx.clearRect(0, 0, 900, 420);
    ctx.fillStyle = "#07111f";
    ctx.fillRect(0, 0, 900, 420);
    drawTime(22, 28, 415, 320);
    drawSpectrum(465, 28, 415, 320);
    readout.innerHTML = `La señal contiene tres ondas. En frecuencia aparecen tres picos: ${state.f1} Hz, ${state.f2} Hz y ${state.f3} Hz.`;
  }

  function loop() {
    state.phase += 0.012;
    draw();
    raf = requestAnimationFrame(loop);
  }

  updateLabels();
  loop();
  return () => {
    cancelAnimationFrame(raf);
    controls.removeEventListener("input", onInput);
  };
}

export default mountFourierTransformPlugin;
