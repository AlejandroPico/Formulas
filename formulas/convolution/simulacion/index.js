export function mountConvolutionPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { t: 120, width: 90 };

  root.classList.add("convolution-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(430 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Desplazamiento t <strong data-out="t">120</strong><input data-key="t" type="range" min="40" max="760" step="2" value="120"></label>
    <label>Ancho de g <strong data-out="width">90</strong><input data-key="width" type="range" min="40" max="160" step="5" value="90"></label>
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
    controls.querySelector('[data-out="t"]').textContent = String(Math.round(state.t - 410));
    controls.querySelector('[data-out="width"]').textContent = String(state.width);
  }

  function f(x) { return x >= 310 && x <= 470 ? 70 : 0; }
  function g(x, t) {
    const half = state.width / 2;
    const d = Math.abs(x - t);
    return d <= half ? (1 - d / half) * 70 : 0;
  }

  function integralAt(t) {
    let sum = 0;
    for (let x = 30; x <= 790; x += 2) sum += (f(x) / 70) * (g(x, t) / 70) * 2;
    return sum;
  }

  function drawSignal(fn, color, axisY, t = null) {
    ctx.beginPath();
    for (let x = 30; x <= 790; x += 2) {
      const y = axisY - (t === null ? fn(x) : fn(x, t));
      if (x === 30) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  function draw() {
    const axisTop = 150;
    const axisBottom = 345;
    ctx.clearRect(0, 0, 820, 430);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 820, 430);
    ctx.strokeStyle = "#cbd5e1";
    ctx.beginPath(); ctx.moveTo(30, axisTop); ctx.lineTo(790, axisTop); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, axisBottom); ctx.lineTo(790, axisBottom); ctx.stroke();

    drawSignal(f, "#2563eb", axisTop);
    drawSignal(g, "#ef4444", axisTop, state.t);

    ctx.fillStyle = "rgba(34,197,94,.38)";
    ctx.beginPath();
    let open = false;
    for (let x = 30; x <= 790; x += 2) {
      const h = Math.min(f(x), g(x, state.t));
      if (h > 0) {
        if (!open) { ctx.moveTo(x, axisTop); open = true; }
        ctx.lineTo(x, axisTop - h);
      }
    }
    if (open) {
      for (let x = 790; x >= 30; x -= 2) {
        if (Math.min(f(x), g(x, state.t)) > 0) { ctx.lineTo(x, axisTop); break; }
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.beginPath();
    for (let t = 40; t <= 760; t += 4) {
      const val = integralAt(t);
      const y = axisBottom - val * 1.35;
      if (t === 40) ctx.moveTo(t, y); else ctx.lineTo(t, y);
    }
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    ctx.stroke();

    const val = integralAt(state.t);
    ctx.fillStyle = "#22c55e";
    ctx.beginPath(); ctx.arc(state.t, axisBottom - val * 1.35, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 13px system-ui";
    ctx.fillText("f(tau)", 315, axisTop - 78);
    ctx.fillText("g(t-tau)", state.t - 32, axisTop - 78);
    ctx.fillText("resultado (f*g)(t)", 42, axisBottom - 95);
    readout.innerHTML = `Área de solapamiento normalizada ≈ ${val.toFixed(2)}<br>La curva verde inferior es el valor de la convolución para cada desplazamiento.`;
  }

  updateLabels();
  draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountConvolutionPlugin;
