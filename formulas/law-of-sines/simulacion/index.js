import { pluginLoop, clearCanvas, line, dot, label, triangle, attachDrag, clamp, dist, deg, safeAcos } from "../../shared/plugin-utils.js";

export function mountSinesPlugin({ canvas, controls, readout }) {
  controls.innerHTML = '<span class="formula-plugin-hint">Arrastra el vertice C para deformar el triangulo.</span>';
  const state = { A: { x: .18, y: .78 }, B: { x: .82, y: .78 }, C: { x: .43, y: .24 } };
  const detach = attachDrag(canvas, hit, move);
  const dispose = pluginLoop(canvas, controls, readout, draw);
  return () => { detach(); dispose(); };

  function hit(pos) {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    return Math.hypot(pos.x - state.C.x * w, pos.y - state.C.y * h) < 28 ? "C" : null;
  }

  function move(which, pos) {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    state.C.x = clamp(pos.x / w, .08, .92);
    state.C.y = clamp(pos.y / h, .10, .70);
  }

  function draw(ctx, w, h, values, time, palette) {
    clearCanvas(ctx, w, h, palette);
    const A = denorm(state.A, w, h);
    const B = denorm(state.B, w, h);
    const C = denorm(state.C, w, h);
    const a = dist(B, C), b = dist(A, C), c = dist(A, B);
    const Aang = safeAcos((b*b + c*c - a*a) / (2*b*c));
    const Bang = safeAcos((a*a + c*c - b*b) / (2*a*c));
    const Cang = Math.PI - Aang - Bang;
    const circle = circumcircle(A, B, C);
    if (circle) {
      ctx.save();
      ctx.globalAlpha = .28;
      ctx.strokeStyle = palette.accent2;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      label(ctx, `2R = ${(2 * circle.r / 24).toFixed(2)}`, Math.max(16, circle.x - 38), Math.max(28, circle.y - circle.r - 8), palette);
    }
    triangle(ctx, A, B, C, palette.danger, palette.accent, palette.green, palette);
    dot(ctx, C.x, C.y, 8, palette.accent2);
    const ratioA = (a / 24) / Math.sin(Aang);
    const ratioB = (b / 24) / Math.sin(Bang);
    const ratioC = (c / 24) / Math.sin(Cang);
    readout.innerHTML = `<strong>Ley de los senos</strong><span>a/sin(A) = ${(a/24).toFixed(2)} / sin(${deg(Aang).toFixed(1)}°) = <b>${ratioA.toFixed(2)}</b></span><span>b/sin(B) = ${(b/24).toFixed(2)} / sin(${deg(Bang).toFixed(1)}°) = <b>${ratioB.toFixed(2)}</b></span><span>c/sin(C) = ${(c/24).toFixed(2)} / sin(${deg(Cang).toFixed(1)}°) = <b>${ratioC.toFixed(2)}</b></span><em>Las tres razones coinciden y equivalen al diametro de la circunferencia circunscrita.</em>`;
  }
}

function denorm(p, w, h) { return { x: p.x * w, y: p.y * h }; }
function circumcircle(A, B, C) {
  const d = 2 * (A.x*(B.y-C.y) + B.x*(C.y-A.y) + C.x*(A.y-B.y));
  if (Math.abs(d) < 1e-6) return null;
  const a2 = A.x*A.x + A.y*A.y;
  const b2 = B.x*B.x + B.y*B.y;
  const c2 = C.x*C.x + C.y*C.y;
  const ux = (a2*(B.y-C.y) + b2*(C.y-A.y) + c2*(A.y-B.y)) / d;
  const uy = (a2*(C.x-B.x) + b2*(A.x-C.x) + c2*(B.x-A.x)) / d;
  return { x: ux, y: uy, r: Math.hypot(ux - A.x, uy - A.y) };
}
