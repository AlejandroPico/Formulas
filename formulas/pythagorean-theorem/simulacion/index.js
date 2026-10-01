import { hypotenuse, MISSIONS, solution, accepts } from './math.js';

const fmt = value => Number(value.toFixed(2)).toLocaleString('es-ES');
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export default function mountPythagorean({ root, canvas, controls, readout }) {
  root.classList.add('pyth-game', 'sim-wide', 'calc-wide');
  root.querySelector('.pyth-heading')?.remove();
  const state = root.__pythState ||= { mode: 'bridges', a: 3, b: 4, level: 0, answer: 2, solved: false, attempts: 0, hint: false, score: 0, feedback: '' };
  const abort = new AbortController();
  const on = (element, event, handler) => element.addEventListener(event, handler, { signal: abort.signal });
  let frame = 0, alive = true, progress = state.solved ? 1 : 0, geometry, dragging = '';
  const ctx = canvas.getContext('2d');
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Mapa del puente. Usa las flechas para ajustar la longitud y Enter para construir; también puedes usar los controles inferiores.');
  const heading = document.createElement('div');
  heading.className = 'pyth-heading';
  heading.innerHTML = `<nav aria-label="Modos del simulador"><button data-mode="bridges">Puentes</button><button data-mode="explore">Explorar</button><button data-mode="areas">Áreas</button></nav><div class="pyth-mission"><span data-progress></span><h3 data-title></h3><p data-story></p></div>`;
  root.prepend(heading);

  function renderControls() {
    const mission = MISSIONS[state.level];
    heading.querySelectorAll('[data-mode]').forEach(button => {
      button.classList.toggle('active', button.dataset.mode === state.mode);
      button.setAttribute('aria-pressed', String(button.dataset.mode === state.mode));
    });
    heading.querySelector('[data-title]').textContent = state.mode === 'bridges' ? mission.title : state.mode === 'areas' ? 'Dos áreas hacen una tercera' : 'Un vértice, tres longitudes';
    heading.querySelector('[data-progress]').textContent = state.mode === 'bridges' ? `PUENTE ${state.level + 1} DE ${MISSIONS.length} · ${state.score} PUNTOS` : 'LABORATORIO DE PITÁGORAS';
    heading.querySelector('[data-story]').textContent = state.mode === 'bridges' ? mission.story : 'Arrastra uno de los vértices o cambia los catetos. Las cuentas se actualizan al instante.';
    if (state.mode === 'bridges') {
      controls.innerHTML = `<form class="pyth-answer-form"><label>Longitud ${mission.missing} (u)<input name="length" type="number" min="0.01" max="30" step="0.01" value="${state.answer}" required ${state.solved ? 'disabled' : ''}></label><button type="submit" ${state.solved ? 'disabled' : ''}>Construir y cruzar</button></form><div class="pyth-actions"><button data-hint ${state.solved ? 'disabled' : ''}>Pista</button><button data-next ${!state.solved ? 'disabled' : ''}>${state.level === MISSIONS.length - 1 ? 'Jugar de nuevo' : 'Siguiente puente →'}</button></div>`;
      on(controls.querySelector('form'), 'submit', event => { event.preventDefault(); check(); });
      on(controls.querySelector('input'), 'input', event => { state.answer = Number(event.target.value); state.feedback = ''; updateReadout(); draw(); });
      on(controls.querySelector('[data-hint]'), 'click', () => { state.hint = true; state.feedback = mission.missing === 'a' || mission.missing === 'b' ? 'Conoces la hipotenusa: resta el cuadrado del cateto conocido a su cuadrado y toma la raíz positiva.' : mission.points ? 'Resta las coordenadas: Δx = 4 − (−2), Δy = 9 − 1. Suma sus cuadrados y toma la raíz.' : 'Suma los cuadrados de los dos desplazamientos. La raíz de esa suma es la longitud del puente.'; updateReadout(); });
      on(controls.querySelector('[data-next]'), 'click', () => {
        if (!state.solved) return;
        if (state.level === MISSIONS.length - 1) { state.level = 0; state.score = 0; } else state.level++;
        Object.assign(state, { solved: false, answer: 2, attempts: 0, hint: false, feedback: '' });
        cancelAnimationFrame(frame); progress = 0; renderControls(); draw();
      });
    } else {
      controls.innerHTML = `<label>Cateto a <input name="a" type="range" min="1" max="12" step="0.1" value="${state.a}"><output data-a>${fmt(state.a)} u</output></label><label>Cateto b <input name="b" type="range" min="1" max="12" step="0.1" value="${state.b}"><output data-b>${fmt(state.b)} u</output></label><button data-preset>Triángulo 3 · 4 · 5</button>`;
      controls.querySelectorAll('input').forEach(input => on(input, 'input', () => { state[input.name] = Number(input.value); updateReadout(); draw(); }));
      on(controls.querySelector('[data-preset]'), 'click', () => { state.a = 3; state.b = 4; renderControls(); draw(); });
    }
    updateReadout();
  }

  function updateReadout() {
    if (state.mode !== 'bridges') {
      const c = hypotenuse(state.a, state.b);
      controls.querySelector('[data-a]').textContent = `${fmt(state.a)} u`;
      controls.querySelector('[data-b]').textContent = `${fmt(state.b)} u`;
      controls.querySelector('[name="a"]').value = state.a;
      controls.querySelector('[name="b"]').value = state.b;
      readout.innerHTML = `<strong>${fmt(state.a ** 2)} + ${fmt(state.b ** 2)} = ${fmt(c ** 2)} u²</strong><span>c = √${fmt(c ** 2)} ≈ ${fmt(c)} u. La suma es de áreas; la raíz devuelve una longitud.</span>`;
    } else {
      const m = MISSIONS[state.level];
      const c = hypotenuse(m.a, m.b);
      const calculation = m.missing === 'a' || m.missing === 'b' ? `${m.missing} = √(${fmt(c ** 2)} − ${fmt((m.missing === 'a' ? m.b : m.a) ** 2)}) = ${fmt(solution(m))} u` : `${m.missing} = √(${fmt(m.a ** 2)} + ${fmt(m.b ** 2)}) ≈ ${fmt(solution(m))} u`;
      readout.classList.toggle('is-solved', state.solved);
      readout.innerHTML = `<strong>${state.solved ? (state.level === MISSIONS.length - 1 ? '¡Has conectado todas las islas!' : '¡Puente construido!') : 'Arrastra el extremo o escribe una longitud'}</strong><span>${state.solved ? calculation : state.feedback || 'Se aceptan dos decimales. El pequeño punto representa a quien cruzará el puente.'}</span>${state.solved ? '<span>La longitud encaja porque respeta la relación entre los cuadrados.</span>' : ''}`;
    }
  }

  function check() {
    if (state.mode !== 'bridges' || state.solved) return;
    const mission = MISSIONS[state.level];
    const input = controls.querySelector('input');
    state.answer = Number(input.value);
    if (!Number.isFinite(state.answer) || state.answer <= 0 || state.answer > 30) { state.feedback = 'Escribe una longitud positiva de hasta 30 u.'; updateReadout(); return; }
    state.attempts++;
    if (accepts(mission, state.answer)) {
      state.solved = true;
      state.score += Math.max(2, 10 - (state.attempts - 1) * 2 - (state.hint ? 2 : 0));
      renderControls();
      const start = performance.now();
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function animate(now) {
        if (!alive) return;
        progress = reduced ? 1 : clamp((now - start) / 1200, 0, 1);
        draw();
        if (progress < 1) frame = requestAnimationFrame(animate);
      }
      frame = requestAnimationFrame(animate);
    } else {
      state.feedback = state.answer < solution(mission) ? 'La pieza se queda corta. Revisa los cuadrados y la raíz; puedes volver a intentarlo.' : 'La pieza es demasiado larga. No sumes los lados directamente: calcula con sus cuadrados.';
      updateReadout(); draw();
    }
  }

  function draw() {
    if (!alive || root.closest('[hidden]')) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) { canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = rect.height;
    const styles = getComputedStyle(root);
    const ink = styles.getPropertyValue('--text').trim() || '#253045';
    const bg = styles.getPropertyValue('--panel-solid').trim() || '#fffcf4';
    const palette = { a: '#2a7a91', b: '#b76b39', c: '#7070bc', ink };
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    const mission = MISSIONS[state.level];
    const { a, b } = state.mode === 'bridges' ? mission : state;
    const areas = state.mode === 'areas';
    const minX = areas ? -b : 0, maxX = areas ? a + b : a;
    const minY = areas ? -a - b : -b, maxY = areas ? a : 0;
    const margin = w < 500 ? 50 : 64;
    const scale = Math.max(1, Math.min((w - margin * 2) / (maxX - minX), (h - 60) / (maxY - minY)));
    const offsetX = (w - (maxX - minX) * scale) / 2 - minX * scale;
    const offsetY = (h - (maxY - minY) * scale) / 2 - minY * scale;
    const project = p => ({ x: offsetX + p.x * scale, y: offsetY + p.y * scale });
    const O = { x: 0, y: 0 }, A = { x: a, y: 0 }, B = { x: 0, y: -b };
    const pO = project(O), pA = project(A), pB = project(B);
    geometry = { scale, offsetX, offsetY, pO, pA, pB, a, b };
    const stroke = (p, q, color, width = 2, dashed = false) => {
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dashed ? [5, 5] : []); ctx.stroke(); ctx.setLineDash([]);
    };
    const text = (label, x, y, color = ink, align = 'center') => { ctx.font = '14px system-ui'; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(label, x, y); };
    const dot = (p, color, size = 5) => { ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); };
    if (areas) {
      const square = (p, q, side, color, area) => {
        const dx = q.x - p.x, dy = q.y - p.y;
        const points = [p, q, { x: q.x - dy * side, y: q.y + dx * side }, { x: p.x - dy * side, y: p.y + dx * side }].map(project);
        ctx.beginPath(); points.forEach((pt, i) => i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)); ctx.closePath();
        ctx.fillStyle = color; ctx.globalAlpha = .13; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.stroke();
        text(`${fmt(area)} u²`, points.reduce((sum, p) => sum + p.x, 0) / 4, points.reduce((sum, p) => sum + p.y, 0) / 4, color);
      };
      square(O, A, 1, palette.a, a ** 2); square(O, B, -1, palette.b, b ** 2); square(A, B, 1, palette.c, a ** 2 + b ** 2);
    }
    stroke(pO, pA, palette.a, 2, state.mode === 'bridges');
    stroke(pO, pB, palette.b, 2, state.mode === 'bridges');
    stroke(pA, pB, palette.c, 2, state.mode === 'bridges' && !state.solved);
    ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.strokeRect(pO.x, pO.y - 12, 12, 12);
    const missing = state.mode === 'bridges' && !state.solved ? mission.missing : '';
    text(`a = ${missing === 'a' ? '?' : fmt(a)} u`, (pO.x + pA.x) / 2, pO.y + 24, palette.a);
    text(`b = ${missing === 'b' ? '?' : fmt(b)} u`, pO.x - 14, (pO.y + pB.y) / 2, palette.b, 'right');
    text(`${mission.missing === 'd' && state.mode === 'bridges' ? 'd' : 'c'} = ${missing === 'c' || missing === 'd' ? '?' : fmt(hypotenuse(a, b))} u`, (pA.x + pB.x) / 2 + 18, (pA.y + pB.y) / 2 - 12, palette.c, 'left');
    if (state.mode === 'bridges') {
      dot(pA, palette.a, 12); dot(pB, palette.b, 12);
      const target = missing === 'a' || mission.missing === 'a' ? { start: pO, end: pA, length: a } : missing === 'b' || mission.missing === 'b' ? { start: pO, end: pB, length: b } : { start: pA, end: pB, length: hypotenuse(a, b) };
      geometry.target = target;
      const ratio = state.solved ? 1 : clamp(state.answer / target.length, 0, 1.5);
      const endpoint = { x: target.start.x + (target.end.x - target.start.x) * ratio, y: target.start.y + (target.end.y - target.start.y) * ratio };
      stroke(target.start, endpoint, state.solved ? '#24875c' : ink, 5);
      dot(endpoint, ink, 6);
      const traveler = state.solved ? { x: pA.x + (pB.x - pA.x) * progress, y: pA.y + (pB.y - pA.y) * progress } : pA;
      dot(traveler, bg, 7); dot(traveler, ink, 4);
      if (!state.solved) text(`${fmt(Number.isFinite(state.answer) ? state.answer : 0)} u`, clamp(endpoint.x + 12, 30, w - 30), clamp(endpoint.y + 25, 20, h - 12));
    } else { dot(pA, palette.a, 7); dot(pB, palette.b, 7); }
  }

  heading.querySelectorAll('[data-mode]').forEach(button => on(button, 'click', () => {
    cancelAnimationFrame(frame); progress = state.solved ? 1 : 0;
    state.mode = button.dataset.mode; renderControls(); draw();
  }));
  on(canvas, 'pointerdown', event => {
    if (!geometry || state.mode === 'bridges' && state.solved) return;
    const r = canvas.getBoundingClientRect(); const x = event.clientX - r.left, y = event.clientY - r.top;
    dragging = state.mode === 'bridges' ? 'answer' : Math.hypot(x - geometry.pA.x, y - geometry.pA.y) < Math.hypot(x - geometry.pB.x, y - geometry.pB.y) ? 'a' : 'b';
    canvas.setPointerCapture(event.pointerId);
    move(event);
  });
  function move(event) {
    if (!dragging || !geometry) return;
    const r = canvas.getBoundingClientRect(); const x = event.clientX - r.left, y = event.clientY - r.top;
    if (dragging === 'answer') {
      const t = geometry.target, dx = t.end.x - t.start.x, dy = t.end.y - t.start.y;
      state.answer = Math.round(clamp(((x - t.start.x) * dx + (y - t.start.y) * dy) / (dx * dx + dy * dy) * t.length, .01, 30) * 100) / 100;
      controls.querySelector('input').value = state.answer;
      state.feedback = '';
    } else state[dragging] = Math.round(clamp(dragging === 'a' ? (x - geometry.offsetX) / geometry.scale : (geometry.offsetY - y) / geometry.scale, 1, 12) * 10) / 10;
    updateReadout(); draw();
  }
  on(canvas, 'pointermove', move);
  on(canvas, 'pointerup', () => { dragging = ''; });
  on(canvas, 'pointercancel', () => { dragging = ''; });
  on(canvas, 'keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); check(); return; }
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const increment = ['ArrowUp', 'ArrowRight'].includes(event.key) ? .1 : -.1;
    if (state.mode === 'bridges' && !state.solved) {
      state.answer = Math.round(clamp(state.answer + increment, .01, 30) * 100) / 100;
      controls.querySelector('input').value = state.answer;
    } else if (state.mode !== 'bridges') {
      const key = ['ArrowUp', 'ArrowDown'].includes(event.key) ? 'b' : 'a'; state[key] = Math.round(clamp(state[key] + increment, 1, 12) * 10) / 10;
    }
    updateReadout(); draw();
  });
  const observer = new ResizeObserver(draw); observer.observe(canvas);
  on(document, 'formula-theme-change', draw);
  renderControls(); draw();
  return () => { alive = false; abort.abort(); observer.disconnect(); cancelAnimationFrame(frame); };
}
