const GRID_SELECTOR = "#equationGrid";
const CARD_SELECTOR = ".equation-card";

const grid = document.querySelector(GRID_SELECTOR);
let modalFitTimer = 0;

if (grid) {
  window.addEventListener("resize", scheduleModalFormulaFit);

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
    if (event.target.closest?.(CARD_SELECTOR)) {
      hideAllFormulaTooltips();
      scheduleModalCleanup();
      scheduleModalFormulaFit();
    }
  }, true);

  window.setInterval(() => {
    if (!document.querySelector("#equationModal[open]")) return;
    cleanDuplicateModalTabs();
    enhanceMetadataVariables();
    enforceCurrentModalState();
    fitActiveModalFormula();
  }, 1600);
}

function scheduleModalCleanup() {
  window.setTimeout(() => { cleanDuplicateModalTabs(); enhanceMetadataVariables(); enforceCurrentModalState(); fitActiveModalFormula(); }, 80);
  window.setTimeout(() => { cleanDuplicateModalTabs(); enhanceMetadataVariables(); enforceCurrentModalState(); fitActiveModalFormula(); }, 260);
}

function scheduleModalFormulaFit() {
  window.clearTimeout(modalFitTimer);
  modalFitTimer = window.setTimeout(fitActiveModalFormula, 120);
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

function normalizeTitle(value) {
  return String(value ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
