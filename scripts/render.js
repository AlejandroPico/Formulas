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

export function renderEquationGrid(equations, onOpen) {
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
    node.setAttribute("role", "button");
    node.setAttribute("aria-label", `Abrir ficha de ${eq.name}`);

    $("h3", node).textContent = eq.name;
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
  return { 1: 2, 2: 3, 3: 4 }[widthLevel] ?? 2;
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
  const columnGap = parseFloat(computed.columnGap) || 0;
  const columnTracks = computed.gridTemplateColumns.split(" ").filter(Boolean);
  const columnCount = Math.max(1, columnTracks.length);
  const columnWidth = parseFloat(columnTracks[0]) || 118;

  const cards = [...grid.querySelectorAll(".equation-card")];

  cards.forEach(card => {
    const minSpan = Math.min(columnCount, Number(card.dataset.minColSpan || 2));
    card.style.gridColumn = `span ${Math.max(1, minSpan)}`;
    card.style.gridRowEnd = "auto";
  });

  cards.forEach(card => {
    if (columnCount <= 1) {
      card.style.gridColumn = "span 1";
      return;
    }
    const minSpan = Number(card.dataset.minColSpan || 2);
    const desiredWidth = Math.max(getRenderedFormulaWidth(card), getRenderedTitleWidth(card)) + 58;
    const measuredSpan = Math.ceil((desiredWidth + columnGap) / (columnWidth + columnGap));
    const finalSpan = Math.max(2, Math.min(columnCount, Math.max(minSpan, measuredSpan)));
    card.style.gridColumn = `span ${finalSpan}`;
  });

  cards.forEach(card => {
    const height = card.scrollHeight;
    const span = Math.ceil((height + rowGap) / (rowHeight + rowGap));
    card.style.gridRowEnd = `span ${span}`;
  });
}

function getRenderedFormulaWidth(card) {
  const formulaBox = $(".formula-box", card);
  const mathNodes = [...formulaBox.querySelectorAll("mjx-container")];
  const mathWidths = mathNodes.map(node => Math.ceil(node.getBoundingClientRect().width || node.scrollWidth || 0));
  const stackLineWidths = [...formulaBox.querySelectorAll(".formula-stack > div")].map(node => node.scrollWidth || 0);
  return Math.max(formulaBox.scrollWidth || 0, ...mathWidths, ...stackLineWidths, 0);
}

function getRenderedTitleWidth(card) {
  const title = $("h3", card);
  return title?.scrollWidth || 0;
}

export function renderTimeline(equations) {
  const host = $("#timeline");
  if (!host) return;
  host.innerHTML = equations
    .slice()
    .sort((a, b) => a.year - b.year)
    .map(eq => `<article class="timeline-item" style="--item-color:${escapeHtml(eq.color)}"><div class="timeline-year">${escapeHtml(eq.year)}</div><div class="timeline-body"><strong>${escapeHtml(eq.name)}</strong><span>${escapeHtml(eq.author)} · ${escapeHtml(eq.field)}</span></div></article>`)
    .join("");
}

