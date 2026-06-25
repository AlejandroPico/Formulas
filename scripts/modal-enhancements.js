import { equations as baseEquations } from "../data/equations.js";
import { extraEquations } from "../data/extra-equations.js";
import { advancedEquations } from "../data/advanced-equations.js";
import { completedEquations } from "../data/complete-equations.js";
import { finalCorrections } from "../data/final-corrections.js";
import { historyEssays } from "../data/history-essays.js";

const equations = mergeEquationSets(baseEquations, extraEquations, advancedEquations, completedEquations, finalCorrections);
const equationByTitle = new Map(equations.map(item => [normalizeTitle(item.name), item]));
const historyByTitle = new Map(historyEssays.map(item => [normalizeTitle(item.title), item]));
const historyById = new Map(historyEssays.map(item => [item.id, item]));

const modal = document.querySelector("#equationModal");
const modalContent = document.querySelector("#modalContent");

const observer = new MutationObserver(() => scheduleEnhanceModal());
if (modalContent) observer.observe(modalContent, { childList: true, subtree: true });

document.addEventListener("click", event => {
  const card = event.target.closest?.(".equation-card");
  if (card) scheduleEnhanceModal();

  const button = event.target.closest?.(".equation-modal .detail-tabs button");
  if (!button) return;
  window.setTimeout(() => syncTabs(button.dataset.tab), 0);
});

window.setInterval(() => {
  if (modalContent?.querySelector(".detail-tabs")) enhanceModal();
}, 500);

document.addEventListener("mousemove", event => {
  const token = event.target.closest?.(".formula-token");
  if (!token) return;
  repositionSymbolTooltip(event);
});

document.addEventListener("mouseenter", event => {
  const token = event.target.closest?.(".formula-token");
  if (!token) return;
  window.setTimeout(() => repositionSymbolTooltip(event), 0);
}, true);

function scheduleEnhanceModal() {
  window.setTimeout(enhanceModal, 0);
  window.setTimeout(enhanceModal, 80);
  window.setTimeout(enhanceModal, 220);
  window.setTimeout(enhanceModal, 500);
}

function mergeEquationSets(...sets) {
  return [...sets.flat().reduce((map, eq) => map.set(eq.id, eq), new Map()).values()];
}

function enhanceModal() {
  if (!modalContent?.querySelector(".detail-tabs") || !modalContent?.querySelector(".detail-panels")) return;
  addHistoryTab();
  removeHistoryFromContext();
}

function getCurrentEquation() {
  const title = modalContent.querySelector(".detail-header h2")?.textContent ?? "";
  return equationByTitle.get(normalizeTitle(title));
}

function getCurrentEssay() {
  const title = modalContent.querySelector(".detail-header h2")?.textContent ?? "";
  const eq = getCurrentEquation();
  if (eq) return historyById.get(eq.id) || historyByTitle.get(normalizeTitle(eq.name)) || buildGeneratedHistoryEssay(eq);
  if (!title.trim()) return null;
  return buildFallbackHistoryEssay(title);
}

function addHistoryTab() {
  const tabs = modalContent.querySelector(".detail-tabs");
  const panels = modalContent.querySelector(".detail-panels");
  if (!tabs || !panels) return;

  const essay = getCurrentEssay();
  if (!essay) return;

  let button = tabs.querySelector('[data-tab="history"]');
  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", "false");
    button.dataset.tab = "history";
    button.textContent = "Historia";
    const contextButton = tabs.querySelector('[data-tab="context"]');
    tabs.insertBefore(button, contextButton || tabs.children[1] || null);
  }

  let panel = panels.querySelector('[data-panel="history"]');
  if (!panel) {
    panel = document.createElement("section");
    panel.className = "detail-panel history-view";
    panel.dataset.panel = "history";
    panel.setAttribute("role", "tabpanel");
    panel.hidden = true;
    panels.insertBefore(panel, panels.querySelector('[data-panel="context"]') || null);
  }
  if (panel.dataset.essayId !== essay.id) {
    panel.innerHTML = renderHistoryEssay(essay);
    panel.dataset.essayId = essay.id;
  }
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

function removeHistoryFromContext() {
  const context = modalContent.querySelector('[data-panel="context"]');
  if (!context || context.dataset.historyCleaned === "true") return;
  const sections = [...context.querySelectorAll(".text-section")];
  const historySection = sections.find(section => section.querySelector("h3")?.textContent?.trim().toLowerCase() === "historia");
  if (historySection) historySection.remove();
  context.dataset.historyCleaned = "true";
}

