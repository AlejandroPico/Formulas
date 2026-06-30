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
  "cauchy-integral-formula",
  "riemann-zeta-function",
  "poisson-equation",
  "convolution",
  "coulomb-law",
  "ohms-law",
  "kirchhoff-laws",
  "maxwell-equations",
  "navier-stokes",
  "heat-equation",
  "lorentz-force",
  "mass-energy-equivalence",
  "general-relativity",
  "friedmann-equations",
  "energy-momentum-relation",
  "lorentz-transformations",
  "schrodinger-equation",
  "dirac-equation",
  "heisenberg-uncertainty-principle",
  "de-broglie-relation",
  "born-rule",
  "quantum-commutator",
  "path-integral",
  "klein-gordon-equation",
  "bose-einstein-distribution",
  "fermi-dirac-distribution",
  "boltzmann-entropy",
  "planck-law"
]);

const MIGRATED_FORMULA_NAMES = new Set([
  "transformada de fourier",
  "ecuaciones de cauchy riemann",
  "ecuacion de euler lagrange",
  "ecuaciones de hamilton",
  "teorema de gauss",
  "teorema de stokes",
  "formula integral de cauchy",
  "funcion zeta de riemann",
  "ecuacion de poisson",
  "convolucion",
  "ley de coulomb",
  "ley de ohm",
  "leyes de kirchhoff",
  "ecuaciones de maxwell",
  "navier stokes",
  "ecuacion del calor",
  "fuerza de lorentz",
  "equivalencia masa energia",
  "relatividad general de einstein",
  "ecuaciones de friedmann",
  "relacion energia momento",
  "transformaciones de lorentz",
  "ecuacion de schrodinger",
  "ecuacion de schroedinger",
  "ecuacion de dirac",
  "principio de incertidumbre de heisenberg",
  "relacion de de broglie",
  "regla de born",
  "conmutador cuantico",
  "integral de camino de feynman",
  "integral de camino",
  "ecuacion de klein gordon",
  "distribucion de bose einstein",
  "distribucion de fermi dirac",
  "entropia de boltzmann",
  "ley de planck"
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
  injectMigrationDebugStyle();
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
  ensureMigrationDebugControls($("#filterPanel"));
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

  filterToggle.addEventListener("click", event => {
    if (event.altKey) {
      event.preventDefault();
      filterPanel.hidden = false;
      filterToggle.setAttribute("aria-expanded", "true");
      toggleMigrationDebugControls(filterPanel);
      return;
    }
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

function ensureMigrationDebugControls(filterPanel) {
  if (!filterPanel || filterPanel.querySelector("#migrationDebugTools")) return;
  const tools = document.createElement("div");
  tools.id = "migrationDebugTools";
  tools.className = "migration-debug-tools";
  tools.hidden = true;
  tools.innerHTML = `<button id="migrationTitleToggle" class="migration-debug-button" type="button" aria-pressed="false">Subrayar fichas migradas</button>`;
  filterPanel.appendChild(tools);
  tools.querySelector("#migrationTitleToggle").addEventListener("click", () => {
    setState({ showMigratedTitles: !state.showMigratedTitles });
    updateMigrationDebugButton();
    renderAll();
  });
  updateMigrationDebugButton();
}

function toggleMigrationDebugControls(filterPanel) {
  ensureMigrationDebugControls(filterPanel);
  const tools = filterPanel.querySelector("#migrationDebugTools");
  if (!tools) return;
  tools.hidden = !tools.hidden;
  if (!tools.hidden) updateMigrationDebugButton();
}

function updateMigrationDebugButton() {
  const button = document.querySelector("#migrationTitleToggle");
  if (!button) return;
  button.classList.toggle("active", state.showMigratedTitles);
  button.setAttribute("aria-pressed", String(state.showMigratedTitles));
  button.textContent = state.showMigratedTitles ? "Ocultar subrayado de migradas" : "Subrayar fichas migradas";
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
  applyMigrationTitleMarks(visible);
  updateVisibleCount(visible.length, equations.length);
}

function applyMigrationTitleMarks(visible) {
  const cards = [...document.querySelectorAll("#equationGrid .equation-card")];
  cards.forEach((card, index) => {
    const eq = visible[index];
    card.classList.toggle("migration-title-marked", Boolean(state.showMigratedTitles && isFormulaFileEntry(eq)));
  });
}

function isFormulaFileEntry(eq) {
  return Boolean(eq && (eq.source === "files" || String(eq.folder || "").startsWith("formulas/")));
}

function injectMigrationDebugStyle() {
  if (document.querySelector("#migrationDebugStyle")) return;
  const style = document.createElement("style");
  style.id = "migrationDebugStyle";
  style.textContent = `
    .migration-debug-tools[hidden] { display: none; }
    .migration-debug-tools { margin-top: 8px; padding-top: 10px; border-top: 1px dashed color-mix(in srgb, var(--line) 70%, transparent); }
    .migration-debug-button { width: 100%; border: 1px solid color-mix(in srgb, var(--line) 78%, transparent); border-radius: 12px; padding: 8px 10px; background: color-mix(in srgb, var(--panel-solid) 56%, transparent); color: var(--text); font: inherit; font-size: .82rem; font-weight: 760; cursor: pointer; }
    .migration-debug-button.active { border-color: color-mix(in srgb, var(--accent) 68%, var(--line)); color: var(--accent); }
    .equation-card.migration-title-marked h3 { text-decoration-line: underline; text-decoration-thickness: 2px; text-underline-offset: .18em; text-decoration-color: currentColor; }
  `;
  document.head.appendChild(style);
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
