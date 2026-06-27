import { equations as baseEquations } from "../data/equations.js";
import { extraEquations } from "../data/extra-equations.js";
import { advancedEquations } from "../data/advanced-equations.js";
import { completedEquations } from "../data/complete-equations.js";
import { finalCorrections } from "../data/final-corrections.js";
import { polishedEquations } from "../data/polished-equations.js";
import { pluginPolishedEquations } from "../data/plugin-polished-equations.js";

const modalContent = document.querySelector("#modalContent");
const equations = merge(baseEquations, extraEquations, advancedEquations, completedEquations, finalCorrections, polishedEquations, pluginPolishedEquations);
const byTitle = new Map(equations.map(eq => [key(eq.name), eq]));

if (modalContent) {
  const observer = new MutationObserver(schedule);
  observer.observe(modalContent, { childList: true, subtree: true });
  document.addEventListener("click", event => {
    if (event.target.closest?.(".equation-card") || event.target.closest?.(".detail-tabs button")) schedule();
  });
  window.setInterval(run, 1000);
}

function schedule() {
  setTimeout(run, 80);
  setTimeout(run, 260);
  setTimeout(run, 620);
}

function run() {
  if (!modalContent) return;
  cleanDuplicateTabs();
  fillUses();
}

function cleanDuplicateTabs() {
  const tabs = modalContent.querySelector(".detail-tabs");
  const panels = modalContent.querySelector(".detail-panels");
  if (!tabs || !panels) return;
  const seenButtons = new Set();
  [...tabs.querySelectorAll("button")].forEach(button => {
    const id = button.dataset.target || button.dataset.tab || button.textContent.trim();
    if (seenButtons.has(id) && !button.dataset.target) button.remove();
    else seenButtons.add(id);
  });
  const seenPanels = new Set();
  [...panels.querySelectorAll(".detail-panel")].forEach(panel => {
    const id = panel.dataset.panel || "";
    if (seenPanels.has(id)) panel.remove();
    else seenPanels.add(id);
  });
}

function fillUses() {
  const title = modalContent.querySelector(".detail-header h2")?.textContent || "";
  const eq = byTitle.get(key(title));
  const panel = modalContent.querySelector("[data-panel='uses']");
  if (!eq || !panel || panel.dataset.usesGuard === eq.id) return;
  if (!Array.isArray(eq.useDetails) || !eq.useDetails.length) return;

  panel.replaceChildren();
  const wrapper = document.createElement("div");
  wrapper.className = "use-examples";
  eq.useDetails.forEach(item => {
    const article = document.createElement("article");
    article.className = "use-example";
    const heading = document.createElement("h3");
    heading.textContent = item.title;
    const paragraph = document.createElement("p");
    paragraph.textContent = item.text;
    article.append(heading, paragraph);
    wrapper.appendChild(article);
  });
  panel.appendChild(wrapper);
  panel.dataset.usesGuard = eq.id;
}

function merge(...sets) {
  return [...sets.flat().reduce((map, eq) => map.set(eq.id, eq), new Map()).values()];
}

function key(value) {
  return String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
