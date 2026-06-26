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

  filterToggle.addEventListener("click", () => {
    const isOpen = !filterPanel.hidden;
    filterPanel.hidden = isOpen;
    filterToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  $("#sortSelect").addEventListener("change", event => {
    setState({ sort: event.target.value });
    renderAll();
  });
  $("#fieldSelect").addEventListener("change", event => {
    setState({ field: event.target.value });
    renderAll();
  });
  $("#levelSelect").addEventListener("change", event => {
    setState({ level: event.target.value });
    renderAll();
  });

  $("#modalClose").addEventListener("click", closeEquationModal);
  $("#equationModal").addEventListener("click", event => {
    if (event.target.id === "equationModal") closeEquationModal();
  });
}

function renderAll() {
  const visible = filterEquations(equations, state);
  renderEquationGrid(visible, openEquationModal);
}

boot();