export function openEquationModal(eq) {
  const modal = $("#equationModal");
  const content = $("#modalContent");
  const formulas = normalizeFormulaList(eq.formula);
  if (disposeSimulation) disposeSimulation();
  disposeSimulation = null;

  content.innerHTML = `
    <section class="detail-shell" style="--tag-color:${escapeHtml(eq.color)}">
      <header class="detail-header compact">
        <h2>${escapeHtml(eq.name)}</h2>
      </header>

      <nav class="detail-tabs" role="tablist" aria-label="Secciones de la ficha">
        <button class="active" type="button" role="tab" aria-selected="true" data-tab="formula">Fórmula</button>
        <button type="button" role="tab" aria-selected="false" data-tab="context">Contexto</button>
        <button type="button" role="tab" aria-selected="false" data-tab="uses">Usos</button>
        <button type="button" role="tab" aria-selected="false" data-tab="metadata">Ficha</button>
        <button type="button" role="tab" aria-selected="false" data-tab="simulation">Simulación</button>
      </nav>

      <div class="detail-panels">
        <section class="detail-panel formula-view active" data-panel="formula" role="tabpanel">
          <div class="formula-box modal-formula" aria-label="Fórmula interactiva">${renderFormula(formulas)}</div>
          <p class="formula-caption">${escapeHtml(eq.summary)}</p>
        </section>

        <section class="detail-panel text-view" data-panel="context" role="tabpanel" hidden>
          <div class="text-section">
            <h3>Historia</h3>
            <p>${escapeHtml(eq.history)}</p>
          </div>
          <div class="text-section">
            <h3>Derivación simplificada</h3>
            <p>${escapeHtml(eq.derivation)}</p>
          </div>
          <div class="text-section">
            <h3>Qué significa</h3>
            <p>${escapeHtml(eq.meaning)}</p>
          </div>
        </section>

        <section class="detail-panel text-view" data-panel="uses" role="tabpanel" hidden>
          <ul class="plain-list use-list">${(eq.uses || []).map(v => `<li>${escapeHtml(v)}</li>`).join("")}</ul>
        </section>

        <section class="detail-panel text-view metadata-view" data-panel="metadata" role="tabpanel" hidden>
          ${renderMetadataPanel(eq)}
        </section>

        <section class="detail-panel simulation-view" data-panel="simulation" role="tabpanel" hidden>
          <canvas id="simulationCanvas"></canvas>
          <div class="sim-controls" id="simulationControls"></div>
        </section>
      </div>
    </section>
  `;

  modal.showModal();
  bindDetailTabs(content, eq);
  requestMathTypeset();
  scheduleModalFormulaFit(content);
  scheduleSymbolTooltips(content, eq);
}

function renderMetadataPanel(eq) {
  const variableCount = Array.isArray(eq.variables) ? eq.variables.length : 0;
  const useCount = Array.isArray(eq.uses) ? eq.uses.length : 0;
  const formulaCount = normalizeFormulaList(eq.formula).length;
  return `
    <article class="metadata-article expanded-text">
      <h3>Ficha técnica</h3>
      <p>${escapeHtml(eq.name)} pertenece al área de ${escapeHtml(eq.field)} y está clasificada para nivel ${escapeHtml(eq.level)}. La ficha reúne ${formulaCount} forma${formulaCount === 1 ? "" : "s"} matemática${formulaCount === 1 ? "" : "s"}, ${variableCount} entrada${variableCount === 1 ? "" : "s"} de glosario y ${useCount} campo${useCount === 1 ? "" : "s"} de aplicación.</p>
      <div class="metadata-clean-grid" aria-label="Datos técnicos de la ficha">
        <div><span>Autoría o tradición</span><strong>${escapeHtml(eq.author)}</strong></div>
        <div><span>Fecha histórica</span><strong>${formatDisplayYear(eq.year)}</strong></div>
        <div><span>Área</span><strong>${escapeHtml(eq.field)}</strong></div>
        <div><span>Nivel</span><strong>${escapeHtml(eq.level)}</strong></div>
        <div><span>Simulación asociada</span><strong>${escapeHtml(eq.simulation || "sin simulación")}</strong></div>
        <div><span>Cobertura interna</span><strong>${formulaCount} fórmulas · ${variableCount} símbolos · ${useCount} usos</strong></div>
      </div>
    </article>
  `;
}

function bindDetailTabs(content, eq) {
  const buttons = [...content.querySelectorAll(".detail-tabs button")];
  const panels = [...content.querySelectorAll(".detail-panel")];

  function activate(tab) {
    buttons.forEach(button => {
      const active = button.dataset.tab === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    panels.forEach(panel => {
      const active = panel.dataset.panel === tab;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
    if (tab === "simulation" && !disposeSimulation) {
      disposeSimulation = mountSimulation(eq.simulation, $("#simulationCanvas"), $("#simulationControls"));
    }
    requestMathTypeset();
    scheduleModalFormulaFit(content);
    scheduleSymbolTooltips(content, eq);
  }

  buttons.forEach(button => button.addEventListener("click", () => activate(button.dataset.tab)));
}

function scheduleModalFormulaFit(root) {
  window.setTimeout(() => fitModalFormula(root), 80);
  window.setTimeout(() => fitModalFormula(root), 240);
  window.setTimeout(() => fitModalFormula(root), 560);
}

function fitModalFormula(root) {
  const formulaBox = $(".modal-formula", root);
  if (!formulaBox || formulaBox.closest("[hidden]")) return;

  formulaBox.style.setProperty("--modal-formula-font", "clamp(1rem, 4.2vw, 3.2rem)");

  requestAnimationFrame(() => {
    const availableWidth = Math.max(1, formulaBox.clientWidth - 12);
    const availableHeight = Math.max(1, formulaBox.clientHeight - 12);
    const contentWidth = getFormulaContentWidth(formulaBox);
    const contentHeight = getFormulaContentHeight(formulaBox);
    const ratio = Math.min(1, availableWidth / contentWidth, availableHeight / contentHeight);
    const baseSize = parseFloat(getComputedStyle(formulaBox).fontSize) || 32;
    const fittedSize = Math.max(13, Math.floor(baseSize * ratio * 0.96));
    formulaBox.style.setProperty("--modal-formula-font", `${fittedSize}px`);
  });
}

function getFormulaContentWidth(formulaBox) {
  const mathNodes = [...formulaBox.querySelectorAll("mjx-container")];
  const widths = mathNodes.map(node => node.getBoundingClientRect().width || node.scrollWidth || 0);
  return Math.max(formulaBox.scrollWidth || 0, ...widths, 1);
}

function getFormulaContentHeight(formulaBox) {
  const mathNodes = [...formulaBox.querySelectorAll("mjx-container")];
  const heights = mathNodes.map(node => node.getBoundingClientRect().height || node.scrollHeight || 0);
  return Math.max(formulaBox.scrollHeight || 0, heights.reduce((sum, value) => sum + value, 0), 1);
}

function scheduleSymbolTooltips(root, eq) {
  window.setTimeout(() => annotateFormulaSymbols(root, eq), 120);
  window.setTimeout(() => annotateFormulaSymbols(root, eq), 320);
  window.setTimeout(() => annotateFormulaSymbols(root, eq), 680);
  window.setTimeout(() => annotateFormulaSymbols(root, eq), 980);
}

function annotateFormulaSymbols(root, eq) {
  const formulaBox = $(".modal-formula", root);
  if (!formulaBox || formulaBox.closest("[hidden]")) return;
  const glossary = buildEquationGlossary(eq);
  const tokenNodes = [...formulaBox.querySelectorAll("svg g[data-mml-node='mi'], svg g[data-mml-node='mo'], svg g[data-mml-node='mn']")];

  tokenNodes.forEach(node => {
    node.querySelectorAll(":scope > .formula-token-hitbox").forEach(hitbox => hitbox.remove());
    const symbol = extractMathSymbol(node);
    const description = lookupSymbolDescription(symbol, glossary);
    if (!description) return;

    node.classList.add("formula-token");
    node.dataset.symbol = symbol;
    node.dataset.description = description;
    node.setAttribute("aria-label", `${symbol}: ${description}`);
    const hitbox = addSymbolHitbox(node);
    wireSymbolTooltip(node, symbol, description);
    if (hitbox) wireSymbolTooltip(hitbox, symbol, description);
  });
}

function buildEquationGlossary(eq) {
  const glossary = new Map(GLOBAL_SYMBOLS);
  eq.variables?.forEach(entry => {
    const [rawKeys, rawDescription] = String(entry).split(":");
    if (!rawKeys || !rawDescription) return;
    const description = rawDescription.trim();
    extractVariableKeys(rawKeys).forEach(key => {
      const normalized = normalizeSymbolKey(key);
      if (normalized) glossary.set(normalized, description);
    });
  });
  return glossary;
}

function extractVariableKeys(rawKeys) {
  return rawKeys
    .replace(/\s+(?:y|e)\s+/gi, ",")
    .replace(/\//g, ",")
    .split(/[,;]+/)
    .map(part => part.trim())
    .filter(Boolean)
    .flatMap(part => {
      const direct = normalizeSymbolKey(part);
      const singleSymbols = [...part].map(normalizeSymbolKey).filter(Boolean);
      return [direct, ...singleSymbols];
    })
    .filter(Boolean);
}

function extractMathSymbol(node) {
  const codes = [...node.querySelectorAll(":scope use[data-c]")]
    .map(use => use.getAttribute("data-c"))
    .filter(Boolean);
  if (!codes.length) return "";
  return codes.map(code => codePointToSymbol(code)).join("").normalize("NFKC");
}

function codePointToSymbol(hex) {
  const value = Number.parseInt(hex, 16);
  if (!Number.isFinite(value)) return "";
  return String.fromCodePoint(value).normalize("NFKC");
}

function lookupSymbolDescription(symbol, glossary) {
  const key = normalizeSymbolKey(symbol);
  if (!key) return "";
  return glossary.get(key) || GLOBAL_SYMBOLS.get(key) || "";
}

function normalizeSymbolKey(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹0-9]/g, "")
    .replace(/[{}()[\]^_\\]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function addSymbolHitbox(node) {
  try {
    const box = node.getBBox();
    if (!box.width || !box.height) return null;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("class", "formula-token-hitbox");
    rect.setAttribute("x", String(box.x - 5));
    rect.setAttribute("y", String(box.y - 5));
    rect.setAttribute("width", String(box.width + 10));
    rect.setAttribute("height", String(box.height + 10));
    node.insertBefore(rect, node.firstChild);
    return rect;
  } catch {
    return null;
  }
}

function wireSymbolTooltip(target, symbol, description) {
  target.onmousemove = event => showSymbolTooltip(event, symbol, description);
  target.onmouseenter = event => showSymbolTooltip(event, symbol, description);
  target.onmouseleave = hideSymbolTooltip;
  target.onclick = event => showSymbolTooltip(event, symbol, description);
}

function getTooltipElement() {
  let tooltip = document.body.querySelector(":scope > .symbol-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "symbol-tooltip";
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function showSymbolTooltip(event, symbol, description) {
  const tooltip = getTooltipElement();
  tooltip.innerHTML = `<strong>${escapeHtml(symbol)}</strong><span>${escapeHtml(description)}</span>`;
  tooltip.classList.add("visible");
  tooltip.style.position = "fixed";
  const offset = 7;
  const maxLeft = window.innerWidth - tooltip.offsetWidth - 7;
  const maxTop = window.innerHeight - tooltip.offsetHeight - 7;
  tooltip.style.left = `${Math.max(7, Math.min(maxLeft, event.clientX + offset))}px`;
  tooltip.style.top = `${Math.max(7, Math.min(maxTop, event.clientY + offset))}px`;
}

function hideSymbolTooltip() {
  document.querySelectorAll(".symbol-tooltip").forEach(tooltip => tooltip.classList.remove("visible"));
}

function formatDisplayYear(year) {
  if (typeof year !== "number" || Number.isNaN(year)) return escapeHtml(year ?? "sin fecha");
  return year < 0 ? `${Math.abs(year)} a. C.` : String(year);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

export function closeEquationModal() {
  if (disposeSimulation) disposeSimulation();
  disposeSimulation = null;
  hideSymbolTooltip();
  $("#equationModal").close();
}
