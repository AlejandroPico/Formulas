const GRID_SELECTOR = "#equationGrid";
const CARD_SELECTOR = ".equation-card";
const FORMULA_SELECTOR = ".formula-box";

const observer = new MutationObserver(scheduleCardFit);
const grid = document.querySelector(GRID_SELECTOR);

if (grid) {
  observer.observe(grid, { childList: true, subtree: true });
  window.addEventListener("formulas:math-typeset", scheduleCardFit);
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
  window.setTimeout(() => { cleanDuplicateModalTabs(); enhanceMetadataVariables(); enforceCurrentModalState(); fitActiveModalFormula(); }, 80);
  window.setTimeout(() => { cleanDuplicateModalTabs(); enhanceMetadataVariables(); enforceCurrentModalState(); fitActiveModalFormula(); }, 260);
  window.setTimeout(() => { cleanDuplicateModalTabs(); enhanceMetadataVariables(); enforceCurrentModalState(); fitActiveModalFormula(); }, 620);
}

function scheduleModalFormulaFit() {
  window.setTimeout(fitActiveModalFormula, 70);
  window.setTimeout(fitActiveModalFormula, 160);
  window.setTimeout(fitActiveModalFormula, 320);
  window.setTimeout(fitActiveModalFormula, 640);
  window.setTimeout(fitActiveModalFormula, 1100);
  window.setTimeout(fitActiveModalFormula, 1800);
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

  const fitLayer = ensureModalFormulaFitLayer(box);
  const math = [...fitLayer.querySelectorAll("mjx-container")];
  if (!math.length) return;

  box.style.setProperty("--modal-formula-scale", "1");
  fitLayer.style.transform = "none";

  const boxRect = box.getBoundingClientRect();
  const fitRect = fitLayer.getBoundingClientRect();
  if (!boxRect.width || !boxRect.height || !fitRect.width || !fitRect.height) return;

  const safeWidth = Math.max(1, boxRect.width - Math.max(42, boxRect.width * 0.075));
  const safeHeight = Math.max(1, boxRect.height - Math.max(36, boxRect.height * 0.075));
  const scale = Math.min(1, safeWidth / fitRect.width, safeHeight / fitRect.height);
  const finalScale = Math.max(0.012, scale * 0.985);

  box.style.setProperty("--modal-formula-scale", finalScale.toFixed(5));
  fitLayer.style.transform = "";
}

function ensureModalFormulaFitLayer(box) {
  const existing = box.querySelector(":scope > .modal-formula-fit");
  if (existing) return existing;

  const layer = document.createElement("div");
  layer.className = "modal-formula-fit";
  const tooltipLayer = box.querySelector(":scope > .formula-tooltip-layer");
  const movable = [...box.childNodes].filter(node => node !== tooltipLayer);
  movable.forEach(node => layer.appendChild(node));
  box.insertBefore(layer, tooltipLayer || null);
  return layer;
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
    const minRowSpan = Number.parseInt(card.style.getPropertyValue("--row-span"), 10) || 8;
    const height = card.getBoundingClientRect().height;
    const span = Math.max(minRowSpan, Math.ceil((height + rowGap) / (rowHeight + rowGap)));
    card.style.gridRowEnd = `span ${span}`;
  });
}

function normalizeTitle(value) {
  return String(value ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