function renderHistoryEssay(essay) {
  return `
    <article class="history-essay">
      <h3>${escapeHtml(essay.title)}</h3>
      ${essay.note ? `<p class="history-note">${escapeHtml(essay.note)}</p>` : ""}
      ${essay.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}
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
      `${eq.name} ocupa un lugar propio dentro de ${field}. Su formulación está asociada a ${author}${year ? ` alrededor de ${year}` : ""}, pero su importancia no se limita al momento en que fue escrita. Como ocurre con muchas ecuaciones famosas, detrás de su forma compacta hay una acumulación de problemas previos, necesidades de cálculo, lenguaje matemático disponible y discusiones sobre cómo interpretar los fenómenos. La ecuación condensa en pocos símbolos una forma de mirar el mundo: selecciona magnitudes relevantes, establece una relación entre ellas y convierte un fenómeno disperso en una estructura que puede analizarse, enseñarse y reutilizarse.",
      `${originalHistory} Esta frase breve resume solo el punto de partida. La historia real de una fórmula de este tipo suele ser más larga: antes de fijarse una notación estable, la idea aparece en problemas concretos, en aproximaciones parciales o en lenguajes que hoy nos resultan menos directos. Después, cuando la comunidad científica reconoce su utilidad, la fórmula se reescribe, se generaliza, se conecta con otros resultados y se incorpora a manuales, laboratorios, ingeniería o investigación teórica. Por eso conviene leerla no como una línea aislada, sino como una pieza dentro de una tradición que va madurando.",
      `${meaning} Esa interpretación explica por qué la ecuación sobrevivió a su contexto inicial. Una fórmula se vuelve célebre cuando resuelve algo concreto, pero se vuelve fundamental cuando también permite formular nuevas preguntas. En este caso, el valor histórico no está solo en calcular una cantidad, sino en ofrecer un marco conceptual: da nombre a las magnitudes, fija dependencias y separa lo esencial de lo accesorio. Con el tiempo, ese marco puede trasladarse a otros dominios, simplificarse para la enseñanza o sofisticarse para investigación avanzada.",
      `La derivación o justificación que suele acompañarla puede resumirse así: ${derivation} Históricamente, este tipo de derivación es importante porque muestra que la fórmula no es una regla arbitraria. Incluso cuando se presenta de forma escolar o resumida, está apoyada en un razonamiento: conservación, simetría, proporcionalidad, límite, equilibrio, probabilidad, geometría o estructura algebraica. Esa capa de razonamiento es la que permite reconocer cuándo se puede usar y cuándo deja de ser válida.",
      `Sus aplicaciones actuales incluyen ${uses}. Esta variedad de usos es una de las señales de su relevancia histórica. Muchas ecuaciones nacen para resolver un problema estrecho, pero terminan funcionando como herramientas generales. Cuando una fórmula viaja de un campo a otro, también cambia su significado práctico: puede pasar de ser una descripción idealizada a ser un algoritmo de cálculo, un criterio de diseño, una aproximación de laboratorio o una pieza de una teoría mayor.",
      `En futuras ampliaciones, esta entrada puede enriquecerse con una monografía histórica más específica: autores secundarios, controversias, manuscritos, experimentos, recepción académica, cambios de notación y conexiones con resultados anteriores y posteriores. De momento, esta versión ampliada garantiza que la ficha no quede reducida a una frase mínima y que todas las fórmulas del atlas dispongan de una pestaña histórica legible, contextual y claramente separada del resto de apartados.`
    ]
  };
}

function buildFallbackHistoryEssay(title) {
  return {
    id: `${normalizeTitle(title).replace(/\s+/g, "-")}-fallback-history`,
    title,
    note: "Historia ampliada provisional. No se ha podido vincular esta ficha con el catálogo interno, pero se mantiene la pestaña Historia como sección obligatoria.",
    paragraphs: [
      `${title} forma parte del atlas de ecuaciones y debe leerse dentro de una tradición científica más amplia. Toda fórmula relevante aparece como respuesta a una necesidad: medir, explicar, predecir, clasificar o relacionar magnitudes que antes se entendían de forma separada.`,
      `Esta entrada histórica provisional garantiza que la ficha mantenga la estructura completa mientras se sustituye por una versión monográfica específica. La versión final deberá incluir contexto de descubrimiento, autores, problemas originales, recepción, cambios de notación y aplicaciones posteriores.`
    ]
  };
}

function repositionSymbolTooltip(event) {
  const dialog = event.target.closest?.(".equation-modal") || modal;
  const tooltip = dialog?.querySelector(".symbol-tooltip");
  if (!dialog || !tooltip || !tooltip.classList.contains("visible")) return;

  const dialogRect = dialog.getBoundingClientRect();
  const offset = 10;
  const desiredLeft = event.clientX - dialogRect.left + offset;
  const desiredTop = event.clientY - dialogRect.top + offset;
  const maxLeft = dialog.clientWidth - tooltip.offsetWidth - 10;
  const maxTop = dialog.clientHeight - tooltip.offsetHeight - 10;

  tooltip.style.left = `${clamp(desiredLeft, 10, Math.max(10, maxLeft))}px`;
  tooltip.style.top = `${clamp(desiredTop, 10, Math.max(10, maxTop))}px`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
