export function mountBellmanEquationPlugin({ root, canvas, controls, readout }) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const state = { gamma: 0.8, reward: 100 };

  root.classList.add("bellman-equation-sim");
  canvas.width = Math.round(820 * dpr);
  canvas.height = Math.round(320 * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  controls.innerHTML = `
    <label>Factor de descuento γ <strong data-out="gamma">0.80</strong><input data-key="gamma" type="range" min="0.10" max="0.98" step="0.02" value="0.80"></label>
    <label>Recompensa final R <strong data-out="reward">100</strong><input data-key="reward" type="range" min="20" max="200" step="5" value="100"></label>
  `;
  controls.addEventListener("input", onInput);

  function onInput(event) {
    const key = event.target.dataset.key;
    if (!key) return;
    state[key] = Number(event.target.value);
    updateLabels(); draw();
  }
  function updateLabels() {
    controls.querySelector('[data-out="gamma"]').textContent = state.gamma.toFixed(2);
    controls.querySelector('[data-out="reward"]').textContent = state.reward.toFixed(0);
  }

  function draw() {
    const values = [3, 2, 1, 0].map(i => state.reward * Math.pow(state.gamma, i));
    ctx.clearRect(0, 0, 820, 320);
    ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, 820, 320);
    ctx.fillStyle = "#e2e8f0"; ctx.font = "800 14px system-ui";
    ctx.fillText("Bellman: propagación de recompensa futura", 24, 30);
    const boxW = 145, gap = 35, y = 105;
    values.forEach((v, i) => {
      const x = 80 + i * (boxW + gap);
      const alpha = Math.max(0.12, Math.min(1, v / state.reward));
      ctx.fillStyle = i === 3 ? "#22c55e" : `rgba(34,197,94,${alpha})`;
      ctx.fillRect(x, y, boxW, 100);
      ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2; ctx.strokeRect(x, y, boxW, 100);
      ctx.fillStyle = i === 3 ? "#052e16" : "#f8fafc";
      ctx.font = "800 15px ui-monospace, monospace";
      ctx.fillText(`V(s${i + 1})`, x + 42, y + 40);
      ctx.fillText(v.toFixed(1), x + 43, y + 68);
      if (i < 3) {
        ctx.fillStyle = "#93c5fd"; ctx.font = "900 22px system-ui"; ctx.fillText("←", x + boxW + 10, y + 58);
      }
    });
    const v2 = values[1];
    const v3 = values[2];
    readout.innerHTML = `V(s2)=γ·V(s3)=${state.gamma.toFixed(2)}·${v3.toFixed(1)}=${v2.toFixed(1)}<br>Cuanto mayor es γ, más importa la recompensa lejana.`;
  }

  updateLabels(); draw();
  return () => controls.removeEventListener("input", onInput);
}

export default mountBellmanEquationPlugin;
