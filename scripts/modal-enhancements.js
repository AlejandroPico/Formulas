import { equations as baseEquations } from "../data/equations.js";
import { extraEquations } from "../data/extra-equations.js";
import { advancedEquations } from "../data/advanced-equations.js";
import { completedEquations } from "../data/complete-equations.js";
import { finalCorrections } from "../data/final-corrections.js";
import { polishedEquations } from "../data/polished-equations.js";
import { historyEssays } from "../data/history-essays.js";

const equations = mergeEquationSets(baseEquations, extraEquations, advancedEquations, completedEquations, finalCorrections, polishedEquations);
const equationByTitle = new Map(equations.map(item => [normalizeTitle(item.name), item]));
const historyByTitle = new Map(historyEssays.map(item => [normalizeTitle(item.title), item]));
const historyById = new Map(historyEssays.map(item => [item.id, item]));

const modalContent = document.querySelector("#modalContent");

const STRUCTURE_TOOLTIPS = {
  msqrt: ["√", "Raíz cuadrada: operación inversa de elevar al cuadrado."],
  mroot: ["ⁿ√", "Raíz de índice n: generaliza la raíz cuadrada a cualquier índice."],
  msup: ["exponente", "Potencia: indica una operación de escala o multiplicación repetida."],
  msub: ["subíndice", "Subíndice: distingue componentes, índices, puntos o familias de variables."],
  msubsup: ["subíndice/exponente", "Notación combinada con índice inferior y marca superior."],
  mfrac: ["fracción", "Cociente: expresa división, razón, proporción o normalización."],
  mover: ["vector/sobrescrito", "Marca superior: puede indicar vector, media, operador o modificación de una variable."],
  munder: ["marca inferior", "Marca inferior: suele indicar condición, límite o índice bajo un operador."],
  munderover: ["límites", "Límites superior e inferior: aparecen en sumatorios, integrales, productos y operadores."],
  TeXAtom: ["bloque matemático", "Agrupación interna usada por MathJax para representar una estructura LaTeX."]
};

const observer = new MutationObserver(() => scheduleEnhanceModal());
if (modalContent) observer.observe(modalContent, { childList: true, subtree: true });

document.addEventListener("click", event => {
  if (event.target.closest?.(".equation-card")) scheduleEnhanceModal();
  const button = event.target.closest?.(".equation-modal .detail-tabs button");
  if (button) window.setTimeout(() => syncTabs(button.dataset.tab), 0);
});

document.addEventListener("mousemove", event => {
  const token = event.target.closest?.(".formula-token, .formula-structure-token");
  if (!token) return;
  const symbol = token.dataset.symbol || token.dataset.tooltipSymbol;
  const description = token.dataset.description || token.dataset.tooltipDescription;
  if (symbol && description) showGlobalTooltip(event, symbol, description);
});

document.addEventListener("mouseenter", event => {
  const token = event.target.closest?.(".formula-token, .formula-structure-token");
  if (!token) return;
  const symbol = token.dataset.symbol || token.dataset.tooltipSymbol;
  const description = token.dataset.description || token.dataset.tooltipDescription;
  if (symbol && description) showGlobalTooltip(event, symbol, description);
}, true);

document.addEventListener("mouseleave", event => {
  if (event.target.closest?.(".formula-token, .formula-structure-token")) hideGlobalTooltip();
}, true);

window.setInterval(() => {
  if (modalContent?.querySelector(".detail-tabs")) enhanceModal();
}, 600);

function scheduleEnhanceModal() {
  window.setTimeout(enhanceModal, 0);
  window.setTimeout(enhanceModal, 80);
  window.setTimeout(enhanceModal, 220);
  window.setTimeout(enhanceModal, 500);
  window.setTimeout(enhanceModal, 900);
}

function enhanceModal() {
  if (!modalContent?.querySelector(".detail-tabs") || !modalContent?.querySelector(".detail-panels")) return;
  splitContextTabs();
  enhanceUsesPanel();
  enhanceFormulaStructureTooltips();
}

