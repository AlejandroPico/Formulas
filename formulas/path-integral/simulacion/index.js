export function mountPathIntegralPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { count: 35, hbar: 1.0, paths: [] };

  root.classList.add("path-integral-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Número de caminos <strong data-out="count">35</strong><input data-key="count" type="range" min="8" max="120" step="1" value="35"></label>
    <label>ℏ visual <strong data-out="hbar">1.0</strong><input data-key="hbar" type="range" min="0.2" max="2.5" step="0.1" value="1.0"></label>
    <button type="button" data-action="generate">Generar historias</button>
  `;
  controls.addEventListener("input", onInput);
  controls.addEventListener("click", onClick);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels();
    generate();
  }

  function onClick(event) {
    if (event.target.dataset.action === "generate") generate();
  }

  function updateLabels() {
    controls.querySelector('[data-out="count"]').textContent = state.count.toFixed(0);
    controls.querySelector('[data-out="hbar"]').textContent = state.hbar.toFixed(1);
  }

  function generate() {
    const A = { x: 70, y: 180 };
    const B = { x: 750, y: 180 };
    state.paths = [];
    for (let j = 0; j < state.count; j++) {
      const nodes = [];
      const amp = (14 + Math.random() * 80) * state.hbar;
      const sign = Math.random() < 0.5 ? -1 : 1;
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        const x = A.x + (B.x - A.x) * t;
        let y = A.y + (B.y - A.y) * t;
        if (i > 0 && i < 8) y += sign * amp * Math.sin(Math.PI * t) + (Math.random() - 0.5) * amp * 0.55;
        nodes.push({ x, y });
      }
      state.paths.push(nodes);
    }
    draw();
  }

  function drawNode(pt, label) {
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = "#cbd5e1"; ctx.font = "800 12px system-ui"; ctx.fillText(label, pt.x - 25, pt.y - 14);
  }

  function draw() {
    const A = { x: 70, y: 180 };
    const B = { x: 750, y: 180 };
    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, 820, 340);
    state.paths.forEach((path, idx) => {
      const centrality = 1 - Math.min(1, Math.abs(path[4].y - 180) / 150);
      ctx.strokeStyle = `rgba(168,85,247,${0.12 + centrality * 0.32})`;
      ctx.lineWidth = 1 + centrality * 1.6;
      ctx.beginPath();
      path.forEach((pt, i) => { if (i === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
      ctx.stroke();
    });
    ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
    drawNode(A, "A inicio"); drawNode(B, "B fin");
    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Integral de camino: suma de historias ponderadas por fase", 24, 30);
    readout.innerHTML = `${state.paths.length} historias generadas.<br>La vecindad del camino clásico aparece más intensa por interferencia constructiva visual.`;
  }

  updateLabels(); generate();
  return () => { controls.removeEventListener("input", onInput); controls.removeEventListener("click", onClick); };
}

export default mountPathIntegralPlugin;
