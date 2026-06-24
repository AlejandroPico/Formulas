import { equations } from "../data/equations.js";
import { state, setState } from "./state.js";
import { $ } from "./utils.js";
import { filterEquations } from "./filtering.js";
import { drawHeroCanvas } from "./simulations.js";
import { renderEquationGrid, openEquationModal, closeEquationModal } from "./render.js";
import { initTheme } from "./theme.js";

function boot() {
  initTheme($("#themeToggle"));
  bindEvents();
  drawHeroCanvas($("#heroCanvas"));
  initSplash();
  renderAll();
}

function bindEvents() {
  $("#sortSelect").addEventListener("change", event => {
    setState({ sort: event.target.value });
    renderAll();
  });

  $("#modalClose").addEventListener("click", closeEquationModal);
  $("#equationModal").addEventListener("click", event => {
    if (event.target.id === "equationModal") closeEquationModal();
  });
}

function initSplash() {
  const splash = $("#splashScreen");
  function hideSplash() {
    splash.classList.add("is-hidden");
  }

  splash.addEventListener("click", hideSplash, { once: true });
  window.setTimeout(hideSplash, 2200);
}

function renderAll() {
  const visible = filterEquations(equations, state);
  renderEquationGrid(visible, openEquationModal);
}

boot();
