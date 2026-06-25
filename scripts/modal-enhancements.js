import { historyEssays } from "../data/history-essays.js";

const historyByTitle = new Map(historyEssays.map(item => [normalizeTitle(item.title), item]));
const historyById = new Map(historyEssays.map(item => [item.id, item]));

const modal = document.querySelector("#equationModal");
const modalContent = document.querySelector("#modalContent");

const observer = new MutationObserver(() => enhanceModal());
if (modalContent) observer.observe(modalContent, { childList: true, subtree: true });

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

function enhanceModal() {
  if (!modal?.open || !modalContent?.querySelector(".detail-tabs")) return;
  addHistoryTab();
  removeHistoryFromContext();
}

function addHistoryTab() {
  const tabs = modalContent.querySelector(".detail-tabs");
  const panels = modalContent.querySelector(".detail-panels");
  if (!tabs || !panels || tabs.querySelector('[data-tab="history"]')) return;

  const title = modalContent.querySelector(".detail-header h2")?.textContent ?? "";
  const essay = historyByTitle.get(normalizeTitle(title)) || historyById.get(normalizeTitle(title));
  if (!essay) return;

  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("role", "tab");
  button.setAttribute("aria-selected", "false");
  button.dataset.tab = "history";
  button.textContent = "Historia";

  const contextButton = tabs.querySelector('[data-tab="context"]');
  tabs.insertBefore(button, contextButton || tabs.children[1] || null);

  const panel = document.createElement("section");
  panel.className = "detail-panel history-view";
  panel.dataset.panel = "history";
  panel.setAttribute("role", "tabpanel");
  panel.hidden = true;
  panel.innerHTML = renderHistoryEssay(essay);
  panels.insertBefore(panel, panels.querySelector('[data-panel="context"]') || null);

  button.addEventListener("click", () => activateTab("history"));
}

function activateTab(tab) {
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

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
