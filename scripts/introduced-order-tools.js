const INTRO_SORT_VALUE = "introduced-desc";
const INTRO_BUTTON_ID = "introducedFirstButton";
const CATALOG_ORDER_ID = "catalogIntroducedOrder";

function ensureIntroSortOption() {
  const sortSelect = document.querySelector("#sortSelect");
  if (!sortSelect || sortSelect.querySelector('option[value="introduced-desc"]')) return sortSelect;
  const option = document.createElement("option");
  option.value = INTRO_SORT_VALUE;
  option.textContent = "Ultimas introducidas";
  sortSelect.appendChild(option);
  return sortSelect;
}

function activateIntroducedFirst() {
  const sortSelect = ensureIntroSortOption();
  if (!sortSelect) return;
  sortSelect.value = INTRO_SORT_VALUE;
  sortSelect.dispatchEvent(new Event("change", { bubbles: true }));
}

function installFilterAdminButton() {
  const tools = document.querySelector("#catalogAdminTools");
  if (!tools || tools.querySelector("#" + INTRO_BUTTON_ID)) return;
  const button = document.createElement("button");
  button.id = INTRO_BUTTON_ID;
  button.type = "button";
  button.textContent = "Ultimas primero";
  button.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    activateIntroducedFirst();
  });
  tools.appendChild(button);
}

function enhanceCatalogDialog() {
  const dialog = document.querySelector("#catalogDialog");
  const actions = dialog && dialog.querySelector(".catalog-actions");
  if (!dialog || !actions || actions.querySelector("#" + CATALOG_ORDER_ID)) return;
  const label = document.createElement("label");
  label.className = "catalog-order-control";
  const span = document.createElement("span");
  span.textContent = "Orden";
  const select = document.createElement("select");
  select.id = CATALOG_ORDER_ID;
  select.setAttribute("aria-label", "Orden del inventario tecnico");
  [["current", "Actual"], ["introduced-desc", "Ultimas introducidas primero"], ["introduced-asc", "Primeras introducidas primero"]].forEach(([value, text]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
  });
  label.appendChild(span);
  label.appendChild(select);
  actions.insertBefore(label, actions.children[1] || null);
  select.addEventListener("change", () => applyCatalogOrder(dialog, select.value));
}

function applyCatalogOrder(dialog, mode) {
  dialog.querySelectorAll(".catalog-table tbody").forEach(tbody => {
    const rows = Array.from(tbody.querySelectorAll("tr[data-index]"));
    rows.sort((a, b) => {
      const ai = Number(a.dataset.index) || 0;
      const bi = Number(b.dataset.index) || 0;
      if (mode === "introduced-desc") return bi - ai;
      return ai - bi;
    });
    rows.forEach(row => tbody.appendChild(row));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  ensureIntroSortOption();
  document.addEventListener("click", event => {
    if (event.altKey && event.target.closest && event.target.closest("#filterToggle")) {
      window.setTimeout(installFilterAdminButton, 0);
      window.setTimeout(installFilterAdminButton, 120);
    }
  }, true);
  const observer = new MutationObserver(() => {
    installFilterAdminButton();
    enhanceCatalogDialog();
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