function splitContextTabs() {
  const tabs = modalContent.querySelector(".detail-tabs");
  const panels = modalContent.querySelector(".detail-panels");
  const eq = getCurrentEquation();
  if (!tabs || !panels || !eq || tabs.dataset.contextSplit === "true") return;

  const contextButton = tabs.querySelector('[data-tab="context"]');
  const contextPanel = panels.querySelector('[data-panel="context"]');
  const usesButton = tabs.querySelector('[data-tab="uses"]');

  const essay = getCurrentEssay(eq);
  const tabDefinitions = [
    ["history", "Historia", renderEssayPanel(essay)],
    ["derivation", "Derivación", renderSingleTextPanel("Derivación simplificada", eq.derivation)],
    ["meaning", "Significado", renderSingleTextPanel("Qué significa", eq.meaning)]
  ];

  tabDefinitions.forEach(([key, label, html]) => {
    if (!tabs.querySelector(`[data-tab="${key}"]`)) {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", "false");
      button.dataset.tab = key;
      button.textContent = label;
      tabs.insertBefore(button, usesButton || contextButton || null);
    }

    if (!panels.querySelector(`[data-panel="${key}"]`)) {
      const panel = document.createElement("section");
      panel.className = "detail-panel text-view expanded-text-view";
      panel.dataset.panel = key;
      panel.setAttribute("role", "tabpanel");
      panel.hidden = true;
      panel.innerHTML = html;
      panels.insertBefore(panel, panels.querySelector('[data-panel="uses"]') || null);
    }
  });

  contextButton?.remove();
  contextPanel?.remove();
  tabs.dataset.contextSplit = "true";
}

function enhanceUsesPanel() {
  const eq = getCurrentEquation();
  const panel = modalContent.querySelector('[data-panel="uses"]');
  if (!eq || !panel || panel.dataset.enhancedUses === "true") return;

  if (Array.isArray(eq.useDetails) && eq.useDetails.length) {
    panel.innerHTML = `
      <div class="use-examples">
        ${eq.useDetails.map(item => `
          <article class="use-example">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.text)}</p>
          </article>
        `).join("")}
      </div>
    `;
  } else if (Array.isArray(eq.uses)) {
    panel.innerHTML = `<ul class="plain-list use-list">${eq.uses.map(use => `<li>${escapeHtml(use)}</li>`).join("")}</ul>`;
  }
  panel.dataset.enhancedUses = "true";
}

function enhanceFormulaStructureTooltips() {
  const formula = modalContent.querySelector(".modal-formula");
  if (!formula || formula.closest("[hidden]")) return;
  const selector = Object.keys(STRUCTURE_TOOLTIPS).map(name => `svg g[data-mml-node='${name}']`).join(",");
  formula.querySelectorAll(selector).forEach(node => {
    if (node.dataset.structureTooltip === "true") return;
    const [symbol, description] = STRUCTURE_TOOLTIPS[node.dataset.mmlNode] || [];
    if (!symbol || !description) return;
    node.dataset.structureTooltip = "true";
    node.dataset.tooltipSymbol = symbol;
    node.dataset.tooltipDescription = description;
    node.classList.add("formula-structure-token");
    node.setAttribute("aria-label", `${symbol}: ${description}`);
    addSvgHitbox(node);
    node.addEventListener("mousemove", event => showGlobalTooltip(event, symbol, description));
    node.addEventListener("mouseenter", event => showGlobalTooltip(event, symbol, description));
    node.addEventListener("click", event => showGlobalTooltip(event, symbol, description));
    node.addEventListener("mouseleave", hideGlobalTooltip);
  });
}

function syncTabs(tab) {
  if (!tab || !modalContent) return;
  const buttons = [...modalContent.querySelectorAll(".detail-tabs button")];
  const panels = [...modalContent.querySelectorAll(".detail-panel")];
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
}

function getCurrentEquation() {
  const title = modalContent.querySelector(".detail-header h2")?.textContent ?? "";
  return equationByTitle.get(normalizeTitle(title));
}

function getCurrentEssay(eq) {
  return historyById.get(eq.id) || historyByTitle.get(normalizeTitle(eq.name)) || buildGeneratedHistoryEssay(eq);
}

function renderEssayPanel(essay) {
  return `
    <article class="history-essay expanded-text">
      <h3>${escapeHtml(essay.title)}</h3>
      ${essay.note ? `<p class="history-note">${escapeHtml(essay.note)}</p>` : ""}
      ${essay.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}
    </article>
  `;
}

function renderSingleTextPanel(title, text) {
  return `
    <article class="expanded-text">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text || "Contenido pendiente de ampliación.")}</p>
    </article>
  `;
}

function buildGeneratedHistoryEssay(eq) {
  const field = eq.field || "su disciplina";
  const author = eq.author || "la tradición científica";
  const year = formatYear(eq.year);
  const uses = Array.isArray(eq.uses) && eq.uses.length ? eq.uses.join(", ") : "distintos problemas científicos y técnicos";
  const originalHistory = eq.history || "Su desarrollo forma parte de la consolidación histórica de su campo.";
  const meaning = eq.meaning || eq.summary || "La ecuación resume una relación fundamental entre magnitudes.";
  const derivation = eq.derivation || "Su forma se entiende como una síntesis de observaciones, definiciones y principios previos.";
  return {
    id: `${eq.id}-generated-history`,
    title: eq.name,
    note: "Historia ampliada generada a partir de la ficha actual. Sustituible por una versión monográfica específica en próximas tandas.",
    paragraphs: [
      `${eq.name} ocupa un lugar propio dentro de ${field}. Su formulación está asociada a ${author}${year ? ` alrededor de ${year}` : ""}, pero su importancia no se limita al momento en que fue escrita. Como ocurre con muchas ecuaciones famosas, detrás de su forma compacta hay una acumulación de problemas previos, necesidades de cálculo, lenguaje matemático disponible y discusiones sobre cómo interpretar los fenómenos.`,
      `${originalHistory} Esta frase breve resume solo el punto de partida. Antes de fijarse una notación estable, una fórmula suele aparecer en problemas concretos, aproximaciones parciales o lenguajes que hoy nos resultan menos directos.`,
      `${meaning} Esa interpretación explica por qué la ecuación sobrevivió a su contexto inicial: no solo calcula una cantidad, sino que ofrece un marco conceptual reutilizable.`,
      `La derivación o justificación puede resumirse así: ${derivation} Esa capa de razonamiento permite reconocer cuándo se puede usar y cuándo deja de ser válida.`,
      `Sus aplicaciones actuales incluyen ${uses}. Cuando una fórmula viaja de un campo a otro, cambia su significado práctico y se convierte en herramienta general.`
    ]
  };
}

function addSvgHitbox(node) {
  try {
    const box = node.getBBox();
    if (!box.width || !box.height) return;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("class", "formula-token-hitbox formula-structure-hitbox");
    rect.setAttribute("x", String(box.x - 4));
    rect.setAttribute("y", String(box.y - 4));
    rect.setAttribute("width", String(box.width + 8));
    rect.setAttribute("height", String(box.height + 8));
    node.insertBefore(rect, node.firstChild);
  } catch {
    // MathJax no siempre expone una caja SVG útil para todos los grupos.
  }
}

function showGlobalTooltip(event, symbol, description) {
  document.querySelectorAll(".equation-modal .symbol-tooltip").forEach(tooltip => tooltip.classList.remove("visible"));
  const tooltip = getGlobalTooltip();
  tooltip.innerHTML = `<strong>${escapeHtml(symbol)}</strong><span>${escapeHtml(description)}</span>`;
  tooltip.classList.add("visible");
  positionTooltip(tooltip, event);
}

function positionTooltip(tooltip, event) {
  tooltip.style.position = "fixed";
  const offset = 6;
  const maxLeft = window.innerWidth - tooltip.offsetWidth - 6;
  const maxTop = window.innerHeight - tooltip.offsetHeight - 6;
  tooltip.style.left = `${clamp(event.clientX + offset, 6, Math.max(6, maxLeft))}px`;
  tooltip.style.top = `${clamp(event.clientY + offset, 6, Math.max(6, maxTop))}px`;
}

function getGlobalTooltip() {
  let tooltip = document.body.querySelector(":scope > .symbol-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "symbol-tooltip";
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function hideGlobalTooltip() {
  document.querySelectorAll(".symbol-tooltip").forEach(tooltip => tooltip.classList.remove("visible"));
}

function mergeEquationSets(...sets) {
  return [...sets.flat().reduce((map, eq) => map.set(eq.id, eq), new Map()).values()];
}

function normalizeTitle(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatYear(year) {
  if (typeof year !== "number" || Number.isNaN(year)) return "";
  if (year < 0) return `${Math.abs(year)} a. C.`;
  return String(year);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
