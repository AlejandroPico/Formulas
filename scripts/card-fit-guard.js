import { polishedEquations } from "../data/polished-equations.js";
import { pluginPolishedEquations } from "../data/plugin-polished-equations.js";

const GRID_SELECTOR = "#equationGrid";
const CARD_SELECTOR = ".equation-card";
const FORMULA_SELECTOR = ".formula-box";
const richUsesByTitle = new Map([...polishedEquations, ...pluginPolishedEquations].map(eq => [normalizeTitle(eq.name), eq]));

const observer = new MutationObserver(scheduleCardFit);
const grid = document.querySelector(GRID_SELECTOR);

if (grid) {
  observer.observe(grid, { childList: true, subtree: true });
  window.addEventListener("resize", () => { scheduleCardFit(); scheduleModalFormulaFit(); });
  document.addEventListener("pointermove", event => {
    if (!event.target.closest?.(".formula-tooltip-zone, .formula-token-hitbox")) hideAllFormulaTooltips();
  }, true);
  document.addEventListener("click", event => {
    const tabButton = event.target.closest?.(".detail-tabs button");
    if (tabButton) {
      hideAllFormulaTooltips();
      enforceModalTab(tabButton);
      scheduleModalCleanup();
      scheduleModalFormulaFit();
    }
    if (event.target.closest?.(".equation-card")) {
      hideAllFormulaTooltips();
      scheduleModalCleanup();
      scheduleModalFormulaFit();
    }
  }, true);
  window.setInterval(() => {
    cleanDuplicateModalTabs();
    enhanceUsesPanel();
    enhanceMetadataVariables();
    enforceCurrentModalState();
    fitActiveModalFormula();
  }, 1000);
  scheduleCardFit();
}

function scheduleCardFit() {
  window.setTimeout(fitCards, 120);
  window.setTimeout(fitCards, 360);
  window.setTimeout(fitCards, 800);
  window.setTimeout(fitCards, 1400);
}

function scheduleModalCleanup() {
  window.setTimeout(() => { cleanDuplicateModalTabs(); enhanceUsesPanel(); enhanceMetadataVariables(); enforceCurrentModalState(); fitActiveModalFormula(); }, 80);
  window.setTimeout(() => { cleanDuplicateModalTabs(); enhanceUsesPanel(); enhanceMetadataVariables(); enforceCurrentModalState(); fitActiveModalFormula(); }, 260);
  window.setTimeout(() => { cleanDuplicateModalTabs(); enhanceUsesPanel(); enhanceMetadataVariables(); enforceCurrentModalState(); fitActiveModalFormula(); }, 620);
}

function scheduleModalFormulaFit() {
  window.setTimeout(fitActiveModalFormula, 90);
  window.setTimeout(fitActiveModalFormula, 240);
  window.setTimeout(fitActiveModalFormula, 540);
  window.setTimeout(fitActiveModalFormula, 980);
  window.setTimeout(fitActiveModalFormula, 1500);
}

function fitCards() {
  const grid = document.querySelector(GRID_SELECTOR);
  if (!grid) return;
  const maxColumns = getGridColumnCount(grid);
  const cards = [...grid.querySelectorAll(CARD_SELECTOR)];

  cards.forEach(card => {
    card.style.removeProperty("--formula-scale");
    card.classList.remove("formula-scaled");
    const formulaBox = card.querySelector(FORMULA_SELECTOR);
    if (!formulaBox) return;

    const overflow = getFormulaOverflow(formulaBox);
    if (overflow <= 1.03) return;

    const currentSpan = getCurrentSpan(card);
    const targetSpan = Math.min(maxColumns, Math.max(currentSpan + 1, Math.ceil(currentSpan * overflow)));
    if (targetSpan > currentSpan) {
      card.style.setProperty("--col-span", String(targetSpan));
      card.dataset.minColSpan = String(targetSpan);
    }
  });

  window.setTimeout(() => finalizeFormulaFit(grid), 80);
}

function finalizeFormulaFit(grid) {
  grid.querySelectorAll(CARD_SELECTOR).forEach(card => {
    const formulaBox = card.querySelector(FORMULA_SELECTOR);
    if (!formulaBox) return;
    const overflow = getFormulaOverflow(formulaBox);
    if (overflow <= 1.02) return;

    const scale = Math.max(0.72, Math.min(1, 1 / overflow));
    card.style.setProperty("--formula-scale", scale.toFixed(3));
    card.classList.add("formula-scaled");
  });

  applyMasonrySpans(grid);
}

function fitActiveModalFormula() {
  const panel = document.querySelector("#modalContent .detail-panel.formula-view.active");
  const box = panel?.querySelector(".modal-formula");
  if (!panel || !box || panel.hidden) return;

  const items = [...box.querySelectorAll("mjx-container")];
  if (!items.length) return;
  box.style.setProperty("--modal-formula-scale", "1");

  const availableWidth = Math.max(1, box.clientWidth - 22);
  const availableHeight = Math.max(1, box.clientHeight - 22);
  const contentRect = getFormulaContentRect(items);
  if (!contentRect.width || !contentRect.height) return;

  const scale = Math.min(1, availableWidth / contentRect.width, availableHeight / contentRect.height);
  box.style.setProperty("--modal-formula-scale", String(Math.max(0.035, scale * 0.965).toFixed(4)));
}

