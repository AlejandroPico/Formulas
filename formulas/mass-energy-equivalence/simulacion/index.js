export function mountMassEnergyEquivalencePlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { grams: 1, percent: 100, burst: 0 };
  let raf = 0;

  root.classList.add("mass-energy-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(320 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Masa inicial <strong data-out="grams">1.0</strong> g<input data-key="grams" type="range" min="0.1" max="5" step="0.1" value="1"></label>
    <label>Fracción convertida <strong data-out="percent">100</strong>%<input data-key="percent" type="range" min="0.1" max="100" step="0.1" value="100"></label>
    <button type="button" data-action="burst">Liberar energía</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
    draw();
  }

  function onClick(event) {
    if (event.target.dataset.action === "burst") state.burst = 1;
  }

  function updateLabels() {
    controls.querySelector('[data-out="grams"]').textContent = state.grams.toFixed(1);
    controls.querySelector('[data-out="percent"]').textContent = state.percent.toFixed(1);
  }

  function draw() {
    const c = 299792458;
    const kg = state.grams / 1000;
    const convertedKg = kg * state.percent / 100;
    const energy = convertedKg * c * c;
    const tntTons = energy / 4.184e9;
    const cx = 410, cy = 150;
    ctx.clearRect(0, 0, 820, 320);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, 820, 320);

    const r = 16 + state.grams * 8;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#3b82f6";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#dbeafe";
    ctx.font = "800 13px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("masa", cx, cy + 4);
    ctx.textAlign = "left";

    if (state.burst > 0) {
      const alpha = state.burst;
      const base = r + (1 - alpha) * 155;
      ctx.strokeStyle = `rgba(234,179,8,${alpha})`;
      ctx.lineWidth = 4;
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.arc(cx, cy, base * (0.45 + k * 0.28), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(253,224,71,${alpha})`;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * base, cy + Math.sin(a) * base, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      state.burst = Math.max(0, state.burst - 0.018);
    }

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "800 14px system-ui";
    ctx.fillText("E = m c²: una masa pequeña equivale a una energía enorme", 24, 30);
    readout.innerHTML = `m convertida = ${convertedKg.toExponential(3)} kg<br>E = ${energy.toExponential(4)} J · equivalente ≈ ${tntTons.toExponential(3)} toneladas de TNT`;
  }

  function loop() { draw(); raf = requestAnimationFrame(loop); }
  updateLabels(); loop();
  return () => { cancelAnimationFrame(raf); controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountMassEnergyEquivalencePlugin;
