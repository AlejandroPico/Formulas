import { mountFormulaTooltips } from "./formula-tooltips.js";

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
  mountFormulaTooltips(formulaBox, { variables: [] });
}
