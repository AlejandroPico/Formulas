export function mountShannonEntropyPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { p: 0.5, symbols: [] };

  root.classList.add("shannon-entropy-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Probabilidad p(1) <strong data-out="p">0.50</strong><input data-key="p" type="range" min="0.01" max="0.99" step="0.01" value="0.50"></label>
    <button type="button" data-action="sample">Generar 64 símbolos</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function entropy(p) {
    return -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
  }

  function sample() {
    state.symbols = Array.from({ length: 64 }, () => Math.random() < state.p ? 1 : 0);
  }

  function onInput(event) {
    if (event.target.dataset.key !== "p") return;
    state.p = Number(event.target.value);
    controls.querySelector('[data-out="p"]').textContent = state.p.toFixed(2);
    sample();
    draw();
  }

  function onClick(event) {
    if (event.target.dataset.action !== "sample") return;
    sample();
    draw();
  }

  function draw() {
    const ox = 70, oy = 245, w = 690, h = 175;
    const H = entropy(state.p);
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy - h); ctx.lineTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();
    ctx.fillStyle = "#94a3b8"; ctx.font = "800 12px system-ui";
    ctx.fillText("p", ox + w - 8, oy + 20);
    ctx.fillText("H bits", ox - 50, oy - h + 8);
    ctx.fillText("0.5", ox + w / 2 - 10, oy + 20);
    ctx.fillText("1 bit", ox - 44, oy - h + 4);

    ctx.beginPath();
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 3;
    for (let px = 1; px < w; px++) {
      const p = px / w;
      const y = oy - entropy(p) * h;
      if (px === 1) ctx.moveTo(ox + px, y); else ctx.lineTo(ox + px, y);
    }
    ctx.stroke();

    const cx = ox + state.p * w;
    const cy = oy - H * h;
    ctx.strokeStyle = "rgba(203,213,225,.8)"; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(cx, oy); ctx.lineTo(cx, cy); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#f43f5e"; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();

    const startX = 70, startY = 285, cell = 10;
    state.symbols.forEach((bit, i) => {
      ctx.fillStyle = bit ? "#38bdf8" : "#334155";
      ctx.fillRect(startX + i * cell, startY, cell - 2, 24);
    });
    const ones = state.symbols.reduce((a, b) => a + b, 0);
    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Entropía de Shannon: incertidumbre media de una fuente binaria", 24, 30);
    const msg = Math.abs(state.p - 0.5) < 0.03 ? "máxima incertidumbre" : state.p < 0.15 || state.p > 0.85 ? "fuente muy predecible" : "incertidumbre intermedia";
    readout.innerHTML = `H(p) = ${H.toFixed(3)} bits · ${msg}.<br>Secuencia: ${ones}/64 unos generados con p=${state.p.toFixed(2)}.`;
  }

  sample(); draw();
  return () => { controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountShannonEntropyPlugin;
