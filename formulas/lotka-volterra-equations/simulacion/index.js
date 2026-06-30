export function mountLotkaVolterraEquationsPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { beta: 0.04, alpha: 0.5, gamma: 0.5 };

  root.classList.add("lotka-volterra-equations-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(340 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Eficacia de caza β <strong data-out="beta">0.040</strong><input data-key="beta" type="range" min="0.01" max="0.08" step="0.005" value="0.04"></label>
    <label>Reproducción de presas α <strong data-out="alpha">0.50</strong><input data-key="alpha" type="range" min="0.2" max="0.9" step="0.05" value="0.5"></label>
    <label>Mortalidad depredador γ <strong data-out="gamma">0.50</strong><input data-key="gamma" type="range" min="0.2" max="0.9" step="0.05" value="0.5"></label>
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
    controls.querySelector('[data-out="beta"]').textContent = state.beta.toFixed(3);
    controls.querySelector('[data-out="alpha"]').textContent = state.alpha.toFixed(2);
    controls.querySelector('[data-out="gamma"]').textContent = state.gamma.toFixed(2);
  }

  function draw() {
    const ox = 70, oy = 285, w = 690, h = 220;
    let x = 30, y = 10;
    const delta = 0.02;
    const dt = 0.04;
    const prey = [];
    const pred = [];
    for (let px = 0; px <= w; px++) {
      const dx = (state.alpha * x - state.beta * x * y) * dt;
      const dy = (delta * x * y - state.gamma * y) * dt;
      x = Math.max(0, x + dx);
      y = Math.max(0, y + dy);
      prey.push({ x: ox + px, y: oy - Math.min(h, x * 2.5) });
      pred.push({ x: ox + px, y: oy - Math.min(h, y * 2.5) });
    }

    ctx.clearRect(0, 0, 820, 340);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, 820, 340);
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, oy - h); ctx.lineTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.stroke();

    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 3;
    ctx.beginPath(); prey.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
    ctx.strokeStyle = "#ef4444";
    ctx.beginPath(); pred.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();

    ctx.fillStyle = "#0f172a"; ctx.font = "800 14px system-ui";
    ctx.fillText("Lotka-Volterra: ciclos depredador-presa", 24, 30);
    ctx.fillStyle = "#3b82f6"; ctx.fillText("Presas", 72, 58);
    ctx.fillStyle = "#ef4444"; ctx.fillText("Depredadores", 138, 58);
    readout.innerHTML = `β=${state.beta.toFixed(3)} · α=${state.alpha.toFixed(2)} · γ=${state.gamma.toFixed(2)}<br>El ciclo aparece por el acoplamiento: más presas alimentan más depredadores, y más depredadores reducen presas.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountLotkaVolterraEquationsPlugin;
