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
  "π": "pi: constante geométrica de la circunferencia.",
  "e": "número de Euler: base de los logaritmos naturales y de la exponencial.",
  "i": "unidad imaginaria: cumple i² = -1.",
  "c": "velocidad de la luz, hipotenusa o constante de propagación, según el contexto.",
  "F": "fuerza, campo vectorial o función, según el contexto.",
  "m": "masa o índice, según el contexto.",
  "a": "lado, aceleración, parámetro o factor de escala, según el contexto.",
  "b": "lado, coeficiente o parámetro, según el contexto.",
  "x": "coordenada, variable independiente o dato de entrada, según el contexto.",
  "t": "tiempo."
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
    node.style.setProperty("--formula-lines", formulas.length || 1);
    node.style.setProperty("--col-span", minColSpan);
    node.style.setProperty("--context-color", getContextColor(eq, viewState.cardLabelMode));
    node.setAttribute("role", "button");
    node.setAttribute("aria-label", `Abrir ficha de ${eq.name}`);

    renderCardTitle($("h3", node), eq, viewState.cardLabelMode);
    $(".formula-box", node).innerHTML = formulas.length ? renderFormula(formulas) : "";

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
  const inlineMath = formula => String.raw`\(${formula}\)`;
  if (formulas.length === 1) return inlineMath(formulas[0]);
  return `<div class="formula-stack">${formulas.map(line => `<div>${inlineMath(line)}</div>`).join("")}</div>`;
}

function normalizeFormulaList(formula) {
  if (Array.isArray(formula)) return formula.filter(Boolean);
  return formula ? [formula] : [];
}

function getWidthLevel(formulas) {
  if (!formulas.length) return 1;
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
  return String(formula)
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
  const sections = getEquationSections(eq);
  const activeKey = sections[0]?.key || "sin-contenido";
  if (disposeSimulation) disposeSimulation();
  disposeSimulation = null;

  content.innerHTML = `
    <section class="detail-shell" style="--equation-color: ${eq.color || "#5d5af6"}">
      <header class="detail-header compact">
        <h2>${escapeHtml(eq.name)}</h2>
      </header>
      <nav class="detail-tabs" aria-label="Secciones de la ficha">
        ${sections.map((section, index) => tabButton(section.key, section.label, index === 0)).join("")}
      </nav>
      <div class="detail-panels">
        ${sections.map((section, index) => renderSectionPanel(section, eq, index === 0)).join("")}
      </div>
    </section>`;

  bindTabs(content, eq);
  modal.showModal();
  activatePanel(content, eq, activeKey);
  requestMathTypeset();
  scheduleModalFormulaFit(content);
  scheduleSymbolTooltips(content, eq);
}

function getEquationSections(eq) {
  if (Array.isArray(eq.sections) && eq.sections.length) {
    return eq.sections
      .map(section => normalizeDynamicSection(section, eq))
      .filter(section => sectionHasContent(section));
  }
  return legacySections(eq);
}

function normalizeDynamicSection(section, eq) {
  const key = section.key || slugify(section.label || section.file || "seccion");
  const label = section.label || prettify(key);
  return {
    key,
    label,
    type: section.type || "markdown",
    content: section.content || "",
    path: section.path || "",
    stylePath: section.stylePath || "",
    formula: section.type === "formula" ? normalizeFormulaList(eq.formula) : []
  };
}

function sectionHasContent(section) {
  if (section.type === "simulation") return Boolean(section.path);
  if (section.type === "formula") return Boolean(section.content.trim() || section.formula.length);
  return Boolean(section.content.trim());
}

function legacySections(eq) {
  const sections = [];
  const formulas = normalizeFormulaList(eq.formula);
  if (formulas.length) sections.push({ key: "formula", label: "Fórmula", type: "formula", formula: formulas, content: formulas.join("\n\n") });
  if (eq.meaning) sections.push({ key: "meaning", label: "Significado", type: "text", content: eq.meaning });
  if (eq.history) sections.push({ key: "history", label: "Historia", type: "text", content: eq.history });
  if (eq.derivation) sections.push({ key: "derivation", label: "Derivación", type: "text", content: eq.derivation });
  if (Array.isArray(eq.uses) && eq.uses.length) sections.push({ key: "uses", label: "Usos", type: "uses", content: eq.uses });
  if (eq.simulation) sections.push({ key: "simulation", label: "Simulación", type: "simulation", content: "" });
  const metadata = legacyMetadataRows(eq);
  if (metadata.length) sections.push({ key: "metadata", label: "Ficha", type: "metadata", content: metadata });
  return sections.length ? sections : [{ key: "sin-contenido", label: "Ficha", type: "text", content: "Sin contenido disponible." }];
}

