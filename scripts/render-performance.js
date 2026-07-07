import { requestMathTypeset } from "./utils.js";
export { openEquationModal, closeEquationModal } from "./render-dynamic.js";

let activeGridRender = null;
const FIRST_CHUNK = 48;
const NEXT_CHUNK = 96;

const VARIABLE_LABELS = {
  "newton-second-law": { F: "fuerza", m: "masa", a: "aceleración" },
  "gravitational-law": { F: "fuerza", G: "constante gravitatoria", m_1: "masa 1", m_2: "masa 2", M: "masa central", r: "distancia", g: "campo gravitatorio", Phi: "potencial gravitatorio", "\\Phi": "potencial gravitatorio" },
  "quadratic-formula": { a: "coeficiente cuadrático", b: "coeficiente lineal", c: "término independiente", Delta: "discriminante", "\\Delta": "discriminante", x: "x" },
  "pythagorean-theorem": { a: "cateto a", b: "cateto b", c: "hipotenusa c", d: "distancia" },
  "law-of-sines": { a: "lado a", b: "lado b", c: "lado c", A: "ángulo A", B: "ángulo B", C: "ángulo C", R: "radio circunscrito" },
  "law-of-cosines": { a: "lado a", b: "lado b", c: "lado c", A: "ángulo A", B: "ángulo B", C: "ángulo C" },
  "bernoulli-equation": { p: "presión", rho: "densidad", "\\rho": "densidad", v: "velocidad", g: "gravedad", h: "altura", H: "carga hidráulica" },
  "continuity-equation": { A_1: "área 1", A_2: "área 2", v_1: "velocidad 1", v_2: "velocidad 2", Q: "caudal", A: "área", v: "velocidad", rho: "densidad", "\\rho": "densidad" },
  "wave-equation": { u: "perturbación", t: "tiempo", x: "posición", c: "velocidad" }
};

export function renderEquationGrid(equations, onOpen, viewState = {}) {
  const grid = document.querySelector("#equationGrid");
  const template = document.querySelector("#equationCardTemplate");
  if (!grid || !template) return;

  if (activeGridRender) activeGridRender.cancelled = true;
  const controller = { cancelled: false };
  activeGridRender = controller;

  bindGridDelegation(grid);
  grid.__equations = equations;
  grid.__onOpen = onOpen;
  grid.textContent = "";
  grid.classList.remove("is-progressive-rendering");
  grid.removeAttribute("aria-busy");

  if (!equations.length) {
    grid.innerHTML = '<div class="empty-state">No hay ecuaciones que coincidan con los filtros actuales.</div>';
    return;
  }

  grid.classList.add("is-progressive-rendering");
  grid.setAttribute("aria-busy", "true");

  let index = 0;
  const appendChunk = chunkSize => {
    if (controller.cancelled) return;
    const fragment = document.createDocumentFragment();
    const mathTargets = [];
    const end = Math.min(index + chunkSize, equations.length);

    for (; index < end; index += 1) {
      const card = buildCard(equations[index], index, template, viewState);
      fragment.appendChild(card);
      mathTargets.push(card);
    }

    grid.appendChild(fragment);
    requestMathTypeset(mathTargets);

    if (index < equations.length) {
      scheduleIdle(() => appendChunk(NEXT_CHUNK));
      return;
    }

    grid.classList.remove("is-progressive-rendering");
    grid.removeAttribute("aria-busy");
  };

  appendChunk(Math.min(FIRST_CHUNK, equations.length));
}

