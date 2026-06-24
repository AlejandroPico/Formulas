import { $, requestMathTypeset } from "./utils.js";
import { mountSimulation } from "./simulations.js";

let disposeSimulation = null;

export function renderFilters(container, values, activeValue, onChange) {
  container.innerHTML = values.map(value => `<button class="filter-pill ${value === activeValue ? "active" : ""}" data-value="${value}">${value}</button>`).join("");
  container.querySelectorAll("button").forEach(button => button.addEventListener("click", () => onChange(button.dataset.value)));
}

export function renderEquationGrid(equations, onOpen) {
  const grid = $("#equationGrid");
  const template = $("#equationCardTemplate");
  grid.innerHTML = "";
  if (!equations.length) {
    grid.innerHTML = `<div class="empty-state">No hay ecuaciones que coincidan con los filtros actuales.</div>`;
    return;
  }

  equations.forEach(eq => {
    const node = template.content.firstElementChild.cloneNode(true);
    const widthLevel = getWidthLevel(eq.formula);
    node.classList.add(`size-${widthLevel}`);
    node.style.setProperty("--tag-color", eq.color);
    node.setAttribute("role", "button");
    node.setAttribute("aria-label", `Abrir ficha de ${eq.name}`);

    $("h3", node).textContent = eq.name;
    $(".formula-box", node).innerHTML = `\\(${eq.formula}\\)`;

    node.addEventListener("click", () => onOpen(eq));
    node.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen(eq);
      }
    });
    grid.appendChild(node);
  });
  requestMathTypeset();
}

function getWidthLevel(formula) {
  const length = formula.length;
  if (length > 130) return 4;
  if (length > 78) return 3;
  if (length > 42) return 2;
  return 1;
}

export function renderTimeline(equations) {
  const host = $("#timeline");
  if (!host) return;
  host.innerHTML = equations
    .slice()
    .sort((a, b) => a.year - b.year)
    .map(eq => `<article class="timeline-item" style="--item-color:${eq.color}"><div class="timeline-year">${eq.year}</div><div class="timeline-body"><strong>${eq.name}</strong><span>${eq.author} · ${eq.field}</span></div></article>`)
    .join("");
}

export function openEquationModal(eq) {
  const modal = $("#equationModal");
  const content = $("#modalContent");
  if (disposeSimulation) disposeSimulation();
  content.innerHTML = `
    <section class="modal-hero" style="--tag-color:${eq.color}">
      <div class="modal-title">
        <p class="eyebrow">${eq.author} · ${eq.year} · ${eq.level}</p>
        <h2>${eq.name}</h2>
        <p>${eq.meaning}</p>
        <div class="formula-box modal-formula">\\(${eq.formula}\\)</div>
      </div>
      <div class="info-box">
        <h3>Lectura rápida</h3>
        <p>${eq.summary}</p>
        <p><strong>Área:</strong> ${eq.field}<br><strong>Nivel:</strong> ${eq.level}<br><strong>Año:</strong> ${eq.year}</p>
      </div>
    </section>
    <section class="info-grid">
      <article class="info-box"><h3>Variables</h3><ul class="variable-list">${eq.variables.map(v => `<li>${v}</li>`).join("")}</ul></article>
      <article class="info-box"><h3>Historia</h3><p>${eq.history}</p></article>
      <article class="info-box"><h3>Casos de uso</h3><ul class="variable-list">${eq.uses.map(v => `<li>${v}</li>`).join("")}</ul></article>
      <article class="info-box"><h3>Derivación simplificada</h3><p>${eq.derivation}</p></article>
    </section>
    <section class="simulation-panel">
      <h3>Simulación conceptual</h3>
      <canvas id="simulationCanvas"></canvas>
      <div class="sim-controls" id="simulationControls"></div>
    </section>
  `;
  modal.showModal();
  requestMathTypeset();
  disposeSimulation = mountSimulation(eq.simulation, $("#simulationCanvas"), $("#simulationControls"));
}

export function closeEquationModal() {
  if (disposeSimulation) disposeSimulation();
  disposeSimulation = null;
  $("#equationModal").close();
}
