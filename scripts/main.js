import { equations as baseEquations } from "../data/equations.js";
import { extraEquations } from "../data/extra-equations.js";
import { advancedEquations } from "../data/advanced-equations.js";
import { completedEquations } from "../data/complete-equations.js";
import { finalCorrections } from "../data/final-corrections.js";
import { polishedEquations } from "../data/polished-equations.js";
import { pluginPolishedEquations } from "../data/plugin-polished-equations.js";
import { loadFormulaFiles } from "./formula-file-loader.js";
import { state, setState } from "./state.js";
import { $, unique } from "./utils.js";
import { filterEquations } from "./filtering.js";
import { renderEquationGrid, openEquationModal, closeEquationModal } from "./render.js";
import { initTheme } from "./theme.js";

let equations = [];
let fields = ["Todas"];
let levels = ["Todos"];

function mergeEquationSets(...sets) {
  return [...sets.flat().reduce((map, eq) => map.set(eq.id, eq), new Map()).values()];
}

async function boot() {
  showLoading("Preparando atlas", 2);
  let fileEquations = [];
  try {
    fileEquations = await loadFormulaFiles(updateLoading);
  } catch (error) {
    console.error("No se pudo cargar la estructura dinámica de fórmulas.", error);
    updateLoading({ message: "No se pudo escanear formulas; usando datos clásicos", value: 12 });
  }
  equations = mergeEquationSets(baseEquations, extraEquations, advancedEquations, completedEquations, finalCorrections, polishedEquations, pluginPolishedEquations, fileEquations);
  fields = ["Todas", ...unique(equations.map(eq => eq.field)).sort((a, b) => a.localeCompare(b, "es"))];
  levels = ["Todos", ...unique(equations.map(eq => eq.level))];
  initTheme($("#themeToggle"));
  initFilterControls();
  bindEvents();
  renderAll();
  hideLoading();
}

function initFilterControls() {
  fillSelect($("#fieldSelect"), fields, state.field);
  fillSelect($("#levelSelect"), levels, state.level);
  $("#sortSelect").value = "default";
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
