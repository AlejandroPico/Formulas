import { equations as baseEquations } from "../data/equations.js";
import { extraEquations } from "../data/extra-equations.js";
import { advancedEquations } from "../data/advanced-equations.js";
import { completedEquations } from "../data/complete-equations.js";
import { finalCorrections } from "../data/final-corrections.js";
import { polishedEquations } from "../data/polished-equations.js";
import { mountFormulaTooltips } from "./formula-tooltips.js";

const equations = mergeEquationSets(baseEquations, extraEquations, advancedEquations, completedEquations, finalCorrections, polishedEquations);
const equationByTitle = new Map(equations.map(item => [normalizeTitle(item.name), item]));
const modalContent = document.querySelector("#modalContent");

if (modalContent) {
  const observer = new MutationObserver(scheduleFormulaTooltipMount);
  observer.observe(modalContent, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "class", "style"] });

  document.addEventListener("click", event => {
    if (event.target.closest?.(".equation-card, .detail-tabs button")) scheduleFormulaTooltipMount();
  });

  window.addEventListener("resize", scheduleFormulaTooltipMount);
  window.setInterval(mountVisibleFormulaTooltips, 900);
}

function scheduleFormulaTooltipMount() {
  window.setTimeout(mountVisibleFormulaTooltips, 40);
  window.setTimeout(mountVisibleFormulaTooltips, 140);
  window.setTimeout(mountVisibleFormulaTooltips, 340);
  window.setTimeout(mountVisibleFormulaTooltips, 720);
  window.setTimeout(mountVisibleFormulaTooltips, 1200);
}

function mountVisibleFormulaTooltips() {
  const formulaBox = modalContent?.querySelector(".modal-formula");
  if (!formulaBox || formulaBox.closest("[hidden]") || !formulaBox.offsetParent) return;
  const equation = getCurrentEquation();
  if (!equation) return;
  mountFormulaTooltips(formulaBox, equation);
}

function getCurrentEquation() {
  const title = modalContent?.querySelector(".detail-header h2")?.textContent ?? "";
  return equationByTitle.get(normalizeTitle(title));
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
