export function mountRiemannZetaFunctionPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { t: 0, terms: 70, scale: 70 };

  root.classList.add("zeta-sim");
  canvas.width = Math.round(760 * dpr);
  canvas.height = Math.round(430 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Altura t <strong data-out="t">0.00</strong><input data-key="t" type="range" min="0" max="35" step="0.05" value="0"></label>
    <label>Términos eta <strong data-out="terms">70</strong><input data-key="terms" type="range" min="20" max="160" step="10" value="70"></label>
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
    controls.querySelector('[data-out="t"]').textContent = state.t.toFixed(2);
    controls.querySelector('[data-out="terms"]').textContent = String(state.terms);
  }

  function zetaApprox(t) {
    const sigma = 0.5;
    let re = 0, im = 0;
    for (let n = 1; n <= state.terms; n++) {
      const alt = n % 2 === 0 ? -1 : 1;
      const angle = -t * Math.log(n);
      const factor = alt / Math.pow(n, sigma);
      re += factor * Math.cos(angle);
      im += factor * Math.sin(angle);
    }
    const a = Math.pow(2, 1 - sigma);
    const denAngle = -t * Math.log(2);
    const denRe = 1 - a * Math.cos(denAngle);
    const denIm = -a * Math.sin(denAngle);
    const mag2 = denRe * denRe + denIm * denIm;
    return { re: (re * denRe + im * denIm) / mag2, im: (im * denRe - re * denIm) / mag2 };
  }

  function drawAxes(cx, cy) {
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(36, cy); ctx.lineTo(724, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 36); ctx.lineTo(cx, 394); ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px system-ui";
    ctx.fillText("Re", 702, cy - 8);
    ctx.fillText("Im", cx + 8, 48);
  }

  function draw() {
    const cx = 380, cy = 215;
    ctx.clearRect(0, 0, 760, 430);
    ctx.fillStyle = "#07111f";
    ctx.fillRect(0, 0, 760, 430);
    drawAxes(cx, cy);

    ctx.strokeStyle = "rgba(236,72,153,.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    let first = true;
    for (let x = 0; x <= state.t; x += 0.08) {
      const z = zetaApprox(x);
      const px = cx + z.re * state.scale;
      const py = cy - z.im * state.scale;
      if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const z = zetaApprox(state.t);
    const px = cx + z.re * state.scale;
    const py = cy - z.im * state.scale;
    ctx.strokeStyle = "rgba(59,130,246,.55)";
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.fillStyle = "#ec4899";
    ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.stroke();

    const module = Math.hypot(z.re, z.im);
    const nearFirst = Math.abs(state.t - 14.1347) < 0.18;
    readout.innerHTML = `ζ(0.5 + ${state.t.toFixed(2)}i) ≈ ${z.re.toFixed(3)} ${z.im >= 0 ? "+" : "-"} ${Math.abs(z.im).toFixed(3)}i<br>|ζ| ≈ ${module.toFixed(4)}${nearFirst ? " · cerca del primer cero no trivial" : ""}`;
  }

  updateLabels();
  draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountRiemannZetaFunctionPlugin;
