import { requestMathTypeset } from "./utils.js?v=20260715a";
export { openEquationModal, closeEquationModal } from "./render-dynamic.js";

const FIRST_BATCH = 48;
const NEXT_BATCH = 48;
const IDLE_TIMEOUT = 220;
const CELL = 10;
const GAP = 14;
const MIN_CARD_WIDTH = 220;
const MAX_CARD_WIDTH = 820;
const CARD_HORIZONTAL_PADDING = 48;
const MIN_FORMULA_SCALE = 0.72;

let activeRenderToken = 0;
let activeSignature = "";
let layoutState = null;
let resizeTimer = 0;
let globalEventsBound = false;

const VARIABLE_LABELS = {
  "newton-second-law": { F: "fuerza", m: "masa", a: "aceleración" },
  "gravitational-law": { F: "fuerza", G: "constante gravitatoria", m_1: "masa 1", m_2: "masa 2", M: "masa central", r: "distancia", g: "campo gravitatorio", Phi: "potencial gravitatorio", "\\Phi": "potencial gravitatorio" },
  "quadratic-formula": { a: "coeficiente cuadrático", b: "coeficiente lineal", c: "término independiente", Delta: "discriminante", "\\Delta": "discriminante", x: "x" },
  "pythagorean-theorem": { a: "cateto a", b: "cateto b", c: "hipotenusa c", d: "distancia" }
};

export function renderEquationGrid(equations, onOpen, viewState = {}) {
  const grid = document.querySelector("#equationGrid");
  const template = document.querySelector("#equationCardTemplate");
  if (!grid || !template) return;

  bindGridDelegation(grid);
  bindGlobalEvents();
  grid.__equations = equations;
  grid.__onOpen = onOpen;

  const signature = buildSignature(equations, viewState);
  if (signature === activeSignature && grid.childElementCount) return;
  activeSignature = signature;

  const token = ++activeRenderToken;
  grid.className = "equation-grid is-measured-mosaic";
  grid.dataset.layoutEngine = "measured-skyline-v2";
  grid.replaceChildren();
  grid.style.height = "0px";

  if (!equations.length) {
    layoutState = null;
    grid.className = "equation-grid";
    grid.removeAttribute("style");
    grid.innerHTML = '<div class="empty-state">No hay ecuaciones que coincidan con los filtros actuales.</div>';
    window.dispatchEvent(new CustomEvent("formulas:first-layout-ready"));
    return;
  }

  layoutState = createLayoutState(grid, template, equations, viewState, token);
  processBatch(layoutState, 0, FIRST_BATCH, true);
}

function createLayoutState(grid, template, equations, viewState, token) {
  const columns = Math.max(1, Math.floor(Math.max(1, grid.clientWidth) / CELL));
  return {
    grid,
    template,
    equations,
    viewState,
    token,
    columns,
    columnHeights: new Float64Array(columns),
    maxHeight: 0,
    placedCards: []
  };
}

async function processBatch(state, start, size, firstBatch = false) {
  if (!isActive(state)) return;
  const end = Math.min(state.equations.length, start + size);
  const fragment = document.createDocumentFragment();
  const cards = [];
  const mathTargets = [];

  for (let index = start; index < end; index += 1) {
    const card = buildCard(state.equations[index], index, state.template, state.viewState);
    fragment.appendChild(card);
    cards.push(card);
    if (!card.classList.contains("formula-explained-mode")) mathTargets.push(card);
  }

  state.grid.appendChild(fragment);
  if (mathTargets.length) await requestMathTypeset(mathTargets);
  if (!isActive(state)) return;

  cards.forEach(card => measureAndPlaceCard(state, card));
  updateGridHeight(state);

  if (firstBatch) window.dispatchEvent(new CustomEvent("formulas:first-layout-ready"));

  if (end < state.equations.length) {
    state.grid.classList.add("is-loading-more");
    scheduleIdle(() => processBatch(state, end, NEXT_BATCH, false));
  } else {
    state.grid.classList.remove("is-loading-more");
  }
}

