import { $, requestMathTypeset } from "./utils.js";
import { mountSimulation } from "./simulations.js";

let disposeSimulation = null;
let resizeHandler = null;

const GLOBAL_SYMBOLS = new Map(Object.entries({
  "=": "igualdad: ambos lados representan el mismo valor o la misma relación matemática.",
  "+": "suma: agrega términos o contribuciones.",
  "-": "resta o signo negativo: diferencia entre términos o cambio de sentido.",
  "−": "resta o signo negativo: diferencia entre términos o cambio de sentido.",
  "±": "más/menos: indica dos posibilidades, una con suma y otra con resta.",
  "×": "producto vectorial o multiplicación, según el contexto de la ecuación.",
  "·": "producto escalar, producto entre factores o derivada temporal en notación compacta.",
  "/": "división o razón entre magnitudes.",
  "∂": "derivada parcial: variación respecto a una variable manteniendo otras constantes.",
  "∇": "operador nabla: representa gradiente, divergencia, rotacional o laplaciano según cómo se use.",
  "∑": "sumatorio: suma de una familia de términos.",
  "∫": "integral: acumulación continua de una magnitud.",
  "∏": "productorio: multiplicación de una familia de factores.",
  "∞": "infinito: límite no acotado o extensión indefinida.",
  "π": "pi: constante geométrica de la circunferencia.",
  "e": "número de Euler: base de los logaritmos naturales y de la exponencial.",
  "i": "unidad imaginaria: cumple i² = -1.",
  "ℏ": "constante de Planck reducida: h dividido por 2π.",
  "h": "constante de Planck o altura, según el contexto.",
  "c": "velocidad de la luz, hipotenusa o constante de propagación, según el contexto.",
  "G": "constante gravitatoria, tensor de Einstein o energía libre, según el contexto.",
  "R": "constante, radio, curvatura escalar o constante de los gases, según el contexto.",
  "T": "temperatura, periodo o tensor, según el contexto.",
  "S": "acción, entropía, superficie o variable de estado, según el contexto.",
  "H": "Hamiltoniano, entropía de Shannon, carga hidráulica o parámetro de Hubble, según el contexto.",
  "E": "energía o campo eléctrico, según el contexto.",
  "B": "campo magnético, radiancia o ancho de banda, según el contexto.",
  "F": "fuerza, campo vectorial o función, según el contexto.",
  "p": "presión, probabilidad o momento lineal, según el contexto.",
  "q": "carga eléctrica, coordenada generalizada o variable, según el contexto.",
  "m": "masa o índice, según el contexto.",
  "r": "distancia radial, radio o tasa, según el contexto.",
  "t": "tiempo.",
  "x": "coordenada, variable independiente o dato de entrada, según el contexto.",
  "y": "coordenada, variable dependiente, etiqueta o salida, según el contexto.",
  "z": "variable compleja, coordenada o puntuación, según el contexto.",
  "v": "velocidad o variable, según el contexto.",
  "a": "lado, aceleración, parámetro o factor de escala, según el contexto.",
  "b": "lado, coeficiente o parámetro, según el contexto.",
  "d": "diferencial, distancia o dimensión, según el contexto.",
  "f": "función, frecuencia o fuerza externa, según el contexto.",
  "k": "constante, curvatura o índice discreto, según el contexto.",
  "n": "número de elementos, índice o cantidad de sustancia, según el contexto.",
  "u": "campo escalar, temperatura o velocidad de fluido, según el contexto.",
  "λ": "lambda: longitud de onda, constante o multiplicador, según el contexto.",
  "Λ": "lambda mayúscula: constante cosmológica u operador, según el contexto.",
  "μ": "mu: viscosidad, media, potencial químico o constante, según el contexto.",
  "ρ": "rho: densidad, densidad de carga o matriz densidad, según el contexto.",
  "σ": "sigma: desviación típica, conductividad, volatilidad o función de activación, según el contexto.",
  "γ": "gamma: factor relativista, parámetro o índice adiabático, según el contexto.",
  "θ": "theta: ángulo, parámetro o vector de parámetros, según el contexto.",
  "τ": "tau: tiempo propio o variable temporal auxiliar.",
  "ψ": "psi: función de onda o campo cuántico.",
  "Ψ": "psi mayúscula: función de onda del sistema.",
  "Ω": "omega mayúscula: número de microestados o dominio.",
  "ω": "omega: frecuencia angular.",
  "ε": "épsilon: permitividad, energía pequeña o término de error, según el contexto.",
  "ϵ": "épsilon: permitividad, energía pequeña o término de error, según el contexto."
}));

