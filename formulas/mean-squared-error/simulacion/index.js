export function mountMeanSquaredErrorPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const data = [
    { x: 80, y: 44 }, { x: 155, y: 38 }, { x: 235, y: -18 },
    { x: 325, y: -56 }, { x: 410, y: -28 }, { x: 505, y: -92 }
  ];
  const state = { m: 0.22, b: 0 };

  root.classList.add("mean-squared-error-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Pendiente m <strong data-out="m">0.22</strong><input data-key="m" type="range" min="-0.60" max="1.10" step="0.01" value="0.22"></label>
    <label>Intercepto b <strong data-out="b">0</strong><input data-key="b" type="range" min="-80" max="80" step="1" value="0"></label>
  `;
  controls.addEventListener("input", onInput);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
    draw();
  }

  function updateLabels() {
    controls.querySelector('[data-out="m"]').textContent = state.m.toFixed(2);
    controls.querySelector('[data-out="b"]').textContent = state.b.toFixed(0);
  }

  function predict(x) {
    return state.m * (x - 60) + state.b;
  }

  function draw() {
    const originY = 210;
    let sum = 0;
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(45, originY); ctx.lineTo(760, originY); ctx.stroke();

    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 1.5;
    data.forEach(p => {
      const yHat = predict(p.x);
      const pyReal = originY - p.y;
      const pyHat = originY - yHat;
      ctx.beginPath(); ctx.moveTo(p.x, pyReal); ctx.lineTo(p.x, pyHat); ctx.stroke();
      const err = p.y - yHat;
      sum += err * err;
    });
    const mse = sum / data.length;

    ctx.strokeStyle = "#2563eb"; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(45, originY - predict(45));
    ctx.lineTo(760, originY - predict(760));
    ctx.stroke();

    data.forEach(p => {
      ctx.fillStyle = "#0f172a";
      ctx.beginPath(); ctx.arc(p.x, originY - p.y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
    });

    ctx.fillStyle = "#0f172a"; ctx.font = "800 14px system-ui";
    ctx.fillText("MSE: residuos cuadrados entre datos y modelo", 24, 30);
    const fit = mse < 900 ? "Ajuste bajo: los residuos se han reducido bastante." : "Ajuste mejorable: las barras rojas aún son largas.";
    readout.innerHTML = `MSE = ${mse.toFixed(1)} · m=${state.m.toFixed(2)} · b=${state.b.toFixed(0)}<br>${fit}`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountMeanSquaredErrorPlugin;
