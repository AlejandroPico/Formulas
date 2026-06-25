import { $, requestMathTypeset } from "./utils.js";
import { mountSimulation } from "./simulations.js";

let disposeSimulation = null;
let resizeHandler = null;

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
    const formulas = normalizeFormulaList(eq.formula);
    const node = template.content.firstElementChild.cloneNode(true);
    const widthLevel = getWidthLevel(formulas);
    const minColSpan = getColumnSpan(widthLevel);
    node.classList.add(`size-${widthLevel}`);
    node.classList.toggle("is-multiline", formulas.length > 1);
    node.dataset.minColSpan = String(minColSpan);
    node.style.setProperty("--formula-lines", formulas.length);
    node.style.setProperty("--col-span", minColSpan);
    node.setAttribute("role", "button");
    node.setAttribute("aria-label", `Abrir ficha de ${eq.name}`);

    $("h3", node).textContent = eq.name;
    $(".formula-box", node).innerHTML = renderFormula(formulas);

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
  scheduleMasonryLayout(grid);
}

function renderFormula(formulas) {
  if (formulas.length === 1) return `\\(${formulas[0]}\\)`;
  return `<div class="formula-stack">${formulas.map(line => `<div>\\(${line}\\)</div>`).join("")}</div>`;
}

function normalizeFormulaList(formula) {
  return Array.isArray(formula) ? formula : [formula];
}

function getWidthLevel(formulas) {
  const length = getMaxFormulaLength(formulas);
  if (length > 82) return 3;
  if (length > 42) return 2;
  return 1;
}

function getColumnSpan(widthLevel) {
  return { 1: 2, 2: 3, 3: 4 }[widthLevel] ?? 2;
}

function getMaxFormulaLength(formulas) {
  return Math.max(...formulas.map(normalizeFormulaLength));
}

function normalizeFormulaLength(formula) {
  return formula
    .replace(/\\frac/g, "ffff")
    .replace(/\\partial/g, "ddd")
    .replace(/\\mathbf/g, "bb")
    .replace(/\\nabla/g, "nn")
    .replace(/\\lVert/g, "xxxxx")
    .replace(/\\rVert/g, "xxxxx")
    .replace(/\\[a-zA-Z]+/g, "x")
    .replace(/[{}]/g, "")
    .length;
}

function scheduleMasonryLayout(grid) {
  const run = () => applyMasonrySpans(grid);
  window.setTimeout(run, 80);
  window.setTimeout(run, 260);
  window.setTimeout(run, 640);
  if (resizeHandler) window.removeEventListener("resize", resizeHandler);
  resizeHandler = run;
  window.addEventListener("resize", resizeHandler);
}

function applyMasonrySpans(grid) {
  const computed = getComputedStyle(grid);
  const rowHeight = parseFloat(computed.gridAutoRows) || 10;
  const rowGap = parseFloat(computed.rowGap) || 0;
  const columnGap = parseFloat(computed.columnGap) || 0;
  const columnTracks = computed.gridTemplateColumns.split(" ").filter(Boolean);
  const columnCount = Math.max(1, columnTracks.length);
  const columnWidth = parseFloat(columnTracks[0]) || 118;

  const cards = [...grid.querySelectorAll(".equation-card")];

  cards.forEach(card => {
    const minSpan = Math.min(columnCount, Number(card.dataset.minColSpan || 2));
    card.style.gridColumn = `span ${Math.max(1, minSpan)}`;
    card.style.gridRowEnd = "auto";
  });

  cards.forEach(card => {
    if (columnCount <= 1) {
      card.style.gridColumn = "span 1";
      return;
    }
    const minSpan = Number(card.dataset.minColSpan || 2);
    const desiredWidth = Math.max(getRenderedFormulaWidth(card), getRenderedTitleWidth(card)) + 58;
    const measuredSpan = Math.ceil((desiredWidth + columnGap) / (columnWidth + columnGap));
    const finalSpan = Math.max(2, Math.min(columnCount, Math.max(minSpan, measuredSpan)));
    card.style.gridColumn = `span ${finalSpan}`;
  });

  cards.forEach(card => {
    const height = card.scrollHeight;
    const span = Math.ceil((height + rowGap) / (rowHeight + rowGap));
    card.style.gridRowEnd = `span ${span}`;
  });
}

