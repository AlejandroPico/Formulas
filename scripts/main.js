import { loadFormulaFiles } from "./formula-file-loader.js";
import { state, setState } from "./state.js";
import { $, unique } from "./utils.js";
import { filterEquations } from "./filtering.js";
import { renderEquationGrid, openEquationModal, closeEquationModal } from "./render-dynamic.js";
import { initTheme } from "./theme.js";

const LEGACY_DATA_MODULES = [
  { path: "../data/equations.js", exportName: "equations" },
  { path: "../data/extra-equations.js", exportName: "extraEquations" },
  { path: "../data/advanced-equations.js", exportName: "advancedEquations" },
  { path: "../data/complete-equations.js", exportName: "completedEquations" },
  { path: "../data/final-corrections.js", exportName: "finalCorrections" },
  { path: "../data/polished-equations.js", exportName: "polishedEquations" },
  { path: "../data/plugin-polished-equations.js", exportName: "pluginPolishedEquations" }
];

const MIGRATED_FORMULA_IDS = new Set([
  "fourier-transform",
  "cauchy-riemann",
  "euler-lagrange",
  "hamilton-equations",
  "gauss-theorem",
  "stokes-theorem",
  "cauchy-integral-formula"
]);

const MIGRATED_FORMULA_NAMES = new Set([
  "transformada de fourier",
  "ecuaciones de cauchy riemann",
  "ecuacion de euler lagrange",
  "ecuaciones de hamilton",
  "teorema de gauss",
  "teorema de stokes",
  "formula integral de cauchy"
]);

let equations = [];
let fields = ["Todas"];
let levels = ["Todos"];

function mergeEquationSets(...sets) {
  const byId = new Map();
  const byName = new Map();
  for (const eq of sets.flat()) {
    const key = normalizeFormulaName(eq.name || eq.id);
    if (byName.has(key)) {
      byId.delete(byName.get(key));
    }
    byName.set(key, eq.id);
    byId.set(eq.id, eq);
  }
  return [...byId.values()];
}

async function boot() {
  showLoading("Preparando atlas", 2);
  const legacySets = await loadLegacyData();
  let fileEquations = [];
  try {
    fileEquations = await loadFormulaFiles(updateLoading);
  } catch (error) {
    console.error("No se pudo cargar la estructura dinámica de fórmulas.", error);
    updateLoading({ message: "No se pudo escanear formulas", value: 12 });
  }
  equations = mergeEquationSets(...legacySets, fileEquations);
  fields = ["Todas", ...unique(equations.map(eq => eq.field)).sort((a, b) => a.localeCompare(b, "es"))];
  levels = ["Todos", ...unique(equations.map(eq => eq.level))];
  initTheme($("#themeToggle"));
  initFilterControls();
  bindEvents();
  renderAll();
  hideLoading();
}

async function loadLegacyData() {
  const sets = [];
  for (const descriptor of LEGACY_DATA_MODULES) {
    try {
      const module = await import(descriptor.path);
      if (Array.isArray(module[descriptor.exportName])) {
        sets.push(module[descriptor.exportName].filter(eq => !isMigratedLegacyFormula(eq)));
      }
    } catch (error) {
      console.info(`Módulo legacy omitido: ${descriptor.path}`, error);
    }
  }
  return sets;
}

function isMigratedLegacyFormula(eq) {
  return MIGRATED_FORMULA_IDS.has(eq.id) || MIGRATED_FORMULA_NAMES.has(normalizeFormulaName(eq.name));
}

function normalizeFormulaName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function initFilterControls() {
  fillSelect($("#fieldSelect"), fields, state.field);
  fillSelect($("#levelSelect"), levels, state.level);
  $("#sortSelect").value = "default";
  const displaySelect = document.querySelector("#formulaDisplaySelect");
  if (displaySelect) displaySelect.value = state.formulaDisplay;
}

function fillSelect(select, values, active) {
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
    const query = event.target.value;
    setState({ query });
    searchControl.classList.toggle("has-query", Boolean(query.trim()));
    renderAll();
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
    if (selectedSort === "default") {
      setState({ sort: "chronology", cardLabelMode: "none" });
    } else {
      setState({ sort: selectedSort, cardLabelMode: getSortLabelMode(selectedSort) });
    }
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

function renderAll() {
  const visible = filterEquations(equations, state);
  renderEquationGrid(visible, openEquationModal, state);
  updateVisibleCount(visible.length, equations.length);
}

function updateVisibleCount(visible, total) {
  const target = document.querySelector("#visibleCount");
  if (!target) return;
  target.textContent = `${visible} / ${total}`;
}

function updateLoading({ message, value }) {
  showLoading(message, value);
}

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
