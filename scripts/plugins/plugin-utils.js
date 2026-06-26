export function rangeControl(label, name, min, max, step, value, unit = "") {
  return `<label class="formula-plugin-control"><span>${label}</span><strong data-value-for="${name}">${value}${unit ? ` ${unit}` : ""}</strong><input type="range" name="${name}" min="${min}" max="${max}" step="${step}" value="${value}" data-unit="${unit}"></label>`;
}

export function pluginLoop(canvas, controls, readout, draw) {
  let raf = 0;
  let disposed = false;
  canvas.classList.add("formula-plugin-canvas");
  controls.querySelectorAll("input[type='range']").forEach(input => input.addEventListener("input", updateControlLabels));
  updateControlLabels.call(controls);

  function frame(time = 0) {
    if (disposed) return;
    const ctx = resizeCanvas(canvas);
    draw(ctx, canvas.clientWidth || 1, canvas.clientHeight || 1, readControls(controls), time / 1000, getPalette());
    raf = requestAnimationFrame(frame);
  }
  frame();
  return () => { disposed = true; cancelAnimationFrame(raf); };
}

export function readControls(root) {
  return Object.fromEntries([...root.querySelectorAll("input")].map(input => [input.name, Number(input.value)]));
}

export function updateControlLabels() {
  const root = this?.closest?.(".formula-plugin-controls") || this || document;
  root.querySelectorAll("input[type='range']").forEach(input => {
    const out = root.querySelector(`[data-value-for='${input.name}']`);
    if (!out) return;
    const unit = input.dataset.unit || "";
    const decimals = String(input.step || "1").includes(".") ? 1 : 0;
    out.textContent = `${Number(input.value).toFixed(decimals)}${unit ? ` ${unit}` : ""}`;
  });
}

export function resizeCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, rect.width || 600);
  const height = Math.max(1, rect.height || 360);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function getPalette() {
  const root = getComputedStyle(document.body);
  const panel = root.getPropertyValue("--panel-solid").trim() || "#ffffff";
  const text = root.getPropertyValue("--text").trim() || "#181818";
  const muted = root.getPropertyValue("--muted").trim() || "#6d6b67";
  return {
    bg: panel,
    text,
    muted,
    line: root.getPropertyValue("--line").trim() || colorAlpha(text, 0.14),
    accent: root.getPropertyValue("--accent").trim() || "#5d5af6",
    accent2: root.getPropertyValue("--accent-2").trim() || "#7b61ff",
    danger: root.getPropertyValue("--danger").trim() || "#cc4a44",
    green: "#16a34a",
    warning: "#eab308",
    chipBg: colorAlpha(panel, 0.92)
  };
}

export function clearCanvas(ctx, w, h, palette) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.globalAlpha = 0.09;
  ctx.strokeStyle = palette.text;
  for (let x = 42; x < w; x += 84) line(ctx, x, 0, x, h, palette.text, 1);
  for (let y = 42; y < h; y += 84) line(ctx, 0, y, w, y, palette.text, 1);
  ctx.restore();
}

export function line(ctx, x1, y1, x2, y2, color, width = 2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.stroke();
}

export function dot(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function label(ctx, text, x, y, palette) {
  ctx.save();
  ctx.font = "850 13px system-ui";
  const width = ctx.measureText(text).width;
  ctx.fillStyle = palette.chipBg;
  roundRect(ctx, x - 7, y - 18, width + 14, 25, 8);
  ctx.fill();
  ctx.strokeStyle = palette.line;
  ctx.stroke();
  ctx.fillStyle = palette.text;
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function arrow(ctx, x, y, angle, length, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  line(ctx, 0, 0, length, 0, color, 3);
  ctx.beginPath();
  ctx.moveTo(length, 0);
  ctx.lineTo(length - 9, -5);
  ctx.lineTo(length - 9, 5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export function triangle(ctx, A, B, C, ca, cb, cc, palette) {
  line(ctx, B.x, B.y, C.x, C.y, ca, 4);
  line(ctx, A.x, A.y, C.x, C.y, cb, 4);
  line(ctx, A.x, A.y, B.x, B.y, cc, 4);
  [A, B, C].forEach((p, i) => {
    dot(ctx, p.x, p.y, 5.5, palette.text);
    ctx.fillStyle = palette.text;
    ctx.font = "900 14px system-ui";
    ctx.fillText(["A", "B", "C"][i], p.x + 8, p.y - 8);
  });
}

export function attachDrag(canvas, hit, move) {
  let drag = null;
  const down = event => { drag = hit(pointer(event, canvas)); if (drag) canvas.setPointerCapture?.(event.pointerId); };
  const moveEvent = event => { if (!drag) return; move(drag, pointer(event, canvas)); event.preventDefault(); };
  const up = () => { drag = null; };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", moveEvent);
  window.addEventListener("pointerup", up);
  return () => {
    canvas.removeEventListener("pointerdown", down);
    canvas.removeEventListener("pointermove", moveEvent);
    window.removeEventListener("pointerup", up);
  };
}

export function pointer(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

export function colorAlpha(color, alpha) {
  const value = String(color || "").trim();
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    const full = hex.length === 3 ? hex.split("").map(ch => ch + ch).join("") : hex;
    const parsed = Number.parseInt(full, 16);
    return `rgba(${(parsed >> 16) & 255}, ${(parsed >> 8) & 255}, ${parsed & 255}, ${alpha})`;
  }
  const rgb = value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  return rgb ? `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})` : value;
}

export function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
export function dist(A, B) { return Math.hypot(A.x - B.x, A.y - B.y); }
export function deg(rad) { return rad * 180 / Math.PI; }
export function safeAcos(value) { return Math.acos(clamp(value, -1, 1)); }
export function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