function getRenderedFormulaWidth(card) {
  const formulaBox = $(".formula-box", card);
  const mathNodes = [...formulaBox.querySelectorAll("mjx-container")];
  const mathWidths = mathNodes.map(node => Math.ceil(node.getBoundingClientRect().width || node.scrollWidth || 0));
  const stackLineWidths = [...formulaBox.querySelectorAll(".formula-stack > div")].map(node => node.scrollWidth || 0);
  return Math.max(formulaBox.scrollWidth || 0, ...mathWidths, ...stackLineWidths, 0);
}

function getRenderedTitleWidth(card) {
  const title = $("h3", card);
  return title?.scrollWidth || 0;
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
  const formulas = normalizeFormulaList(eq.formula);
  if (disposeSimulation) disposeSimulation();
  disposeSimulation = null;

  content.innerHTML = `
    <section class="detail-shell" style="--tag-color:${eq.color}">
      <header class="detail-header">
        <div>
          <p class="eyebrow">${eq.author} · ${eq.year}</p>
          <h2>${eq.name}</h2>
        </div>
        <div class="detail-meta" aria-label="Metadatos">
          <span>${eq.field}</span>
          <span>${eq.level}</span>
        </div>
      </header>

      <nav class="detail-tabs" role="tablist" aria-label="Secciones de la ficha">
        <button class="active" type="button" role="tab" aria-selected="true" data-tab="formula">Fórmula</button>
        <button type="button" role="tab" aria-selected="false" data-tab="variables">Variables</button>
        <button type="button" role="tab" aria-selected="false" data-tab="context">Contexto</button>
        <button type="button" role="tab" aria-selected="false" data-tab="uses">Usos</button>
        <button type="button" role="tab" aria-selected="false" data-tab="simulation">Simulación</button>
      </nav>

      <div class="detail-panels">
        <section class="detail-panel active" data-panel="formula" role="tabpanel">
          <article class="detail-formula-card">
            <div class="formula-box modal-formula">${renderFormula(formulas)}</div>
          </article>
          <article class="detail-copy-card">
            <h3>Lectura rápida</h3>
            <p>${eq.summary}</p>
            <h3>Qué significa</h3>
            <p>${eq.meaning}</p>
          </article>
        </section>

        <section class="detail-panel" data-panel="variables" role="tabpanel" hidden>
          <article class="detail-copy-card full">
            <h3>Variables y símbolos</h3>
            <ul class="variable-list clean-list">${eq.variables.map(v => `<li>${v}</li>`).join("")}</ul>
          </article>
        </section>

        <section class="detail-panel" data-panel="context" role="tabpanel" hidden>
          <article class="detail-copy-card">
            <h3>Historia</h3>
            <p>${eq.history}</p>
          </article>
          <article class="detail-copy-card">
            <h3>Derivación simplificada</h3>
            <p>${eq.derivation}</p>
          </article>
        </section>

        <section class="detail-panel" data-panel="uses" role="tabpanel" hidden>
          <article class="detail-copy-card full">
            <h3>Casos de uso</h3>
            <ul class="variable-list clean-list use-list">${eq.uses.map(v => `<li>${v}</li>`).join("")}</ul>
          </article>
        </section>

        <section class="detail-panel" data-panel="simulation" role="tabpanel" hidden>
          <article class="simulation-panel detail-simulation">
            <h3>Simulación conceptual</h3>
            <canvas id="simulationCanvas"></canvas>
            <div class="sim-controls" id="simulationControls"></div>
          </article>
        </section>
      </div>
    </section>
  `;

  modal.showModal();
  bindDetailTabs(content, eq);
  requestMathTypeset();
}

function bindDetailTabs(content, eq) {
  const buttons = [...content.querySelectorAll(".detail-tabs button")];
  const panels = [...content.querySelectorAll(".detail-panel")];

  function activate(tab) {
    buttons.forEach(button => {
      const active = button.dataset.tab === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    panels.forEach(panel => {
      const active = panel.dataset.panel === tab;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
    if (tab === "simulation" && !disposeSimulation) {
      disposeSimulation = mountSimulation(eq.simulation, $("#simulationCanvas"), $("#simulationControls"));
    }
    requestMathTypeset();
  }

  buttons.forEach(button => button.addEventListener("click", () => activate(button.dataset.tab)));
}

export function closeEquationModal() {
  if (disposeSimulation) disposeSimulation();
  disposeSimulation = null;
  $("#equationModal").close();
}