function legacyMetadataRows(eq) {
  const rows = [];
  if (eq.author) rows.push(["Autoría", eq.author]);
  if (eq.year !== undefined && eq.year !== "") rows.push(["Año", Number(eq.year) < 0 ? `${Math.abs(Number(eq.year))} a. C.` : eq.year]);
  if (eq.field) rows.push(["Área", eq.field]);
  if (eq.level) rows.push(["Nivel", eq.level]);
  if (Array.isArray(eq.variables) && eq.variables.length) rows.push(["Variables", eq.variables.join(" · ")]);
  return rows;
}

function renderSectionPanel(section, eq, active) {
  const activeClass = active ? " active" : "";
  const hidden = active ? "" : " hidden";
  const common = `detail-panel ${panelClass(section)}${activeClass}`;
  if (section.type === "formula") {
    const formulas = normalizeFormulaList(section.formula?.length ? section.formula : section.content.split(/\n\s*\n/g).filter(Boolean));
    return `<section class="${common}" data-panel="${escapeHtml(section.key)}"${hidden}><div class="formula-box modal-formula" aria-label="Fórmula interactiva">${renderFormula(formulas)}</div></section>`;
  }
  if (section.type === "simulation") {
    return `<section class="${common}" data-panel="${escapeHtml(section.key)}" data-simulation-module="${escapeHtml(eq.simulationModule || section.path || "")}" data-simulation-style="${escapeHtml(eq.simulationStylePath || section.stylePath || "")}"${hidden}><canvas id="simulationCanvas" width="760" height="320" aria-label="Simulación de ${escapeHtml(eq.name)}"></canvas><div class="sim-controls" id="simulationControls"></div></section>`;
  }
  if (section.type === "uses") {
    return `<section class="${common}" data-panel="${escapeHtml(section.key)}"${hidden}>${section.content.map(use => `<span>${escapeHtml(use)}</span>`).join("")}</section>`;
  }
  if (section.type === "metadata") {
    return `<section class="${common}" data-panel="${escapeHtml(section.key)}"${hidden}>${section.content.map(([label, value]) => metadataRow(label, value)).join("")}</section>`;
  }
  if (section.type === "markdown") {
    return `<section class="${common}" data-panel="${escapeHtml(section.key)}"${hidden}><div class="markdown-view">${renderMarkdown(section.content)}</div></section>`;
  }
  return `<section class="${common}" data-panel="${escapeHtml(section.key)}"${hidden}><p>${escapeHtml(section.content)}</p></section>`;
}

function panelClass(section) {
  if (section.type === "formula") return "formula-view";
  if (section.type === "simulation") return "simulation-view";
  if (section.type === "uses") return "uses-view";
  if (section.type === "metadata") return "metadata-view";
  return "text-view";
}

function tabButton(panel, label, active = false) {
  return `<button class="${active ? "active" : ""}" data-target="${escapeHtml(panel)}" type="button">${escapeHtml(label)}</button>`;
}

function metadataRow(label, value) {
  return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`;
}

function bindTabs(content, eq) {
  const buttons = [...content.querySelectorAll(".detail-tabs button")];
  buttons.forEach(button => button.addEventListener("click", () => activatePanel(content, eq, button.dataset.target)));
}

function activatePanel(content, eq, target) {
  const buttons = [...content.querySelectorAll(".detail-tabs button")];
  const panels = [...content.querySelectorAll(".detail-panel")];
  buttons.forEach(item => item.classList.toggle("active", item.dataset.target === target));
  panels.forEach(panel => {
    const active = panel.dataset.panel === target;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });
  const panel = panels.find(item => item.dataset.panel === target);
  if (!panel) return;
  if (panel.classList.contains("simulation-view") && !panel.dataset.simulationModule) {
    if (disposeSimulation) disposeSimulation();
    const canvas = panel.querySelector("#simulationCanvas");
    const controls = panel.querySelector("#simulationControls");
    disposeSimulation = mountSimulation(eq.simulation, canvas, controls);
  }
  if (panel.classList.contains("formula-view")) {
    requestMathTypeset();
    scheduleModalFormulaFit(content);
    scheduleSymbolTooltips(content, eq);
  }
}

export function closeEquationModal() {
  if (disposeSimulation) disposeSimulation();
  disposeSimulation = null;
  $("#equationModal").close();
}

function renderMarkdown(markdown) {
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let list = [];
  const flushList = () => {
    if (!list.length) return;
    html.push(`<ul>${list.map(item => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
    list = [];
  };
  lines.forEach(raw => {
    const line = raw.trim();
    if (!line) { flushList(); return; }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushList();
      const level = Math.min(4, heading[1].length + 2);
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      return;
    }
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      return;
    }
    flushList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  });
  flushList();
  return html.join("");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
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
  (eq.variables || []).forEach(entry => {
    const [rawSymbol, ...rest] = String(entry).split(":");
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
  return String(value)
    .trim()
    .normalize("NFKC")
    .replace(/[₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹0-9]/g, "")
    .replace(/[{}()[\]^_\\]/g, "")
    .trim();
}

function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "seccion";
}

function prettify(value) {
  const text = String(value).replace(/[-_]+/g, " ").trim();
  return text.charAt(0).toLocaleUpperCase("es") + text.slice(1);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