export function renderFilters(container, values, activeValue, onChange) {
  container.innerHTML = values.map(value => `<button class="filter-pill ${value === activeValue ? "active" : ""}" data-value="${escapeHtml(value)}">${escapeHtml(value)}</button>`).join("");
  container.querySelectorAll("button").forEach(button => button.addEventListener("click", () => onChange(button.dataset.value)));
}

export function renderEquationGrid(equations, onOpen, viewState = {}) {
  const grid = $("#equationGrid");
  const template = $("#equationCardTemplate");
  grid.innerHTML = "";
  if (!equations.length) {
    grid.innerHTML = `<div class="empty-state">No hay ecuaciones que coincidan con los filtros actuales.</div>`;
    return;
  }

  equations.forEach(eq => {
    const formulas = normalizeFormulaList(eq.formula);
    const node = template.content.firstElementChild.cloneNode(true);
    const widthLevel = getWidthLevel(formulas);
    const minColSpan = getColumnSpan(widthLevel);
    node.classList.add(`size-${widthLevel}`);
    node.classList.toggle("is-multiline", formulas.length > 1);
    node.dataset.minColSpan = String(minColSpan);
    node.style.setProperty("--formula-lines", formulas.length);
    node.style.setProperty("--col-span", minColSpan);
    node.style.setProperty("--context-color", getContextColor(eq, viewState.cardLabelMode));
    node.setAttribute("role", "button");
    node.setAttribute("aria-label", `Abrir ficha de ${eq.name}`);

    renderCardTitle($("h3", node), eq, viewState.cardLabelMode);
    $(".formula-box", node).innerHTML = renderFormula(formulas);

    node.addEventListener("click", () => onOpen(eq));
    node.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen(eq);
      }
    });
    grid.appendChild(node);
  });
  requestMathTypeset();
  scheduleMasonryLayout(grid);
}

function renderCardTitle(title, eq, mode) {
  title.innerHTML = "";
  const name = document.createElement("span");
  name.className = "card-title-name";
  name.textContent = eq.name;
  title.appendChild(name);

  const label = getCardContextLabel(eq, mode);
  if (!label) return;
  const tag = document.createElement("span");
  tag.className = `card-context-label is-${mode}`;
  tag.textContent = label;
  title.appendChild(tag);
}

function getCardContextLabel(eq, mode) {
  if (mode === "field") return eq.field;
  if (mode === "level") return eq.level;
  if (mode === "year") return formatYear(eq.year);
  return "";
}

function formatYear(year) {
  const value = Number(year);
  if (!Number.isFinite(value)) return "";
  return value < 0 ? `${Math.abs(value)} a. C.` : String(value);
}

function getContextColor(eq, mode) {
  if (mode === "year") return "var(--muted)";
  const source = mode === "level" ? eq.level : eq.field;
  return stableHsl(source || eq.name);
}

function stableHsl(value) {
  let hash = 0;
  const text = String(value || "");
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return `hsl(${hash % 360} 78% 48%)`;
}

function renderFormula(formulas) {
  if (formulas.length === 1) return `\(${formulas[0]}\)`;
  return `<div class="formula-stack">${formulas.map(line => `<div>\(${line}\)</div>`).join("")}</div>`;
}

function normalizeFormulaList(formula) {
  return Array.isArray(formula) ? formula : [formula];
}

function getWidthLevel(formulas) {
  const length = getMaxFormulaLength(formulas);
  if (length > 82) return 3;
  if (length > 42) return 2;
  return 1;
}

function getColumnSpan(widthLevel) {
  return { 1: 2, 2: 3, 4: 4, 3: 4 }[widthLevel] ?? 2;
}

function getMaxFormulaLength(formulas) {
  return Math.max(...formulas.map(normalizeFormulaLength));
}

function normalizeFormulaLength(formula) {
  return formula
    .replace(/\\frac/g, "ffff")
    .replace(/\\partial/g, "ddd")
    .replace(/\\mathbf/g, "bb")
    .replace(/\\nabla/g, "nn")
    .replace(/\\lVert/g, "xxxxx")
    .replace(/\\rVert/g, "xxxxx")
    .replace(/\\[a-zA-Z]+/g, "x")
    .replace(/[{}]/g, "")
    .length;
}

