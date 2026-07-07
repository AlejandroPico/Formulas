export { openEquationModal, closeEquationModal } from "./render-dynamic.js";

const CARD_MIN_WIDTH = 236;
const CARD_ROW_HEIGHT = 214;
const CARD_GAP = 14;
const OVERSCAN_ROWS = 4;

let virtualState = null;
let scrollBound = false;
let renderScheduled = false;

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
  bindViewportListeners();

  grid.__equations = equations;
  grid.__onOpen = onOpen;
  grid.classList.add("is-virtualized");
  grid.textContent = "";

  if (!equations.length) {
    virtualState = null;
    grid.classList.remove("is-virtualized");
    grid.innerHTML = '<div class="empty-state">No hay ecuaciones que coincidan con los filtros actuales.</div>';
    return;
  }

  virtualState = {
    equations,
    viewState,
    template,
    grid,
    columns: getColumnCount(grid),
    start: -1,
    end: -1
  };

  updateVirtualGrid(true);
}

function updateVirtualGrid(force = false) {
  if (!virtualState) return;
  const { grid, equations, viewState, template } = virtualState;
  const columns = getColumnCount(grid);
  const top = Math.max(0, window.scrollY - grid.getBoundingClientRect().top - window.scrollY);
  const viewportTop = Math.max(0, window.scrollY - pageTop(grid));
  const viewportBottom = viewportTop + window.innerHeight;
  const rowPitch = CARD_ROW_HEIGHT + CARD_GAP;
  const totalRows = Math.ceil(equations.length / columns);
  const startRow = Math.max(0, Math.floor(viewportTop / rowPitch) - OVERSCAN_ROWS);
  const endRow = Math.min(totalRows, Math.ceil(viewportBottom / rowPitch) + OVERSCAN_ROWS);
  const start = Math.max(0, startRow * columns);
  const end = Math.min(equations.length, endRow * columns);

  if (!force && virtualState.columns === columns && virtualState.start === start && virtualState.end === end) return;
  virtualState.columns = columns;
  virtualState.start = start;
  virtualState.end = end;

  const fragment = document.createDocumentFragment();
  fragment.appendChild(spacer(startRow * rowPitch, "top"));
  for (let index = start; index < end; index += 1) {
    fragment.appendChild(buildCard(equations[index], index, template, viewState));
  }
  fragment.appendChild(spacer(Math.max(0, (totalRows - endRow) * rowPitch), "bottom"));

  grid.replaceChildren(fragment);
}

function buildCard(eq, index, template, viewState) {
  const display = getCardDisplay(eq, viewState.formulaDisplay || "symbolic");
  const card = template.content.firstElementChild.cloneNode(true);
  card.dataset.eqIndex = String(index);
  card.style.setProperty("--context-color", contextColor(eq, viewState.cardLabelMode));
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Abrir ficha de ${eq.name}`);
  card.querySelector("h3").innerHTML = cardTitle(eq, viewState.cardLabelMode);
  card.querySelector(".formula-box").innerHTML = `<span class="formula-card-text">${escapeHtml(display)}</span>`;
  return card;
}

function getCardDisplay(eq, mode) {
  const formula = asList(eq.formula);
  const explained = asList(eq.formulaText || eq.formula_text || eq.explainedFormula).map(normalizeExplainedFormula);
  if (mode === "explained") return explained[0] || eq.summary || semiverbalizeFormula(formula[0] || "", eq);
  return stripMathForCard(formula[0] || explained[0] || eq.summary || "");
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

function bindViewportListeners() {
  if (scrollBound) return;
  scrollBound = true;
  window.addEventListener("scroll", scheduleVirtualUpdate, { passive: true });
  window.addEventListener("resize", scheduleVirtualUpdate);
}

function scheduleVirtualUpdate() {
  if (renderScheduled) return;
  renderScheduled = true;
  window.requestAnimationFrame(() => {
    renderScheduled = false;
    updateVirtualGrid(false);
  });
}

function spacer(height, kind) {
  const node = document.createElement("div");
  node.className = `virtual-grid-spacer virtual-grid-spacer-${kind}`;
  node.style.height = `${Math.round(height)}px`;
  return node;
}

function getColumnCount(grid) {
  const width = Math.max(1, grid.clientWidth || grid.getBoundingClientRect().width || window.innerWidth);
  return Math.max(1, Math.floor((width + CARD_GAP) / (CARD_MIN_WIDTH + CARD_GAP)));
}

function pageTop(element) {
  return element.getBoundingClientRect().top + window.scrollY;
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

function stripMathForCard(value) {
  return String(value)
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)")
    .replace(/\\sqrt\{([^{}]+)\}/g, "√($1)")
    .replace(/\\left|\\right/g, "")
    .replace(/\\cdot/g, "·")
    .replace(/\\times/g, "×")
    .replace(/\\pm/g, "±")
    .replace(/\\Delta/g, "Δ")
    .replace(/\\rho/g, "ρ")
    .replace(/\\lambda/g, "λ")
    .replace(/\\pi/g, "π")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

function asList(value) { return Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []; }
function escapeRegExp(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
