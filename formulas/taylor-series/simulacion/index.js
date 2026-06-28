export function mountTaylorPlugin({ canvas, controls, readout }) {
  controls.innerHTML = `
    <label class="formula-plugin-control"><span>Orden</span><strong data-value-for="degree">5</strong><input type="range" name="degree" min="1" max="11" step="2" value="5"></label>
    <label class="formula-plugin-control"><span>Punto</span><strong data-value-for="x0">1.2</strong><input type="range" name="x0" min="-3.14" max="3.14" step="0.01" value="1.2"></label>
  `;
  let raf = 0;
  let disposed = false;
  controls.querySelectorAll("input").forEach(input => input.addEventListener("input", updateLabels));
  updateLabels();
  function frame() {
    if (disposed) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width || 600);
    const h = Math.max(1, rect.height || 360);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const styles = getComputedStyle(document.body);
    const bg = styles.getPropertyValue("--panel-solid").trim() || "#fff";
    const text = styles.getPropertyValue("--text").trim() || "#111";
    const accent = styles.getPropertyValue("--accent").trim() || "#5d5af6";
    const danger = styles.getPropertyValue("--danger").trim() || "#cc4a44";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const sx = 54;
    const sy = Math.min(h * 0.28, 92);
    drawLine(ctx, 0, cy, w, cy, text, 0.24, 1.5);
    drawLine(ctx, cx, 0, cx, h, text, 0.24, 1.5);
    const degree = Number(controls.querySelector("input[name='degree']").value);
    const x0 = Number(controls.querySelector("input[name='x0']").value);
    drawCurve(ctx, w, h, cx, cy, sx, sy, Math.sin, accent, 2.4);
    drawCurve(ctx, w, h, cx, cy, sx, sy, x => approxSin(x, degree), danger, 3);
    const real = Math.sin(x0);
    const approx = approxSin(x0, degree);
    const px = cx + x0 * sx;
    dot(ctx, px, cy - real * sy, 5.5, accent);
    dot(ctx, px, cy - approx * sy, 6.5, danger);
    ctx.fillStyle = text;
    ctx.font = "800 13px system-ui";
    ctx.fillText("sin(x)", 18, 30);
    ctx.fillText(`aprox ${degree}`, 18, 54);
    readout.innerHTML = `<strong>Serie de Taylor</strong><span>orden ${degree}; x ${x0.toFixed(2)}</span><span>real ${real.toFixed(4)}; aproximado ${approx.toFixed(4)}</span>`;
    raf = requestAnimationFrame(frame);
  }
  frame();
  return () => { disposed = true; cancelAnimationFrame(raf); };

  function updateLabels() {
    controls.querySelectorAll("input").forEach(input => {
      const out = controls.querySelector(`[data-value-for='${input.name}']`);
      if (out) out.textContent = Number(input.value).toFixed(input.name === "x0" ? 2 : 0);
    });
  }
}

function drawCurve(ctx, w, h, cx, cy, sx, sy, fn, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  let active = false;
  for (let px = 0; px <= w; px += 3) {
    const x = (px - cx) / sx;
    const y = fn(x);
    const py = cy - y * sy;
    if (py < -h || py > h * 2) { active = false; continue; }
    if (!active) { ctx.moveTo(px, py); active = true; } else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

function drawLine(ctx, x1, y1, x2, y2, color, alpha, width) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function dot(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function approxSin(x, degree) {
  let sum = x;
  const x2 = x * x;
  let p = x;
  if (degree >= 3) { p *= x2; sum -= p / 6; }
  if (degree >= 5) { p *= x2; sum += p / 120; }
  if (degree >= 7) { p *= x2; sum -= p / 5040; }
  if (degree >= 9) { p *= x2; sum += p / 362880; }
  if (degree >= 11) { p *= x2; sum -= p / 39916800; }
  return Math.max(-6, Math.min(6, sum));
}
