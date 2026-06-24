import { equations } from "../data/equations.js";
import { state, setState } from "./state.js";
import { $, unique } from "./utils.js";
import { filterEquations } from "./filtering.js";
import { drawHeroCanvas } from "./simulations.js";
import { renderEquationGrid, renderFilters, renderTimeline, openEquationModal, closeEquationModal } from "./render.js";

const fields = ["Todas", ...unique(equations.map(eq => eq.field)).sort((a, b) => a.localeCompare(b, "es"))];
const levels = ["Todos", ...unique(equations.map(eq => eq.level))];

function boot() {
  $("#totalCount").textContent = equations.length;
  bindEvents();
  drawHeroCanvas($("#heroCanvas"));
  renderTimeline(equations);
  renderAll();
}

function bindEvents() {
  $("#menuToggle").addEventListener("click", () => document.body.classList.toggle("panel-open"));
  $("#themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
    $("#themeToggle").textContent = document.body.classList.contains("light") ? "Modo noche" : "Modo día";
  });
  $("#resetView").addEventListener("click", () => {
    setState({ query: "", field: "Todas", level: "Todos", sort: "chronology" });
    $("#searchInput").value = "";
    $("#sortSelect").value = "chronology";
    renderAll();
  });
  $("#searchInput").addEventListener("input", event => {
    setState({ query: event.target.value });
    renderAll();
  });
  $("#sortSelect").addEventListener("change", event => {
    setState({ sort: event.target.value });
    renderAll();
  });
  $("#modalClose").addEventListener("click", closeEquationModal);
  $("#equationModal").addEventListener("click", event => {
    if (event.target.id === "equationModal") closeEquationModal();
  });
}

function renderAll() {
  renderFilters($("#fieldFilters"), fields, state.field, value => {
    setState({ field: value });
    renderAll();
  });
  renderFilters($("#levelFilters"), levels, state.level, value => {
    setState({ level: value });
    renderAll();
  });
  const visible = filterEquations(equations, state);
  $("#visibleCount").textContent = visible.length;
  renderEquationGrid(visible, openEquationModal);
}

boot();