function scheduleMasonryLayout(grid) {
  const run = () => applyMasonrySpans(grid);
  window.setTimeout(run, 80);
  window.setTimeout(run, 260);
  window.setTimeout(run, 640);
  if (resizeHandler) window.removeEventListener("resize", resizeHandler);
  resizeHandler = run;
  window.addEventListener("resize", resizeHandler);
}

function applyMasonrySpans(grid) {
  const computed = getComputedStyle(grid);
  const rowHeight = parseFloat(computed.gridAutoRows) || 10;
  const rowGap = parseFloat(computed.rowGap) || 0;
  grid.querySelectorAll(".equation-card").forEach(card => {
    const minSpan = Number(card.dataset.minColSpan || 2);
    const height = card.getBoundingClientRect().height;
    const span = Math.max(minSpan, Math.ceil((height + rowGap) / (rowHeight + rowGap)));
    card.style.gridRowEnd = `span ${span}`;
  });
}

export function openEquationModal(eq) {
  const modal = $("#equationModal");
  const content = $("#modalContent");
  const formulas = normalizeFormulaList(eq.formula);
  content.innerHTML = `
    <section class="detail-shell" style="--equation-color: ${eq.color}">
      <header class="detail-header compact">
        <h2>${escapeHtml(eq.name)}</h2>
      </header>
      <nav class="detail-tabs" aria-label="Secciones de la ficha">
        ${tabButton("formula", "Fórmula", true)}
        ${tabButton("meaning", "Significado")}
        ${tabButton("history", "Historia")}
        ${tabButton("derivation", "Derivación")}
        ${tabButton("uses", "Usos")}
        ${tabButton("simulation", "Simulación")}
        ${tabButton("metadata", "Ficha")}
      </nav>
      <div class="detail-panels">
        <section class="detail-panel formula-view active" data-panel="formula">
          <div class="formula-box modal-formula" aria-label="Fórmula interactiva">${renderFormula(formulas)}</div>
        </section>
        <section class="detail-panel text-view" data-panel="meaning">
          <p>${escapeHtml(eq.meaning)}</p>
        </section>
        <section class="detail-panel text-view" data-panel="history">
          <p>${escapeHtml(eq.history)}</p>
        </section>
        <section class="detail-panel text-view" data-panel="derivation">
          <p>${escapeHtml(eq.derivation)}</p>
        </section>
        <section class="detail-panel uses-view" data-panel="uses">
          ${eq.uses.map(use => `<span>${escapeHtml(use)}</span>`).join("")}
        </section>
        <section class="detail-panel simulation-view" data-panel="simulation">
          <canvas id="simulationCanvas" width="760" height="320" aria-label="Simulación de ${escapeHtml(eq.name)}"></canvas>
          <div class="sim-controls" id="simulationControls"></div>
        </section>
        <section class="detail-panel metadata-view" data-panel="metadata">
          ${metadataRow("Autoría", eq.author)}
          ${metadataRow("Año", eq.year < 0 ? `${Math.abs(eq.year)} a. C.` : eq.year)}
          ${metadataRow("Área", eq.field)}
          ${metadataRow("Nivel", eq.level)}
          ${metadataRow("Variables", eq.variables.join(" · "))}
        </section>
      </div>
    </section>`;

  bindTabs(content, eq);
  modal.showModal();
  requestMathTypeset();
  scheduleModalFormulaFit(content);
  scheduleSymbolTooltips(content, eq);
}

function tabButton(panel, label, active = false) {
  return `<button class="${active ? "active" : ""}" data-target="${panel}" type="button">${label}</button>`;
}

function metadataRow(label, value) {
  return `<div><span>${label}</span><strong>${escapeHtml(String(value))}</strong></div>`;
}

function bindTabs(content, eq) {
  const buttons = [...content.querySelectorAll(".detail-tabs button")];
  const panels = [...content.querySelectorAll(".detail-panel")];
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(item => item.classList.toggle("active", item === button));
      panels.forEach(panel => panel.classList.toggle("active", panel.dataset.panel === button.dataset.target));
      if (button.dataset.target === "simulation") {
        if (disposeSimulation) disposeSimulation();
        const canvas = $("#simulationCanvas");
        const controls = $("#simulationControls");
        disposeSimulation = mountSimulation(eq.simulation, canvas, controls);
      }
      if (button.dataset.target === "formula") {
        requestMathTypeset();
        scheduleModalFormulaFit(content);
        scheduleSymbolTooltips(content, eq);
      }
    });
  });
}

export function closeEquationModal() {
  if (disposeSimulation) disposeSimulation();
  disposeSimulation = null;
  $("#equationModal").close();
}