function getFormulaContentRect(items) {
  const rects = items.map(item => item.getBoundingClientRect()).filter(rect => rect.width > 0 && rect.height > 0);
  if (!rects.length) return { width: 0, height: 0 };
  const left = Math.min(...rects.map(rect => rect.left));
  const right = Math.max(...rects.map(rect => rect.right));
  const top = Math.min(...rects.map(rect => rect.top));
  const bottom = Math.max(...rects.map(rect => rect.bottom));
  return { width: right - left, height: bottom - top };
}

function hideAllFormulaTooltips() {
  document.querySelectorAll(".formula-symbol-popover, .symbol-tooltip").forEach(node => node.remove());
}

function cleanDuplicateModalTabs() {
  const modal = document.querySelector("#modalContent");
  const tabs = modal?.querySelector(".detail-tabs");
  const panels = modal?.querySelector(".detail-panels");
  if (!tabs || !panels) return;

  const seenButtons = new Set();
  [...tabs.querySelectorAll("button")].forEach(button => {
    const id = getTabId(button);
    if (seenButtons.has(id)) button.remove();
    else seenButtons.add(id);
  });

  const seenPanels = new Set();
  [...panels.querySelectorAll(".detail-panel")].forEach(panel => {
    const id = panel.dataset.panel || "";
    if (seenPanels.has(id)) panel.remove();
    else seenPanels.add(id);
  });
}

function enhanceUsesPanel() {
  const modal = document.querySelector("#modalContent");
  const title = modal?.querySelector(".detail-header h2")?.textContent || "";
  const equation = richUsesByTitle.get(normalizeTitle(title));
  const panel = modal?.querySelector(".detail-panel.uses-view");
  if (!equation || !panel || panel.dataset.richUsesFor === equation.id) return;
  if (!Array.isArray(equation.useDetails) || !equation.useDetails.length) return;

  panel.innerHTML = `<div class="use-examples">${equation.useDetails.map(item => `<article class="use-example"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join("")}</div>`;
  panel.dataset.richUsesFor = equation.id;
}

function enhanceMetadataVariables() {
  const panel = document.querySelector("#modalContent .metadata-view");
  if (!panel || panel.dataset.variablesListed === "true") return;
  const rows = [...panel.querySelectorAll(":scope > div")];
  const variableRow = rows.find(row => normalizeTitle(row.querySelector("span")?.textContent || "") === "variables");
  const value = variableRow?.querySelector("strong");
  if (!variableRow || !value) return;
  const variables = value.textContent.split(/\s+·\s+/).map(item => item.trim()).filter(Boolean);
  if (variables.length < 2) return;

  const list = document.createElement("ul");
  list.className = "metadata-variable-list";
  variables.forEach(variable => {
    const item = document.createElement("li");
    item.textContent = variable;
    list.appendChild(item);
  });
  value.replaceChildren(list);
  panel.dataset.variablesListed = "true";
}

function enforceCurrentModalState() {
  const modal = document.querySelector("#modalContent");
  const tabs = modal?.querySelector(".detail-tabs");
  if (!tabs) return;
  const active = tabs.querySelector("button.active") || tabs.querySelector("button[data-target='formula']") || tabs.querySelector("button");
  if (active) enforceModalTab(active);
}

function enforceModalTab(button) {
  const modal = document.querySelector("#modalContent");
  const tabs = modal?.querySelector(".detail-tabs");
  const panels = modal?.querySelector(".detail-panels");
  if (!tabs || !panels || !button) return;
  const target = getTabId(button);
  if (!target) return;

  [...tabs.querySelectorAll("button")].forEach(item => {
    const active = getTabId(item) === target;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
  });

  [...panels.querySelectorAll(".detail-panel")].forEach(panel => {
    const active = panel.dataset.panel === target;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });

  if (target !== "formula") hideAllFormulaTooltips();
}

function getTabId(button) {
  return button?.dataset?.target || button?.dataset?.tab || "";
}

function getFormulaOverflow(formulaBox) {
  const available = Math.max(1, formulaBox.clientWidth - 2);
  const formulaWidth = getFormulaWidth(formulaBox);
  return formulaWidth / available;
}

function getFormulaWidth(formulaBox) {
  const nodes = [
    ...formulaBox.querySelectorAll("mjx-container"),
    ...formulaBox.querySelectorAll(".formula-stack > div")
  ];
  if (!nodes.length) return formulaBox.scrollWidth;
  return Math.max(...nodes.map(node => {
    const previousTransform = node.style.transform;
    node.style.transform = "";
    const width = node.getBoundingClientRect().width || node.scrollWidth || 0;
    node.style.transform = previousTransform;
    return width;
  }));
}

function getCurrentSpan(card) {
  const inline = Number.parseInt(card.style.getPropertyValue("--col-span"), 10);
  const data = Number.parseInt(card.dataset.minColSpan, 10);
  return Math.max(1, inline || data || 2);
}

function getGridColumnCount(grid) {
  const template = getComputedStyle(grid).gridTemplateColumns;
  const columns = template.split(" ").filter(Boolean).length;
  return Math.max(2, columns || 8);
}

function applyMasonrySpans(grid) {
  const computed = getComputedStyle(grid);
  const rowHeight = parseFloat(computed.gridAutoRows) || 10;
  const rowGap = parseFloat(computed.rowGap) || 0;
  grid.querySelectorAll(CARD_SELECTOR).forEach(card => {
    const minSpan = Number(card.dataset.minColSpan || 2);
    const height = card.getBoundingClientRect().height;
    const span = Math.max(minSpan, Math.ceil((height + rowGap) / (rowHeight + rowGap)));
    card.style.gridRowEnd = `span ${span}`;
  });
}

function normalizeTitle(value) {
  return String(value ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
