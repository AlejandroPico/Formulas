export function mountBayesTheoremPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { prior: 10, sensitivity: 80, falsePositive: 15 };

  root.classList.add("bayes-theorem-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Prevalencia P(A) <strong data-out="prior">10</strong>%<input data-key="prior" type="range" min="1" max="50" step="1" value="10"></label>
    <label>Sensibilidad P(B|A) <strong data-out="sensitivity">80</strong>%<input data-key="sensitivity" type="range" min="40" max="99" step="1" value="80"></label>
    <label>Falsos positivos P(B|¬A) <strong data-out="falsePositive">15</strong>%<input data-key="falsePositive" type="range" min="1" max="40" step="1" value="15"></label>
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
    controls.querySelector('[data-out="prior"]').textContent = state.prior.toFixed(0);
    controls.querySelector('[data-out="sensitivity"]').textContent = state.sensitivity.toFixed(0);
    controls.querySelector('[data-out="falsePositive"]').textContent = state.falsePositive.toFixed(0);
  }

  function drawBar(x, y, w, h, parts) {
    let cursor = x;
    parts.forEach(part => {
      const pw = w * part.value;
      ctx.fillStyle = part.color;
      ctx.fillRect(cursor, y, pw, h);
      cursor += pw;
    });
    ctx.strokeStyle = "#cbd5e1"; ctx.strokeRect(x, y, w, h);
  }

  function draw() {
    const pA = state.prior / 100;
    const pBA = state.sensitivity / 100;
    const pBnotA = state.falsePositive / 100;
    const pB = pBA * pA + pBnotA * (1 - pA);
    const posterior = (pBA * pA) / pB;
    const n = 1000;
    const sick = Math.round(n * pA);
    const healthy = n - sick;
    const truePos = Math.round(sick * pBA);
    const falsePos = Math.round(healthy * pBnotA);
    const positives = truePos + falsePos;

    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, 820, 340);
    ctx.fillStyle = "#0f172a"; ctx.font = "800 14px system-ui";
    ctx.fillText("Bayes: positivos verdaderos frente a falsos positivos", 24, 30);

    drawBar(70, 78, 680, 34, [
      { value: truePos / Math.max(1, positives), color: "#10b981" },
      { value: falsePos / Math.max(1, positives), color: "#3b82f6" }
    ]);
    ctx.fillStyle = "#0f172a"; ctx.font = "800 12px system-ui";
    ctx.fillText("Dentro de todos los positivos B", 70, 65);
    ctx.fillStyle = "#10b981"; ctx.fillText(`VP: ${truePos}`, 70, 132);
    ctx.fillStyle = "#3b82f6"; ctx.fillText(`FP: ${falsePos}`, 160, 132);

    const cY = 220, cXA = 330, cXB = 485;
    const rA = Math.sqrt(pA) * 130;
    const rB = Math.sqrt(pB) * 130;
    ctx.fillStyle = "rgba(245,158,11,.32)"; ctx.beginPath(); ctx.arc(cXA, cY, rA, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(59,130,246,.30)"; ctx.beginPath(); ctx.arc(cXB, cY, rB, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#475569"; ctx.font = "800 12px system-ui";
    ctx.fillText("A condición", cXA - 58, cY - rA - 8);
    ctx.fillText("B positivo", cXB + rB - 72, cY - rB - 8);

    readout.innerHTML = `P(B)=${(pB * 100).toFixed(1)}% · P(A|B)=${(posterior * 100).toFixed(1)}%<br>En 1000 casos: condición=${sick}, positivos verdaderos=${truePos}, falsos positivos=${falsePos}.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountBayesTheoremPlugin;
