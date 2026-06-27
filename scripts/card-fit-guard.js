const GRID_SELECTOR = "#equationGrid";
const CARD_SELECTOR = ".equation-card";
const FORMULA_SELECTOR = ".formula-box";

const observer = new MutationObserver(scheduleCardFit);
const grid = document.querySelector(GRID_SELECTOR);

if (grid) {
  observer.observe(grid, { childList: true, subtree: true });
  window.addEventListener("resize", scheduleCardFit);
  document.addEventListener("click", event => {
    if (event.target.closest?.(".equation-card, .detail-tabs button")) scheduleModalCleanup();
  });
  window.setInterval(cleanDuplicateModalTabs, 1200);
  scheduleCardFit();
}

function scheduleCardFit() {
  window.setTimeout(fitCards, 120);
  window.setTimeout(fitCards, 360);
  window.setTimeout(fitCards, 800);
  window.setTimeout(fitCards, 1400);
}

function scheduleModalCleanup() {
  window.setTimeout(cleanDuplicateModalTabs, 80);
  window.setTimeout(cleanDuplicateModalTabs, 260);
  window.setTimeout(cleanDuplicateModalTabs, 620);
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

function cleanDuplicateModalTabs() {
  const modal = document.querySelector("#modalContent");
  const tabs = modal?.querySelector(".detail-tabs");
  const panels = modal?.querySelector(".detail-panels");
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
