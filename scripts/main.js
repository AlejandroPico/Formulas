import { loadFormulaFiles } from "./formula-file-loader.js";
import { state, setState } from "./state.js";
import { $, unique } from "./utils.js";
import { filterEquations } from "./filtering.js";
import { renderEquationGrid, openEquationModal, closeEquationModal } from "./render-performance.js";
import { initTheme } from "./theme.js";
import "./formula-prompt-override.js";

let equations = [];
let fields = ["Todas"];
let levels = ["Todos"];
let controlsReady = false;
let renderQueued = false;
let renderTimer = 0;
let runtimeRefreshTimer = 0;
let lastRenderedTotal = 0;

async function boot() {
  showLoading("Preparando atlas", 2);
  try {
    equations = await loadFormulaFiles(updateLoading);
  } catch (error) {
    console.error("No se pudo cargar la estructura dinámica de fórmulas.", error);
    equations = [];
    updateLoading({ message: "No se pudo escanear formulas", value: 12 });
  }
  window.FormulasAtlas = {
    equations,
    refresh(options = {}) {
      scheduleRuntimeRefresh(Boolean(options.force));
    },
    getAll() { return equations; }
  };
  window.dispatchEvent(new CustomEvent("formulas:catalog-ready", { detail: { equations } }));
  syncDynamicCatalog(false);
  initTheme($("#themeToggle"));
  initFilterControls();
  bindEvents();
  renderAll();
  hideLoading();
}

function syncDynamicCatalog(updateControls = false) {
  const live = window.FormulasAtlas?.equations;
  if (Array.isArray(live) && live !== equations) equations = live;
  fields = ["Todas", ...unique(equations.map(eq => eq.field)).sort((a, b) => a.localeCompare(b, "es"))];
  levels = ["Todos", ...unique(equations.map(eq => eq.level))];
  if (!fields.includes(state.field)) setState({ field: "Todas" });
  if (!levels.includes(state.level)) setState({ level: "Todos" });
  if (updateControls && controlsReady) {
    fillSelect($("#fieldSelect"), fields, state.field);
    fillSelect($("#levelSelect"), levels, state.level);
  }
}

function initFilterControls() {
  fillSelect($("#fieldSelect"), fields, state.field);
  fillSelect($("#levelSelect"), levels, state.level);
  $("#sortSelect").value = state.sort === "chronology" ? "default" : state.sort;
  const displaySelect = document.querySelector("#formulaDisplaySelect");
  if (displaySelect) displaySelect.value = state.formulaDisplay;
  controlsReady = true;
}

function fillSelect(select, values, active) {
  if (!select) return;
  select.innerHTML = values.map(value => `<option value="${value}"${value === active ? " selected" : ""}>${value}</option>`).join("");
}

function bindEvents() {
  const filterToggle = $("#filterToggle");
  const filterPanel = $("#filterPanel");
  const searchToggle = $("#searchToggle");
  const searchField = $("#searchField");
  const searchInput = $("#searchInput");
  const searchClear = $("#searchClear");
  const searchControl = $("#searchControl");
  const formulaDisplaySelect = document.querySelector("#formulaDisplaySelect");

  window.addEventListener("formulas:catalog-mutated", () => scheduleRuntimeRefresh(false));

  filterToggle.addEventListener("click", () => {
    const isOpen = !filterPanel.hidden;
    filterPanel.hidden = isOpen;
    filterToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  searchToggle.addEventListener("click", () => {
    const open = searchField.hidden;
    searchField.hidden = !open;
    searchControl.classList.toggle("open", open);
    searchToggle.setAttribute("aria-expanded", String(open));
    if (open) searchInput.focus();
  });

  searchInput.addEventListener("input", event => {
    setState({ query: event.target.value });
    searchControl.classList.toggle("has-query", Boolean(event.target.value.trim()));
    scheduleRender();
  });

  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    setState({ query: "" });
    searchControl.classList.remove("has-query");
    searchInput.focus();
    renderAll();
  });

  searchInput.addEventListener("keydown", event => {
    if (event.key === "Escape" && !searchInput.value) {
      searchField.hidden = true;
      searchControl.classList.remove("open");
      searchToggle.setAttribute("aria-expanded", "false");
    }
  });

  $("#sortSelect").addEventListener("change", event => {
    const selectedSort = event.target.value;
    if (selectedSort === "default") setState({ sort: "chronology", cardLabelMode: "none" });
    else setState({ sort: selectedSort, cardLabelMode: getSortLabelMode(selectedSort) });
    renderAll();
  });
  $("#fieldSelect").addEventListener("change", event => {
    const field = event.target.value;
    setState({ field, cardLabelMode: field === "Todas" ? state.cardLabelMode : "field" });
    renderAll();
  });
  $("#levelSelect").addEventListener("change", event => {
    const level = event.target.value;
    setState({ level, cardLabelMode: level === "Todos" ? state.cardLabelMode : "level" });
    renderAll();
  });
  formulaDisplaySelect?.addEventListener("change", event => {
    setState({ formulaDisplay: event.target.value });
    renderAll();
  });

  $("#modalClose").addEventListener("click", closeEquationModal);
  $("#equationModal").addEventListener("click", event => {
    if (event.target.id === "equationModal") closeEquationModal();
  });
}

function getSortLabelMode(sort) {
  if (sort === "field") return "field";
  if (sort === "level") return "level";
  if (sort === "chronology") return "year";
  return "none";
}

function scheduleRuntimeRefresh(force) {
  window.clearTimeout(runtimeRefreshTimer);
  runtimeRefreshTimer = window.setTimeout(() => {
    runtimeRefreshTimer = 0;
    const total = window.FormulasAtlas?.equations?.length || equations.length;
    if (!force && total === lastRenderedTotal) return;
    syncDynamicCatalog(true);
    renderAll();
  }, 650);
}

function scheduleRender() {
  window.clearTimeout(renderTimer);
  renderTimer = window.setTimeout(() => {
    renderTimer = 0;
    if (renderQueued) return;
    renderQueued = true;
    window.requestAnimationFrame(() => {
      renderQueued = false;
      renderAll();
    });
  }, 80);
}

function renderAll() {
  if (renderTimer) {
    window.clearTimeout(renderTimer);
    renderTimer = 0;
  }
  syncDynamicCatalog(false);
  const visible = filterEquations(equations, state);
  renderEquationGrid(visible, openEquationModal, state);
  updateVisibleCount(visible.length, equations.length);
  lastRenderedTotal = equations.length;
}

function updateVisibleCount(visible, total) {
  const target = document.querySelector("#visibleCount");
  if (target) target.textContent = `${visible} / ${total}`;
}

function updateLoading({ message, value }) { showLoading(message, value); }

function showLoading(message, value = 0) {
  const overlay = document.querySelector("#loadingOverlay");
  if (!overlay) return;
  const status = overlay.querySelector("#loadingStatus");
  const bar = overlay.querySelector("#loadingProgressBar");
  overlay.hidden = false;
  if (status) status.textContent = message || "Cargando datos";
  if (bar) bar.style.width = `${Math.max(0, Math.min(100, Number(value) || 0))}%`;
}

function hideLoading() {
  const overlay = document.querySelector("#loadingOverlay");
  if (!overlay) return;
  overlay.classList.add("leaving");
  window.setTimeout(() => {
    overlay.hidden = true;
    overlay.classList.remove("leaving");
  }, 180);
}

boot();
