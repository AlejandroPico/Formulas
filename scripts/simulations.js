const TWO_PI = Math.PI * 2;

export function drawHeroCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  let t = 0;
  function frame() {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(119,217,255,0.38)";
    ctx.fillStyle = "rgba(238,247,255,0.92)";
    for (let ring = 0; ring < 5; ring++) {
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, 72 + ring * 38, 24 + ring * 18, Math.sin(t / 80 + ring) * 0.55, 0, TWO_PI);
      ctx.stroke();
    }
    const labels = ["E=mc²", "∇·E=ρ/ε₀", "iℏ∂Ψ=ĤΨ", "S=k ln Ω", "e^{iπ}+1=0"];
    labels.forEach((label, i) => {
      const angle = t / 90 + i * TWO_PI / labels.length;
      const x = width / 2 + Math.cos(angle) * (130 + 20 * Math.sin(t / 100 + i));
      const y = height / 2 + Math.sin(angle) * 88;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, TWO_PI);
      ctx.fill();
      ctx.font = "700 18px system-ui";
      ctx.fillText(label, x + 10, y - 8);
    });
    t += 1;
    requestAnimationFrame(frame);
  }
  frame();
}

export function mountSimulation(type, canvas, controlsHost) {
  const ctx = canvas.getContext("2d");
  const config = getSimulationConfig(type);
  controlsHost.innerHTML = config.controls.map(controlTemplate).join("");
  const controls = [...controlsHost.querySelectorAll("input")];

  let raf;
  function readParams() {
    return Object.fromEntries(controls.map(input => [input.name, Number(input.value)]));
  }
  function drawLoop(time = 0) {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height || 260);
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    config.draw(ctx, width, height, readParams(), time / 1000, getSimulationPalette(canvas));
    raf = requestAnimationFrame(drawLoop);
  }
  controls.forEach(input => input.addEventListener("input", () => drawLoop()));
  drawLoop();
  return () => cancelAnimationFrame(raf);
}

function controlTemplate(control) {
  return `<label>${control.label}<input type="range" name="${control.name}" min="${control.min}" max="${control.max}" step="${control.step}" value="${control.value}"></label>`;
}

function getSimulationConfig(type) {
  const generic = {
    controls: [{ name: "a", label: "Intensidad", min: 1, max: 10, step: 1, value: 5 }],
    draw: (ctx, w, h, p, time, palette) => drawWave(ctx, w, h, p.a, 2, time, palette)
  };
  const configs = {
    gravity: {
      controls: [
        { name: "mass", label: "Masa", min: 1, max: 10, step: 1, value: 5 },
        { name: "distance", label: "Distancia", min: 2, max: 12, step: 1, value: 7 }
      ],
      draw: drawGravity
    },
    complex: { controls: [{ name: "theta", label: "Ángulo", min: 0, max: 628, step: 1, value: 314 }], draw: drawComplex },
    wave: { controls: [{ name: "freq", label: "Frecuencia", min: 1, max: 10, step: 1, value: 4 }], draw: (ctx, w, h, p, t, palette) => drawWave(ctx, w, h, p.freq, 3, t, palette) },
    field: { controls: [{ name: "density", label: "Densidad", min: 4, max: 18, step: 1, value: 9 }], draw: drawField },
    particles: { controls: [{ name: "spread", label: "Dispersión", min: 1, max: 10, step: 1, value: 6 }], draw: drawParticles },
    spectrum: { controls: [{ name: "temp", label: "Temperatura", min: 1, max: 10, step: 1, value: 5 }], draw: drawSpectrum },
    energy: { controls: [{ name: "mass", label: "Masa", min: 1, max: 10, step: 1, value: 4 }], draw: drawEnergy },
    quantum: { controls: [{ name: "n", label: "Modo", min: 1, max: 6, step: 1, value: 2 }], draw: drawQuantum },
    spinor: { controls: [{ name: "spin", label: "Fase", min: 1, max: 10, step: 1, value: 4 }], draw: drawSpinor },
    flow: { controls: [{ name: "vortex", label: "Vorticidad", min: 1, max: 10, step: 1, value: 5 }], draw: drawFlow }
  };
  return configs[type] ?? generic;
}

function getSimulationPalette(canvas) {
  const styles = getComputedStyle(canvas);
  const root = getComputedStyle(document.body);
  return {
    bg: styles.backgroundColor && styles.backgroundColor !== "rgba(0, 0, 0, 0)" ? styles.backgroundColor : "rgba(12,16,24,0.94)",
    text: root.getPropertyValue("--text").trim() || "#f1f2f4",
    muted: root.getPropertyValue("--muted").trim() || "#aaafbd",
    accent: root.getPropertyValue("--accent").trim() || "#5d5af6",
    accent2: root.getPropertyValue("--accent-2").trim() || "#7b61ff",
    line: root.getPropertyValue("--line").trim() || "rgba(255,255,255,.22)",
    glow: "rgba(255,255,255,0.86)"
  };
}

function clear(ctx, w, h, palette) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.strokeStyle = palette.text;
  ctx.lineWidth = 1;
  for (let x = 40; x < w; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 40; y < h; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}
