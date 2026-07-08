import { requestMathTypeset } from "./utils.js";
export { openEquationModal, closeEquationModal } from "./render-dynamic.js";

const FIRST_BATCH = 72;
const NEXT_BATCH = 72;
const IDLE_TIMEOUT = 180;
const PERFORMANCE_STYLESHEET = "styles/performance.css";
const BASE_COLUMN_WIDTH = 118;
const GAP = 14;
const MIN_CARD_SPAN = 2;
const MAX_CARD_SPAN = 6;

let activeRenderToken = 0;
let activeSignature = "";
let layoutQueued = false;
let resizeBound = false;

const VARIABLE_LABELS = {
  "newton-second-law": { F: "fuerza", m: "masa", a: "aceleración" },
  "gravitational-law": { F: "fuerza", G: "constante gravitatoria", m_1: "masa 1", m_2: "masa 2", M: "masa central", r: "distancia", g: "campo gravitatorio", Phi: "potencial gravitatorio", "\\Phi": "potencial gravitatorio" },
  "quadratic-formula": { a: "coeficiente cuadrático", b: "coeficiente lineal", c: "término independiente", Delta: "discriminante", "\\Delta": "discriminante", x: "x" },
  "pythagorean-theorem": { a: "cateto a", b: "cateto b", c: "hipotenusa c", d: "distancia" }
};

export function renderEquationGrid(equations, onOpen, viewState = {}) {
  ensurePerformanceStyles();
  bindGlobalLayoutEvents();

  const grid = document.querySelector("#equationGrid");
  const template = document.querySelector("#equationCardTemplate");
  if (!grid || !template) return;

  bindGridDelegation(grid);
  grid.__equations = equations;
  grid.__onOpen = onOpen;

  const signature = buildSignature(equations, viewState);
  if (signature === activeSignature) return;
  activeSignature = signature;

  const token = ++activeRenderToken;
  grid.classList.remove("is-progressive-masonry");
  grid.classList.add("is-packed-masonry");
  grid.textContent = "";
  grid.style.height = "0px";

  if (!equations.length) {
    grid.classList.remove("is-packed-masonry", "is-loading-more");
    grid.removeAttribute("style");
    grid.innerHTML = '<div class="empty-state">No hay ecuaciones que coincidan con los filtros actuales.</div>';
    return;
  }

  appendBatch({ grid, template, equations, viewState, token, start: 0, size: FIRST_BATCH });
}

function appendBatch({ grid, template, equations, viewState, token, start, size }) {
  if (token !== activeRenderToken) return;
  const end = Math.min(equations.length, start + size);
  const fragment = document.createDocumentFragment();
  const mathTargets = [];

  for (let index = start; index < end; index += 1) {
    const card = buildCard(equations[index], index, template, viewState);
    fragment.appendChild(card);
    if (!card.classList.contains("formula-explained-mode")) mathTargets.push(card);
  }

  grid.appendChild(fragment);
  schedulePackedLayout();
  if (mathTargets.length) requestMathTypeset(mathTargets);

  if (end < equations.length) {
    grid.classList.add("is-loading-more");
    scheduleIdle(() => appendBatch({ grid, template, equations, viewState, token, start: end, size: NEXT_BATCH }));
  } else {
    grid.classList.remove("is-loading-more");
  }
}

