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
    canvas.width = Math.max(720, Math.floor(rect.width * ratio));
    canvas.height = Math.max(260, Math.floor(260 * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    config.draw(ctx, rect.width, 260, readParams(), time / 1000);
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
    draw: (ctx, w, h, p, time) => drawWave(ctx, w, h, p.a, 2, time)
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
    wave: { controls: [{ name: "freq", label: "Frecuencia", min: 1, max: 10, step: 1, value: 4 }], draw: (ctx, w, h, p, t) => drawWave(ctx, w, h, p.freq, 3, t) },
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

function clear(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fillRect(0, 0, w, h);
}
function drawGravity(ctx, w, h, p, t) {
  clear(ctx, w, h);
  const cx = w / 2, cy = h / 2, r = p.distance * 12;
  ctx.strokeStyle = "rgba(119,217,255,0.45)"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TWO_PI); ctx.stroke();
  ctx.fillStyle = "rgba(255,211,122,0.95)"; ctx.beginPath(); ctx.arc(cx, cy, 14 + p.mass, 0, TWO_PI); ctx.fill();
  ctx.fillStyle = "rgba(238,247,255,0.9)"; ctx.beginPath(); ctx.arc(cx + Math.cos(t) * r, cy + Math.sin(t) * r, 7, 0, TWO_PI); ctx.fill();
  label(ctx, `F ∝ ${Math.round((p.mass * 10 / (p.distance*p.distance)) * 100) / 100}`, 18, 30);
}
function drawComplex(ctx, w, h, p) {
  clear(ctx, w, h); const theta = p.theta / 100; const cx = w / 2, cy = h / 2, r = 86;
  ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TWO_PI); ctx.stroke();
  ctx.strokeStyle = "rgba(214,168,255,0.9)"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(theta) * r, cy - Math.sin(theta) * r); ctx.stroke();
  ctx.fillStyle = "rgba(214,168,255,0.95)"; ctx.beginPath(); ctx.arc(cx + Math.cos(theta) * r, cy - Math.sin(theta) * r, 7, 0, TWO_PI); ctx.fill();
  label(ctx, `e^{iθ}, θ=${theta.toFixed(2)}`, 18, 30);
}
function drawWave(ctx, w, h, freq, amp, t) {
  clear(ctx, w, h); ctx.strokeStyle = "rgba(140,240,200,0.95)"; ctx.lineWidth = 2; ctx.beginPath();
  for (let x = 0; x < w; x++) { const y = h / 2 + Math.sin(x / 38 * freq + t * 2) * (18 * amp); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke(); label(ctx, `Frecuencia ${freq}`, 18, 30);
}
function drawField(ctx, w, h, p) {
  clear(ctx, w, h); ctx.strokeStyle = "rgba(255,211,122,0.72)";
  for (let x = 35; x < w; x += 260 / p.density) for (let y = 45; y < h; y += 220 / p.density) arrow(ctx, x, y, 22, Math.sin(x * 0.02) + Math.cos(y * 0.025));
  label(ctx, "Campo electromagnético esquemático", 18, 30);
}
function drawParticles(ctx, w, h, p, t) {
  clear(ctx, w, h); for (let i = 0; i < 140; i++) { const x = (i * 47 + t * 28 * p.spread) % w; const y = h/2 + Math.sin(i + t + p.spread) * (12 + p.spread * 8); dot(ctx, x, y, 2.5, "rgba(255,159,178,0.78)"); } label(ctx, "Más dispersión → más microestados", 18, 30);
}
function drawSpectrum(ctx, w, h, p) {
  clear(ctx, w, h); for (let x = 0; x < w; x += 4) { const f = x / w; const y = h - Math.exp(-Math.pow((f - 0.16 - p.temp/32), 2) * (12 + p.temp)) * (70 + p.temp * 14); ctx.fillStyle = `hsl(${250 - f * 230}, 85%, 62%)`; ctx.fillRect(x, y, 4, h - y); } label(ctx, "Curva espectral simplificada", 18, 30);
}
function drawEnergy(ctx, w, h, p) {
  clear(ctx, w, h); const bar = Math.min(w - 70, p.mass * 58); ctx.fillStyle = "rgba(156,201,255,0.92)"; ctx.fillRect(36, h/2 - 26, bar, 52); label(ctx, `E = ${p.mass} · c²`, 36, h/2 - 42);
}
function drawQuantum(ctx, w, h, p, t) { drawWave(ctx, w, h, p.n, 2, t); label(ctx, `Modo cuántico n=${p.n}`, 18, 58); }
function drawSpinor(ctx, w, h, p, t) {
  clear(ctx, w, h); const cx = w/2, cy = h/2; ctx.strokeStyle = "rgba(199,166,255,0.88)";
  for (let i=0;i<2;i++){ctx.beginPath();ctx.ellipse(cx,cy,110,42, t*p.spin/8 + i*Math.PI/2,0,TWO_PI);ctx.stroke();}
  dot(ctx, cx + Math.cos(t*p.spin/5)*110, cy + Math.sin(t*p.spin/5)*42, 7, "rgba(199,166,255,0.95)"); label(ctx, "Espinor: fase y rotación", 18, 30);
}
function drawFlow(ctx, w, h, p, t) {
  clear(ctx, w, h); ctx.strokeStyle = "rgba(119,217,255,0.72)";
  for (let y=38;y<h;y+=24) { ctx.beginPath(); for(let x=0;x<w;x+=10){ const yy = y + Math.sin(x/42 + t + y/40) * p.vortex; x?ctx.lineTo(x,yy):ctx.moveTo(x,yy); } ctx.stroke(); }
  label(ctx, "Flujo viscoso simplificado", 18, 30);
}
function arrow(ctx, x, y, len, angle) { ctx.save(); ctx.translate(x,y); ctx.rotate(angle); ctx.beginPath(); ctx.moveTo(-len/2,0); ctx.lineTo(len/2,0); ctx.lineTo(len/2-5,-4); ctx.moveTo(len/2,0); ctx.lineTo(len/2-5,4); ctx.stroke(); ctx.restore(); }
function dot(ctx, x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, TWO_PI); ctx.fill(); }
function label(ctx, text, x, y) { ctx.fillStyle = "rgba(238,247,255,0.86)"; ctx.font = "800 15px system-ui"; ctx.fillText(text, x, y); }
