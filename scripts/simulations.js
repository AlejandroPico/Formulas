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
  if (type === "pythagorean") return mountPythagoreanSimulation(canvas, controlsHost);

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

function mountPythagoreanSimulation(canvas, controlsHost) {
  const ctx = canvas.getContext("2d");
  canvas.classList.add("pythagorean-canvas");
  controlsHost.classList.add("pythagorean-controls");
  controlsHost.innerHTML = `
    <div class="pythagorean-panel">
      <div class="pythagorean-formula" aria-label="Teorema de Pitágoras">
        <span data-side="a">a²</span><span>+</span><span data-side="b">b²</span><span>=</span><span data-side="c">c²</span>
      </div>
      <div class="pythagorean-control-grid">
        <label><span>Cateto a · horizontal</span><strong id="pythagoreanAValue">6.0</strong><input type="range" id="pythagoreanA" min="1" max="10" step="0.1" value="6"></label>
        <label><span>Cateto b · vertical</span><strong id="pythagoreanBValue">6.0</strong><input type="range" id="pythagoreanB" min="1" max="10" step="0.1" value="6"></label>
      </div>
      <div class="pythagorean-live" id="pythagoreanLive"></div>
    </div>
  `;

  const rangeA = controlsHost.querySelector("#pythagoreanA");
  const rangeB = controlsHost.querySelector("#pythagoreanB");
  const valueA = controlsHost.querySelector("#pythagoreanAValue");
  const valueB = controlsHost.querySelector("#pythagoreanBValue");
  const live = controlsHost.querySelector("#pythagoreanLive");

  let resizeObserver;
  function draw() {
    const palette = getSimulationPalette(canvas);
    const colors = getPythagoreanColors(palette);
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height || 320);
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const a = Number(rangeA.value);
    const b = Number(rangeB.value);
    const c = Math.sqrt(a * a + b * b);
    valueA.textContent = a.toFixed(1);
    valueB.textContent = b.toFixed(1);

    drawPythagoreanScene(ctx, width, height, { a, b, c }, colors, palette);
    updatePythagoreanLive(live, a, b, c);
  }

  rangeA.addEventListener("input", draw);
  rangeB.addEventListener("input", draw);
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);
  }
  draw();

  return () => {
    rangeA.removeEventListener("input", draw);
    rangeB.removeEventListener("input", draw);
    resizeObserver?.disconnect();
    canvas.classList.remove("pythagorean-canvas");
    controlsHost.classList.remove("pythagorean-controls");
  };
}

function drawPythagoreanScene(ctx, w, h, values, colors, palette) {
  const { a, b, c } = values;
  clear(ctx, w, h, palette);

  const O = { x: 0, y: 0 };
  const A = { x: a, y: 0 };
  const B = { x: 0, y: b };
  const squareA = [O, A, { x: a, y: -a }, { x: 0, y: -a }];
  const squareB = [O, B, { x: -b, y: b }, { x: -b, y: 0 }];
  const squareC = [A, B, { x: b, y: a + b }, { x: a + b, y: a }];
  const all = [...squareA, ...squareB, ...squareC, O, A, B];
  const box = getMathBounds(all);
  const pad = 36;
  const scale = Math.min((w - pad * 2) / Math.max(1, box.maxX - box.minX), (h - pad * 2) / Math.max(1, box.maxY - box.minY));
  const toScreen = point => ({ x: pad + (point.x - box.minX) * scale, y: h - pad - (point.y - box.minY) * scale });

  drawPolygon(ctx, squareA.map(toScreen), colors.aFill, colors.aStroke, 1.4);
  drawPolygon(ctx, squareB.map(toScreen), colors.bFill, colors.bStroke, 1.4);
  drawPolygon(ctx, squareC.map(toScreen), colors.cFill, colors.cStroke, 1.7);

  const sO = toScreen(O), sA = toScreen(A), sB = toScreen(B);
  ctx.beginPath();
  ctx.moveTo(sO.x, sO.y);
  ctx.lineTo(sA.x, sA.y);
  ctx.lineTo(sB.x, sB.y);
  ctx.closePath();
  ctx.fillStyle = colorMix(palette.bg, palette.text, 0.10);
  ctx.fill();

  drawSegment(ctx, sO, sA, colors.a, 4.5);
  drawSegment(ctx, sO, sB, colors.b, 4.5);
  drawSegment(ctx, sA, sB, colors.c, 5.4);
  drawRightAngle(ctx, sO, Math.min(24, scale * 0.45), palette);

  drawChip(ctx, `a = ${a.toFixed(1)}`, midpoint(sO, sA), colors.a, palette, 0, -14);
  drawChip(ctx, `b = ${b.toFixed(1)}`, midpoint(sO, sB), colors.b, palette, 16, 0);
  drawChip(ctx, `c = ${c.toFixed(2)}`, midpoint(sA, sB), colors.c, palette, 16, -14);

  drawAreaLabel(ctx, `a² = ${(a * a).toFixed(1)}`, polygonCenter(squareA.map(toScreen)), colors.a, palette);
  drawAreaLabel(ctx, `b² = ${(b * b).toFixed(1)}`, polygonCenter(squareB.map(toScreen)), colors.b, palette);
  drawAreaLabel(ctx, `c² = ${(c * c).toFixed(1)}`, polygonCenter(squareC.map(toScreen)), colors.c, palette);
}