function buildCard(eq, index, template, viewState) {
  const display = getDisplayFormula(eq, viewState.formulaDisplay || "symbolic");
  const card = template.content.firstElementChild.cloneNode(true);
  const widthLevel = getWidthLevel(display.formulas);
  card.classList.add(`size-${widthLevel}`);
  card.classList.toggle("is-multiline", display.formulas.length > 1);
  card.classList.toggle("formula-explained-mode", display.mode === "explained");
  card.dataset.eqIndex = String(index);
  card.dataset.widthLevel = String(widthLevel);
  card.style.setProperty("--formula-lines", display.formulas.length || 1);
  card.style.setProperty("--context-color", contextColor(eq, viewState.cardLabelMode));
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Abrir ficha de ${eq.name}`);
  card.querySelector("h3").innerHTML = cardTitle(eq, viewState.cardLabelMode);
  card.querySelector(".formula-box").innerHTML = renderFormulaDisplay(display);
  return card;
}

function schedulePackedLayout() {
  if (layoutQueued) return;
  layoutQueued = true;
  window.requestAnimationFrame(() => {
    layoutQueued = false;
    layoutPackedMasonry();
  });
}

function layoutPackedMasonry() {
  const grid = document.querySelector("#equationGrid.is-packed-masonry");
  if (!grid) return;

  const cards = [...grid.querySelectorAll(".equation-card")];
  if (!cards.length) {
    grid.style.height = "0px";
    return;
  }

  const columnCount = getColumnCount(grid);
  const packedWidth = columnCount * BASE_COLUMN_WIDTH + (columnCount - 1) * GAP;
  const leftOffset = Math.max(0, Math.floor((grid.clientWidth - packedWidth) / 2));
  const columnHeights = Array(columnCount).fill(0);

  cards.forEach(card => {
    const span = Math.min(columnCount, Math.max(MIN_CARD_SPAN, getMeasuredColumnSpan(card, columnCount)));
    const width = span * BASE_COLUMN_WIDTH + (span - 1) * GAP;
    card.style.width = `${width}px`;
    card.style.setProperty("--packed-width", `${width}px`);

    const height = Math.ceil(card.getBoundingClientRect().height || card.offsetHeight || 160);
    const slot = findBestSlot(columnHeights, span);
    const x = leftOffset + slot.column * (BASE_COLUMN_WIDTH + GAP);
    const y = slot.y;

    card.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    card.style.setProperty("--packed-x", `${x}px`);
    card.style.setProperty("--packed-y", `${y}px`);
    card.classList.add("is-packed");

    const nextHeight = y + height + GAP;
    for (let i = slot.column; i < slot.column + span; i += 1) columnHeights[i] = nextHeight;
  });

  const totalHeight = Math.max(...columnHeights, 0);
  grid.style.height = `${Math.ceil(totalHeight)}px`;
}

function getColumnCount(grid) {
  const width = Math.max(1, grid.clientWidth || window.innerWidth);
  return Math.max(1, Math.floor((width + GAP) / (BASE_COLUMN_WIDTH + GAP)));
}

function findBestSlot(columnHeights, span) {
  let bestColumn = 0;
  let bestY = Number.POSITIVE_INFINITY;
  for (let column = 0; column <= columnHeights.length - span; column += 1) {
    const y = Math.max(...columnHeights.slice(column, column + span));
    if (y < bestY) {
      bestY = y;
      bestColumn = column;
    }
  }
  return { column: bestColumn, y: Number.isFinite(bestY) ? bestY : 0 };
}

function getMeasuredColumnSpan(card, maxColumns) {
  const formulaBox = card.querySelector(".formula-box");
  const formulaWidth = getFormulaWidth(formulaBox);
  const titleWidth = getTitleWidth(card);
  const baseLevel = Number(card.dataset.widthLevel || 1);
  const desiredWidth = Math.max(
    220,
    titleWidth + 46,
    formulaWidth + 58,
    baseLevel === 2 ? 330 : 0,
    baseLevel === 3 ? 462 : 0
  );
  const span = Math.ceil((desiredWidth + GAP) / (BASE_COLUMN_WIDTH + GAP));
  return clamp(span, MIN_CARD_SPAN, Math.min(MAX_CARD_SPAN, maxColumns));
}

function getFormulaWidth(formulaBox) {
  if (!formulaBox) return 220;
  const nodes = [
    ...formulaBox.querySelectorAll("mjx-container"),
    ...formulaBox.querySelectorAll(".formula-stack > div"),
    ...formulaBox.querySelectorAll(".formula-words-row")
  ];
  const widths = nodes.map(node => getUnscaledWidth(node)).filter(Boolean);
  return Math.max(formulaBox.scrollWidth || 0, ...widths, 160);
}

function getTitleWidth(card) {
  const title = card.querySelector("h3");
  if (!title) return 0;
  return Math.min(520, title.scrollWidth || getUnscaledWidth(title) || 0);
}

function getUnscaledWidth(node) {
  if (!node) return 0;
  const previousTransform = node.style.transform;
  node.style.transform = "none";
  const width = node.getBoundingClientRect().width || node.scrollWidth || 0;
  node.style.transform = previousTransform;
  return width;
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

function scheduleIdle(callback) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT });
  } else {
    window.setTimeout(callback, 32);
  }
}

function ensurePerformanceStyles() {
  if (document.querySelector(`link[href="${PERFORMANCE_STYLESHEET}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = PERFORMANCE_STYLESHEET;
  document.head.appendChild(link);
}

function bindGlobalLayoutEvents() {
  if (resizeBound) return;
  resizeBound = true;
  window.addEventListener("formulas:math-typeset", schedulePackedLayout);
  window.addEventListener("resize", schedulePackedLayout);
}

function buildSignature(equations, viewState) {
  const ids = equations.map(eq => eq.id || eq.name).join("|");
  return `${viewState.formulaDisplay || "symbolic"}::${viewState.sort || ""}::${viewState.field || ""}::${viewState.level || ""}::${viewState.query || ""}::${viewState.cardLabelMode || ""}::${ids}`;
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
    .replace(/\\nabla/g, "∇")
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
  if (length > 112) return 3;
  if (length > 58) return 2;
  return 1;
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function asList(value) { return Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []; }
function escapeRegExp(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
