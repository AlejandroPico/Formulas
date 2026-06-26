import { equations as baseEquations } from "../data/equations.js";
import { extraEquations } from "../data/extra-equations.js";
import { advancedEquations } from "../data/advanced-equations.js";
import { completedEquations } from "../data/complete-equations.js";
import { finalCorrections } from "../data/final-corrections.js";
import { polishedEquations } from "../data/polished-equations.js";
import { state, setState } from "./state.js";
import { $, unique } from "./utils.js";
import { filterEquations } from "./filtering.js";
import { renderEquationGrid, openEquationModal, closeEquationModal } from "./render.js";
import { initTheme } from "./theme.js";

const equations = mergeEquationSets(baseEquations, extraEquations, advancedEquations, completedEquations, finalCorrections, polishedEquations);
const fields = ["Todas", ...unique(equations.map(eq => eq.field)).sort((a, b) => a.localeCompare(b, "es"))];
const levels = ["Todos", ...unique(equations.map(eq => eq.level))];

function mergeEquationSets(...sets) {
  return [...sets.flat().reduce((map, eq) => map.set(eq.id, eq), new Map()).values()];
}

function boot() {
  initTheme($("#themeToggle"));
  initFilterControls();
  bindEvents();
  renderAll();
}

function initFilterControls() {
  fillSelect($("#fieldSelect"), fields, state.field);
  fillSelect($("#levelSelect"), levels, state.level);
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
    setState({ sort: event.target.value, cardLabelMode: getSortLabelMode(event.target.value) });
    renderAll();
  });
  $("#fieldSelect").addEventListener("change", event => {
    setState({ field: event.target.value, cardLabelMode: event.target.value === "Todas" ? "none" : "field" });
    renderAll();
  });
  $("#levelSelect").addEventListener("change", event => {
    setState({ level: event.target.value, cardLabelMode: event.target.value === "Todos" ? "none" : "level" });
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

boot();