function updatePythagoreanLive(host, a, b, c) {
  const a2 = a * a;
  const b2 = b * b;
  const c2 = c * c;
  host.innerHTML = `
    <strong>Sustitución en tiempo real</strong>
    <span><b data-side="a">${a.toFixed(1)}²</b> + <b data-side="b">${b.toFixed(1)}²</b> = <b data-side="c">${c.toFixed(2)}²</b></span>
    <span><b data-side="a">${a2.toFixed(2)}</b> + <b data-side="b">${b2.toFixed(2)}</b> = <b data-side="c">${c2.toFixed(2)}</b></span>
    <em>La superficie verde de la hipotenusa equivale exactamente a la suma de las superficies azul y roja.</em>
  `;
}

function getPythagoreanColors(palette) {
  const root = getComputedStyle(document.body);
  const danger = root.getPropertyValue("--danger").trim() || "#cc4a44";
  return {
    a: palette.accent,
    b: danger,
    c: "#16a34a",
    aStroke: palette.accent,
    bStroke: danger,
    cStroke: "#16a34a",
    aFill: colorAlpha(palette.accent, 0.18),
    bFill: colorAlpha(danger, 0.18),
    cFill: "rgba(22, 163, 74, 0.18)"
  };
}

function getMathBounds(points) {
  return points.reduce((box, point) => ({
    minX: Math.min(box.minX, point.x),
    maxX: Math.max(box.maxX, point.x),
    minY: Math.min(box.minY, point.y),
    maxY: Math.max(box.maxY, point.y)
  }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
}

function drawPolygon(ctx, points, fill, stroke, lineWidth = 1) {
  ctx.beginPath();
  points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawSegment(ctx, start, end, color, width) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.stroke();
}

function drawRightAngle(ctx, origin, size, palette) {
  ctx.strokeStyle = palette.muted;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(origin.x, origin.y - size, size, size);
}

function drawChip(ctx, text, point, color, palette, dx = 0, dy = 0) {
  ctx.save();
  ctx.font = "850 13px system-ui";
  const width = ctx.measureText(text).width;
  const x = point.x + dx;
  const y = point.y + dy;
  ctx.fillStyle = colorMix(palette.bg, palette.text, 0.12);
  roundRect(ctx, x - width / 2 - 8, y - 17, width + 16, 24, 8);
  ctx.fill();
  ctx.strokeStyle = colorAlpha(color, 0.7);
  ctx.stroke();
  ctx.fillStyle = palette.text;
  ctx.fillText(text, x - width / 2, y);
  ctx.restore();
}

function drawAreaLabel(ctx, text, point, color, palette) {
  ctx.save();
  ctx.font = "800 12px system-ui";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, point.x, point.y);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function polygonCenter(points) {
  return points.reduce((sum, point) => ({ x: sum.x + point.x / points.length, y: sum.y + point.y / points.length }), { x: 0, y: 0 });
}

function colorAlpha(color, alpha) {
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const full = hex.length === 3 ? hex.split("").map(ch => ch + ch).join("") : hex;
    const value = Number.parseInt(full, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

function colorMix(base, overlay, amount) {
  return `color-mix(in srgb, ${base} ${Math.round((1 - amount) * 100)}%, ${overlay} ${Math.round(amount * 100)}%)`;
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
function drawField(ctx, w, h, p) {
  clear(ctx, w, h, p); ctx.strokeStyle = p.accent2; ctx.lineWidth = 1.8;
  for (let x = 35; x < w; x += Math.max(18, 260 / p.density)) for (let y = 45; y < h; y += Math.max(18, 220 / p.density)) arrow(ctx, x, y, 22, Math.sin(x * 0.02) + Math.cos(y * 0.025));
  label(ctx, "Campo electromagnético esquemático", 18, 30, p);
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