function buildCard(eq, index, template, viewState) {
  const display = getDisplayFormula(eq, viewState.formulaDisplay || "symbolic");
  const card = template.content.firstElementChild.cloneNode(true);
  const widthLevel = getWidthLevel(display.formulas);
  card.classList.add(`size-${widthLevel}`);
  card.classList.toggle("is-multiline", display.formulas.length > 1);
  card.classList.toggle("formula-explained-mode", display.mode === "explained");
  card.dataset.eqIndex = String(index);
  card.style.setProperty("--formula-lines", display.formulas.length || 1);
  card.style.setProperty("--col-span", getColumnSpan(widthLevel));
  card.style.setProperty("--row-span", getRowSpan(widthLevel, display.formulas.length, display.mode));
  card.style.setProperty("--context-color", contextColor(eq, viewState.cardLabelMode));
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Abrir ficha de ${eq.name}`);
  card.querySelector("h3").innerHTML = cardTitle(eq, viewState.cardLabelMode);
  card.querySelector(".formula-box").innerHTML = renderFormulaDisplay(display);
  return card;
}

function bindGridDelegation(grid) {
  if (grid.dataset.delegated === "true") return;
  grid.dataset.delegated = "true";

  const openCard = event => {
    const card = event.target.closest?.(".equation-card");
    if (!card || !grid.contains(card)) return;
    const eq = grid.__equations?.[Number(card.dataset.eqIndex)];
    if (eq) grid.__onOpen?.(eq);
  };

  grid.addEventListener("click", openCard);
  grid.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest?.(".equation-card");
    if (!card || !grid.contains(card)) return;
    event.preventDefault();
    openCard(event);
  });
}

function getDisplayFormula(eq, mode) {
  const symbolic = asList(eq.formula);
  const explained = asList(eq.formulaText || eq.formula_text || eq.explainedFormula).map(normalizeExplainedFormula);
  if (mode === "explained") return { mode: "explained", formulas: explained.length ? explained : symbolic.map(line => semiverbalizeFormula(line, eq)) };
  return { mode: "symbolic", formulas: symbolic.length ? symbolic : explained };
}

function renderFormulaDisplay(display) {
  if (display.mode === "explained") {
    return `<div class="formula-words-stack">${display.formulas.map(line => `<div class="formula-words-row">${escapeHtml(line)}</div>`).join("")}</div>`;
  }
  if (display.formulas.length === 1) return `\\(${display.formulas[0]}\\)`;
  return `<div class="formula-stack">${display.formulas.map(line => `<div>\\(${line}\\)</div>`).join("")}</div>`;
}

function normalizeExplainedFormula(value) {
  return String(value)
    .replace(/\bes igual a\b/gi, "=")
    .replace(/\bpor\b/gi, "·")
    .replace(/\bdividida por\b/gi, "/")
    .replace(/\bdividido por\b/gi, "/")
    .replace(/\bmás\b/gi, "+")
    .replace(/\bmenos\b/gi, "−")
    .replace(/\s*([=+−±/·])\s*/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
}

function semiverbalizeFormula(formula, eq) {
  const labels = VARIABLE_LABELS[eq.id] || {};
  let text = String(formula)
    .replace(/\\mathbf\{([^{}]+)\}/g, "$1")
    .replace(/\\hat\{([^{}]+)\}/g, "$1")
    .replace(/\\mathrm\{cte\}/g, "constante")
    .replace(/\\left|\\right/g, "")
    .replace(/\\cdots/g, "···")
    .replace(/\\infty/g, "∞")
    .replace(/\\Delta/g, "Delta")
    .replace(/\\Phi/g, "Phi")
    .replace(/\\rho/g, "rho")
    .replace(/\\pi/g, "π")
    .replace(/\\sin/g, "sin")
    .replace(/\\cos/g, "cos")
    .replace(/\\nabla/g, "∇");

  text = replaceFractions(text);
  text = replaceSquareRoots(text);
  text = text
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/\^\{2\}/g, "²")
    .replace(/\^\{3\}/g, "³")
    .replace(/\\pm/g, "±")
    .replace(/\\,/g, " ")
    .replace(/[{}]/g, "")
    .replace(/\*/g, "·")
    .replace(/-/g, "−");

  Object.entries(labels).sort((a, b) => b[0].length - a[0].length).forEach(([symbol, label]) => {
    const safe = escapeRegExp(symbol.replace(/^\\/, ""));
    text = text.replace(new RegExp(`(^|[^A-Za-z0-9_])${safe}(?=$|[^A-Za-z0-9_])`, "g"), `$1${label}`);
  });

  return normalizeExplainedFormula(text);
}

function replaceFractions(value) {
  let text = value;
  const pattern = /\\frac\{([^{}]+)\}\{([^{}]+)\}/g;
  let previous = "";
  while (previous !== text) {
    previous = text;
    text = text.replace(pattern, "($1) / ($2)");
  }
  return text;
}

function replaceSquareRoots(value) {
  let text = value;
  const pattern = /\\sqrt\{([^{}]+)\}/g;
  let previous = "";
  while (previous !== text) {
    previous = text;
    text = text.replace(pattern, "√($1)");
  }
  return text;
}

function cardTitle(eq, mode) {
  const label = mode === "field" ? eq.field : mode === "level" ? eq.level : mode === "year" ? formatYear(eq.year) : "";
  return `<span class="card-title-name">${escapeHtml(eq.name)}</span>${label ? `<span class="card-context-label is-${escapeHtml(mode)}">${escapeHtml(label)}</span>` : ""}`;
}

function formatYear(year) {
  const value = Number(year);
  if (!Number.isFinite(value)) return "";
  return value < 0 ? `${Math.abs(value)} a. C.` : String(value);
}

function contextColor(eq, mode) {
  const source = mode === "level" ? eq.level : eq.field || eq.name;
  let hash = 0;
  for (const char of String(source)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `hsl(${hash % 360} 78% 48%)`;
}

function getWidthLevel(lines) {
  const length = Math.max(1, ...asList(lines).map(line => String(line).length));
  if (length > 120) return 3;
  if (length > 64) return 2;
  return 1;
}

function getColumnSpan(level) { return { 1: 2, 2: 3, 3: 4 }[level] || 2; }
function getRowSpan(level, lines, mode) {
  const base = { 1: 16, 2: 17, 3: 19 }[level] || 16;
  const extraLines = Math.max(0, Number(lines || 1) - 1) * 5;
  const explained = mode === "explained" ? 2 : 0;
  return base + extraLines + explained;
}
function asList(value) { return Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []; }
function scheduleIdle(callback) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(callback, { timeout: 120 });
    return;
  }
  window.setTimeout(callback, 16);
}
function escapeRegExp(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
