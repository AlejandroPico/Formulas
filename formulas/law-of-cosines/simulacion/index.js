import { rangeControl, pluginLoop, clearCanvas, label, triangle } from "../../shared/plugin-utils.js";

export function mountCosinesPlugin({ canvas, controls, readout }) {
  controls.innerHTML = `
    ${rangeControl("Lado a", "a", 2, 8, 0.1, 5, "")}
    ${rangeControl("Lado b", "b", 2, 8, 0.1, 5.5, "")}
    ${rangeControl("Angulo C", "angle", 10, 170, 1, 60, "deg")}
    <button type="button" class="formula-plugin-button" data-right>Fijar C = 90</button>
  `;
  controls.querySelector("[data-right]").addEventListener("click", () => {
    controls.querySelector("input[name='angle']").value = 90;
  });
  return pluginLoop(canvas, controls, readout, (ctx, w, h, values, time, palette) => {
    const a = values.a;
    const b = values.b;
    const angle = values.angle;
    const rad = angle * Math.PI / 180;
    const scale = Math.min(w, h) / 11;
    const C = { x: w * .30, y: h * .72 };
    const B = { x: C.x + a * scale, y: C.y };
    const A = { x: C.x + Math.cos(rad) * b * scale, y: C.y - Math.sin(rad) * b * scale };
    const c2 = a * a + b * b - 2 * a * b * Math.cos(rad);
    const c = Math.sqrt(Math.max(0, c2));
    clearCanvas(ctx, w, h, palette);
    triangle(ctx, A, B, C, "#f97316", "#06b6d4", palette.danger, palette);
    ctx.save();
    ctx.globalAlpha = .55;
    ctx.strokeStyle = palette.accent2;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(C.x, C.y, 30, 0, -rad, true);
    ctx.stroke();
    ctx.restore();
    label(ctx, `C = ${angle.toFixed(0)}`, C.x + 20, C.y - 14, palette);
    const pyth = Math.abs(angle - 90) < .1;
    readout.innerHTML = `<strong>Ley de los cosenos</strong><span>c^2 = ${a.toFixed(1)}^2 + ${b.toFixed(1)}^2 - 2ab cos(C)</span><span>c^2 = ${c2.toFixed(2)}; c = ${c.toFixed(2)}</span><em>${pyth ? "Con C igual a 90, queda Pitagoras." : "El termino con coseno corrige la apertura del triangulo."}</em>`;
  });
}