function drawGravity(ctx, w, h, p, t, palette) {
  clear(ctx, w, h, palette);
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.14 + p.distance * 7;
  ctx.lineWidth = 2;
  ctx.strokeStyle = palette.accent;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TWO_PI);
  ctx.stroke();
  ctx.fillStyle = palette.accent2;
  ctx.beginPath();
  ctx.arc(cx, cy, 14 + p.mass, 0, TWO_PI);
  ctx.fill();
  ctx.fillStyle = palette.text;
  ctx.beginPath();
  ctx.arc(cx + Math.cos(t) * r, cy + Math.sin(t) * r, 7, 0, TWO_PI);
  ctx.fill();
  label(ctx, `F ∝ ${Math.round((p.mass * 10 / (p.distance*p.distance)) * 100) / 100}`, 18, 30, palette);
}
function drawComplex(ctx, w, h, p, t, palette) {
  clear(ctx, w, h, palette); const theta = p.theta / 100; const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.28;
  ctx.lineWidth = 2;
  ctx.strokeStyle = palette.line; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TWO_PI); ctx.stroke();
  ctx.strokeStyle = palette.accent2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(theta) * r, cy - Math.sin(theta) * r); ctx.stroke();
  ctx.fillStyle = palette.accent2; ctx.beginPath(); ctx.arc(cx + Math.cos(theta) * r, cy - Math.sin(theta) * r, 7, 0, TWO_PI); ctx.fill();
  label(ctx, `e^{iθ}, θ=${theta.toFixed(2)}`, 18, 30, palette);
}
function drawWave(ctx, w, h, freq, amp, t, palette) {
  clear(ctx, w, h, palette); ctx.strokeStyle = palette.accent; ctx.lineWidth = 2.6; ctx.beginPath();
  for (let x = 0; x < w; x++) { const y = h / 2 + Math.sin(x / 38 * freq + t * 2) * Math.min(h * 0.2, 18 * amp); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke(); label(ctx, `Frecuencia ${freq}`, 18, 30, palette);
}
function drawField(ctx, w, h, p, t, palette) {
  clear(ctx, w, h, palette); ctx.strokeStyle = palette.accent2; ctx.lineWidth = 1.8;
  for (let x = 35; x < w; x += Math.max(18, 260 / p.density)) for (let y = 45; y < h; y += Math.max(18, 220 / p.density)) arrow(ctx, x, y, 22, Math.sin(x * 0.02) + Math.cos(y * 0.025));
  label(ctx, "Campo electromagnético esquemático", 18, 30, palette);
}
function drawParticles(ctx, w, h, p, t, palette) {
  clear(ctx, w, h, palette); for (let i = 0; i < 140; i++) { const x = (i * 47 + t * 28 * p.spread) % w; const y = h/2 + Math.sin(i + t + p.spread) * Math.min(h * 0.33, 12 + p.spread * 8); dot(ctx, x, y, 2.8, palette.accent2); } label(ctx, "Más dispersión → más microestados", 18, 30, palette);
}
function drawSpectrum(ctx, w, h, p, t, palette) {
  clear(ctx, w, h, palette); for (let x = 0; x < w; x += 4) { const f = x / w; const y = h - Math.exp(-Math.pow((f - 0.16 - p.temp/32), 2) * (12 + p.temp)) * Math.min(h * 0.82, 70 + p.temp * 14); ctx.fillStyle = `hsl(${250 - f * 230}, 88%, 56%)`; ctx.fillRect(x, y, 4, h - y); } label(ctx, "Curva espectral simplificada", 18, 30, palette);
}
function drawEnergy(ctx, w, h, p, t, palette) {
  clear(ctx, w, h, palette); const bar = Math.min(w - 70, p.mass * 58); ctx.fillStyle = palette.accent; ctx.fillRect(36, h/2 - 26, bar, 52); label(ctx, `E = ${p.mass} · c²`, 36, h/2 - 42, palette);
}
function drawQuantum(ctx, w, h, p, t, palette) { drawWave(ctx, w, h, p.n, 2, t, palette); label(ctx, `Modo cuántico n=${p.n}`, 18, 58, palette); }
function drawSpinor(ctx, w, h, p, t, palette) {
  clear(ctx, w, h, palette); const cx = w/2, cy = h/2; ctx.strokeStyle = palette.accent2; ctx.lineWidth = 2;
  for (let i=0;i<2;i++){ctx.beginPath();ctx.ellipse(cx,cy,Math.min(110,w*.28),Math.min(42,h*.16), t*p.spin/8 + i*Math.PI/2,0,TWO_PI);ctx.stroke();}
  dot(ctx, cx + Math.cos(t*p.spin/5)*Math.min(110,w*.28), cy + Math.sin(t*p.spin/5)*Math.min(42,h*.16), 7, palette.text); label(ctx, "Espinor: fase y rotación", 18, 30, palette);
}
function drawFlow(ctx, w, h, p, t, palette) {
  clear(ctx, w, h, palette); ctx.strokeStyle = palette.accent; ctx.lineWidth = 1.8;
  for (let y=38;y<h;y+=24) { ctx.beginPath(); for(let x=0;x<w;x+=10){ const yy = y + Math.sin(x/42 + t + y/40) * p.vortex; x?ctx.lineTo(x,yy):ctx.moveTo(x,yy); } ctx.stroke(); }
  label(ctx, "Flujo viscoso simplificado", 18, 30, palette);
}
function arrow(ctx, x, y, len, angle) { ctx.save(); ctx.translate(x,y); ctx.rotate(angle); ctx.beginPath(); ctx.moveTo(-len/2,0); ctx.lineTo(len/2,0); ctx.lineTo(len/2-5,-4); ctx.moveTo(len/2,0); ctx.lineTo(len/2-5,4); ctx.stroke(); ctx.restore(); }
function dot(ctx, x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, TWO_PI); ctx.fill(); }
function label(ctx, text, x, y, palette) {
  ctx.save();
  ctx.font = "850 15px system-ui";
  const width = ctx.measureText(text).width;
  ctx.fillStyle = "rgba(0,0,0,0.46)";
  ctx.fillRect(x - 7, y - 19, width + 14, 26);
  ctx.fillStyle = palette.text;
  ctx.fillText(text, x, y);
  ctx.restore();
}