function buildCard(eq, index, template, viewState) {
  const display = getDisplayFormula(eq, viewState.formulaDisplay || "symbolic");
  const card = template.content.firstElementChild.cloneNode(true);
  card.classList.add("is-measuring");
  card.classList.toggle("is-multiline", display.formulas.length > 1);
  card.classList.toggle("formula-explained-mode", display.mode === "explained");
  card.dataset.eqIndex = String(index);
  card.dataset.formulaLines = String(Math.max(1, display.formulas.length));
  card.style.setProperty("--context-color", contextColor(eq, viewState.cardLabelMode));
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Abrir ficha de ${eq.name}`);
  card.querySelector("h3").innerHTML = cardTitle(eq, viewState.cardLabelMode);
  card.querySelector(".formula-box").innerHTML = renderFormulaDisplay(display);
  return card;
}

function measureAndPlaceCard(state, card) {
  const gridWidth = Math.max(1, state.grid.clientWidth);
  const maxWidth = Math.max(MIN_CARD_WIDTH, Math.min(MAX_CARD_WIDTH, gridWidth - 8));
  const formulaWidth = measureFormulaWidth(card);
  const titleWidth = measureTitleWidth(card);
  const desiredWidth = Math.max(
    MIN_CARD_WIDTH,
    formulaWidth + CARD_HORIZONTAL_PADDING,
    Math.min(480, titleWidth + CARD_HORIZONTAL_PADDING)
  );
  const finalWidth = Math.min(maxWidth, Math.ceil(desiredWidth));
  const formulaScale = formulaWidth + CARD_HORIZONTAL_PADDING > finalWidth
    ? clamp((finalWidth - CARD_HORIZONTAL_PADDING) / Math.max(1, formulaWidth), MIN_FORMULA_SCALE, 1)
    : 1;

  card.style.width = `${finalWidth}px`;
  card.style.setProperty("--formula-scale", formulaScale.toFixed(3));
  card.classList.remove("is-measuring");
  card.classList.add("is-sized");

  const height = Math.ceil(card.getBoundingClientRect().height || card.offsetHeight || 150);
  const span = Math.min(state.columns, Math.max(1, Math.ceil((finalWidth + GAP) / CELL)));
  const slot = findBestSkylineSlot(state.columnHeights, span);
  const usableWidth = state.columns * CELL;
  const offsetX = Math.max(0, Math.floor((state.grid.clientWidth - usableWidth) / 2));
  const x = offsetX + slot.column * CELL;
  const y = slot.y;
  const nextHeight = y + height + GAP;

  for (let column = slot.column; column < slot.column + span; column += 1) {
    state.columnHeights[column] = nextHeight;
  }
  state.maxHeight = Math.max(state.maxHeight, nextHeight);
  state.placedCards.push(card);

  card.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  card.dataset.cardWidth = String(finalWidth);
  card.dataset.cardHeight = String(height);
  card.classList.add("is-placed");
}

function findBestSkylineSlot(heights, span) {
  let bestColumn = 0;
  let bestY = Number.POSITIVE_INFINITY;
  let bestWaste = Number.POSITIVE_INFINITY;

  for (let column = 0; column <= heights.length - span; column += 1) {
    let y = 0;
    for (let i = column; i < column + span; i += 1) y = Math.max(y, heights[i]);

    let waste = 0;
    for (let i = column; i < column + span; i += 1) waste += y - heights[i];

    if (y < bestY || (y === bestY && waste < bestWaste)) {
      bestColumn = column;
      bestY = y;
      bestWaste = waste;
    }
  }

  return { column: bestColumn, y: Number.isFinite(bestY) ? bestY : 0 };
}

function measureFormulaWidth(card) {
  const box = card.querySelector(".formula-box");
  if (!box) return 0;
  const candidates = [
    ...box.querySelectorAll("mjx-container > svg"),
    ...box.querySelectorAll("mjx-container"),
    ...box.querySelectorAll(".formula-line"),
    ...box.querySelectorAll(".formula-words-row")
  ];
  const widths = candidates.map(node => {
    const rect = node.getBoundingClientRect();
    return Math.max(rect.width || 0, node.scrollWidth || 0);
  });
  return Math.max(0, box.scrollWidth || 0, ...widths);
}

function measureTitleWidth(card) {
  const title = card.querySelector("h3");
  if (!title) return 0;
  const previousWhiteSpace = title.style.whiteSpace;
  const previousWidth = title.style.width;
  title.style.whiteSpace = "nowrap";
  title.style.width = "max-content";
  const width = Math.max(title.scrollWidth || 0, title.getBoundingClientRect().width || 0);
  title.style.whiteSpace = previousWhiteSpace;
  title.style.width = previousWidth;
  return width;
}

function updateGridHeight(state) {
  state.grid.style.height = `${Math.max(180, Math.ceil(state.maxHeight))}px`;
}

function repackVisibleCards() {
  if (!layoutState || !isActive(layoutState)) return;
  const state = layoutState;
  state.columns = Math.max(1, Math.floor(Math.max(1, state.grid.clientWidth) / CELL));
  state.columnHeights = new Float64Array(state.columns);
  state.maxHeight = 0;
  state.placedCards = [];
  const cards = [...state.grid.querySelectorAll(".equation-card.is-sized")];
  cards.forEach(card => {
    card.classList.remove("is-placed");
    measureAndPlaceCard(state, card);
  });
  updateGridHeight(state);
}

function getDisplayFormula(eq, mode) {
  const symbolic = asList(eq.formula);
  const explained = asList(eq.formulaText || eq.formula_text || eq.explainedFormula).map(normalizeExplainedFormula);
  if (mode === "explained") {
    return { mode: "explained", formulas: explained.length ? explained : symbolic.map(line => semiverbalizeFormula(line, eq)) };
  }
  return { mode: "symbolic", formulas: symbolic.length ? symbolic : explained };
}

function renderFormulaDisplay(display) {
  if (display.mode === "explained") {
    return `<div class="formula-words-stack">${display.formulas.map(line => `<div class="formula-words-row">${escapeHtml(line)}</div>`).join("")}</div>`;
  }
  return `<div class="formula-stack">${display.formulas.map(line => `<div class="formula-line">\\(${line}\\)</div>`).join("")}</div>`;
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

function bindGlobalEvents() {
  if (globalEventsBound) return;
  globalEventsBound = true;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(repackVisibleCards, 140);
  });
}

function scheduleIdle(callback) {
  if ("requestIdleCallback" in window) window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT });
  else window.setTimeout(callback, 32);
}

function isActive(state) {
  return Boolean(state && layoutState === state && state.token === activeRenderToken && state.grid.isConnected);
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

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function asList(value) { return Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []; }
function escapeRegExp(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