function scheduleModalFormulaFit(root) {
  const run = () => fitModalFormula(root.querySelector(".modal-formula"));
  window.setTimeout(run, 60);
  window.setTimeout(run, 180);
  window.setTimeout(run, 420);
}

function fitModalFormula(box) {
  if (!box) return;
  const math = box.querySelector("mjx-container");
  if (!math) return;
  math.style.transform = "";
  const available = Math.max(1, box.clientWidth - 12);
  const width = math.getBoundingClientRect().width;
  if (width > available) math.style.transform = `scale(${Math.max(0.55, available / width)})`;
}

function scheduleSymbolTooltips(root, eq) {
  const run = () => annotateFormulaSymbols(root.querySelector(".modal-formula"), eq);
  window.setTimeout(run, 180);
  window.setTimeout(run, 420);
  window.setTimeout(run, 900);
}

function annotateFormulaSymbols(box, eq) {
  if (!box) return;
  box.querySelectorAll(".formula-token-hitbox").forEach(node => node.remove());
  const glossary = buildEquationGlossary(eq);
  const symbols = [...box.querySelectorAll("svg g[data-mml-node='mi'], svg g[data-mml-node='mo']")];
  symbols.forEach(symbolNode => {
    const symbol = extractMathSymbol(symbolNode);
    const description = glossary.get(symbol) || GLOBAL_SYMBOLS.get(symbol);
    if (!description) return;
    addSymbolHitbox(symbolNode, symbol, description);
  });
}

function buildEquationGlossary(eq) {
  const glossary = new Map(GLOBAL_SYMBOLS);
  eq.variables.forEach(entry => {
    const [rawSymbol, ...rest] = entry.split(":");
    const description = rest.join(":").trim();
    rawSymbol.split(/[\/|,]| y | e /).forEach(part => {
      const key = normalizeSymbolKey(part);
      if (key && description) glossary.set(key, description);
    });
  });
  return glossary;
}

function extractMathSymbol(node) {
  const codes = [...node.querySelectorAll("use[data-c]")].map(use => use.getAttribute("data-c"));
  if (codes.length) return codes.map(code => String.fromCodePoint(parseInt(code, 16))).join("").normalize("NFKC");
  return node.textContent.trim().normalize("NFKC");
}

function addSymbolHitbox(symbolNode, symbol, description) {
  const svg = symbolNode.closest("svg");
  const box = symbolNode.getBBox();
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.classList.add("formula-token-hitbox");
  rect.setAttribute("x", box.x - 3);
  rect.setAttribute("y", box.y - 3);
  rect.setAttribute("width", box.width + 6);
  rect.setAttribute("height", box.height + 6);
  rect.setAttribute("rx", "4");
  rect.dataset.symbol = symbol;
  rect.dataset.description = description;
  rect.setAttribute("tabindex", "0");
  rect.setAttribute("aria-label", `${symbol}: ${description}`);
  symbolNode.parentNode.insertBefore(rect, symbolNode.nextSibling);
  wireSymbolTooltip(rect, svg);
}

function wireSymbolTooltip(target, svg) {
  const show = event => showSymbolTooltip(target.dataset.symbol, target.dataset.description, event.clientX, event.clientY);
  const hide = () => hideSymbolTooltip();
  target.addEventListener("mousemove", show);
  target.addEventListener("focus", () => {
    const rect = svg.getBoundingClientRect();
    showSymbolTooltip(target.dataset.symbol, target.dataset.description, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
  target.addEventListener("mouseleave", hide);
  target.addEventListener("blur", hide);
}

function showSymbolTooltip(symbol, description, x, y) {
  let tooltip = document.querySelector(".symbol-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "symbol-tooltip";
    document.body.appendChild(tooltip);
  }
  tooltip.innerHTML = `<strong>${escapeHtml(symbol)}</strong><span>${escapeHtml(description)}</span>`;
  tooltip.classList.add("visible");
  tooltip.style.left = `${Math.min(x + 14, window.innerWidth - 280)}px`;
  tooltip.style.top = `${Math.min(y + 14, window.innerHeight - 120)}px`;
}

function hideSymbolTooltip() {
  document.querySelector(".symbol-tooltip")?.classList.remove("visible");
}

function normalizeSymbolKey(value) {
  return value
    .trim()
    .normalize("NFKC")
    .replace(/[₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹0-9]/g, "")
    .replace(/[{}()[\]^_\\]/g, "")
    .trim();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
