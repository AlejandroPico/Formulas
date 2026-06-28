import { requestMathTypeset } from "./utils.js";
import { state } from "./state.js";

let closeCleanup = null;

export function renderEquationGrid(equations, onOpen, viewState = {}) {
  const grid = document.querySelector("#equationGrid");
  const template = document.querySelector("#equationCardTemplate");
  grid.innerHTML = "";
  if (!equations.length) {
    grid.innerHTML = '<div class="empty-state">No hay ecuaciones que coincidan con los filtros actuales.</div>';
    return;
  }
  equations.forEach(eq => {
    const display = getDisplayFormula(eq, viewState.formulaDisplay || "symbolic");
    const card = template.content.firstElementChild.cloneNode(true);
    const widthLevel = getWidthLevel(display.formulas);
    card.classList.add(`size-${widthLevel}`);
    card.classList.toggle("is-multiline", display.formulas.length > 1);
    card.classList.toggle("formula-explained-mode", display.mode === "explained");
    card.dataset.minColSpan = String(getColumnSpan(widthLevel));
    card.style.setProperty("--formula-lines", display.formulas.length || 1);
    card.style.setProperty("--col-span", getColumnSpan(widthLevel));
    card.style.setProperty("--context-color", contextColor(eq, viewState.cardLabelMode));
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Abrir ficha de ${eq.name}`);
    card.querySelector("h3").innerHTML = cardTitle(eq, viewState.cardLabelMode);
    card.querySelector(".formula-box").innerHTML = renderFormulaDisplay(display);
    card.addEventListener("click", () => onOpen(eq));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen(eq);
      }
    });
    grid.appendChild(card);
  });
  requestMathTypeset();
  scheduleMasonry(grid);
}

export function openEquationModal(eq) {
  const modal = document.querySelector("#equationModal");
  const content = document.querySelector("#modalContent");
  if (closeCleanup) closeCleanup();
  closeCleanup = null;
  const sections = sectionsFor(eq);
  const firstKey = sections[0]?.key || "ficha";
  content.innerHTML = `
    <section class="detail-shell" style="--equation-color:${escapeHtml(eq.color || "#5d5af6")}">
      <header class="detail-header compact"><h2>${escapeHtml(eq.name)}</h2></header>
      <nav class="detail-tabs" aria-label="Secciones de la ficha">
        ${sections.map((section, index) => `<button class="${index === 0 ? "active" : ""}" data-target="${escapeHtml(section.key)}" type="button">${escapeHtml(section.label)}</button>`).join("")}
      </nav>
      <div class="detail-panels">
        ${sections.map((section, index) => panelHtml(section, eq, index === 0)).join("")}
      </div>
    </section>`;
  content.querySelectorAll(".detail-tabs button").forEach(button => {
    button.addEventListener("click", () => activate(content, button.dataset.target));
  });
  modal.showModal();
  activate(content, firstKey);
  requestMathTypeset();
}

export function closeEquationModal() {
  if (closeCleanup) closeCleanup();
  closeCleanup = null;
  document.querySelector("#equationModal").close();
}

function activate(root, key) {
  root.querySelectorAll(".detail-tabs button").forEach(button => button.classList.toggle("active", button.dataset.target === key));
  root.querySelectorAll(".detail-panel").forEach(panel => {
    const active = panel.dataset.panel === key;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });
  const panel = root.querySelector(`.detail-panel[data-panel="${cssEscape(key)}"]`);
  if (!panel) return;
  if (panel.dataset.kind === "markdown" && panel.dataset.loaded !== "true") loadMarkdown(panel);
  if (panel.dataset.kind === "simulation") mountDynamicSimulation(panel);
  if (panel.dataset.kind === "formula") requestMathTypeset();
}

async function mountDynamicSimulation(panel) {
  const modulePath = panel.dataset.module;
  if (!modulePath || panel.dataset.mounted === "true") return;
  panel.dataset.mounted = "true";
  const host = panel.querySelector(".formula-plugin-host");
  const stylePath = panel.dataset.style;
  if (stylePath) loadStyle(stylePath);
  try {
    const module = await import(new URL(`../${modulePath}`, import.meta.url).href);
    const mount = module.default || module.mountSimulation || Object.values(module).find(value => typeof value === "function");
    if (!mount) throw new Error("El módulo no exporta una función de montaje.");
    const cleanup = mount({
      root: host,
      canvas: host.querySelector("canvas"),
      controls: host.querySelector(".formula-plugin-controls"),
      readout: host.querySelector(".formula-plugin-readout")
    });
    closeCleanup = cleanup;
  } catch (error) {
    host.innerHTML = `<div class="formula-plugin-error"><strong>No se pudo cargar la simulación.</strong><span>${escapeHtml(error.message || String(error))}</span></div>`;
  }
}

async function loadMarkdown(panel) {
  panel.dataset.loaded = "loading";
  const box = panel.querySelector(".markdown-view");
  try {
    const response = await fetch(encodePath(panel.dataset.path), { cache: "no-cache" });
    if (!response.ok) throw new Error(panel.dataset.path);
    const text = await response.text();
    box.innerHTML = renderMarkdown(text);
    panel.dataset.loaded = "true";
  } catch (error) {
    box.innerHTML = '<p class="section-loading">No se pudo cargar esta sección.</p>';
    panel.dataset.loaded = "error";
  }
}

function sectionsFor(eq) {
  if (Array.isArray(eq.sections) && eq.sections.length) {
    return eq.sections.filter(section => {
      if (section.type === "simulation") return Boolean(section.path);
      if (section.type === "formula") return Boolean(section.path || eq.formula?.length || section.content);
      return Boolean(section.path || section.content);
    });
  }
  const sections = [];
  if (eq.formula?.length) sections.push({ key: "formula", label: "Fórmula", type: "formula" });
  if (eq.meaning) sections.push({ key: "meaning", label: "Significado", type: "text", content: eq.meaning });
  if (eq.history) sections.push({ key: "history", label: "Historia", type: "text", content: eq.history });
  if (eq.derivation) sections.push({ key: "derivation", label: "Derivación", type: "text", content: eq.derivation });
  if (eq.uses?.length) sections.push({ key: "uses", label: "Usos", type: "uses", content: eq.uses });
  return sections;
}

function panelHtml(section, eq, active) {
  const hidden = active ? "" : " hidden";
  const cls = `detail-panel ${section.type === "simulation" ? "simulation-view" : section.type === "formula" ? "formula-view" : "text-view"}${active ? " active" : ""}`;
  if (section.type === "formula") {
    return `<section class="${cls}" data-panel="${escapeHtml(section.key)}" data-kind="formula"${hidden}><div class="formula-box modal-formula">${renderFormulaDisplay(getDisplayFormula(eq, state.formulaDisplay))}</div></section>`;
  }
  if (section.type === "simulation") {
    return `<section class="${cls}" data-panel="${escapeHtml(section.key)}" data-kind="simulation" data-module="${escapeHtml(eq.simulationModule || section.path || "")}" data-style="${escapeHtml(eq.simulationStylePath || section.stylePath || "")}"${hidden}><section class="formula-plugin-host"><canvas class="formula-plugin-canvas" aria-label="Simulación interactiva"></canvas><div class="formula-plugin-controls"></div><div class="formula-plugin-readout" aria-live="polite"></div></section></section>`;
  }
  if (section.type === "markdown") {
    const loaded = section.content ? "true" : "false";
    const body = section.content ? renderMarkdown(section.content) : '<p class="section-loading">Cargando sección...</p>';
    return `<section class="${cls}" data-panel="${escapeHtml(section.key)}" data-kind="markdown" data-path="${escapeHtml(section.path || "")}" data-loaded="${loaded}"${hidden}><div class="markdown-view">${body}</div></section>`;
  }
  if (section.type === "uses") return `<section class="${cls}" data-panel="${escapeHtml(section.key)}"${hidden}>${section.content.map(use => `<span>${escapeHtml(use)}</span>`).join("")}</section>`;
  return `<section class="${cls}" data-panel="${escapeHtml(section.key)}"${hidden}><p>${escapeHtml(section.content || "")}</p></section>`;
}

function getDisplayFormula(eq, mode) {
  const symbolic = asList(eq.formula);
  const explained = asList(eq.formulaText || eq.formula_text || eq.explainedFormula);
  if (mode === "explained") return { mode: "explained", formulas: explained.length ? explained : symbolic.map(verbalize) };
  return { mode: "symbolic", formulas: symbolic.length ? symbolic : explained };
}

function renderFormulaDisplay(display) {
  if (display.mode === "explained") return display.formulas.map(line => `<div class="formula-words">${escapeHtml(line)}</div>`).join("");
  if (display.formulas.length === 1) return `\\(${display.formulas[0]}\\)`;
  return `<div class="formula-stack">${display.formulas.map(line => `<div>\\(${line}\\)</div>`).join("")}</div>`;
}

function verbalize(formula) {
  return String(formula).replaceAll("=", " es igual a ").replaceAll("+", " más ").replaceAll("-", " menos ").replaceAll("/", " dividido por ").replaceAll("*", " por ").replaceAll("^2", " al cuadrado ").replace(/\s+/g, " ").trim();
}

function renderMarkdown(markdown) {
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let items = [];
  const flush = () => { if (items.length) { html.push(`<ul>${items.map(item => `<li>${inline(item)}</li>`).join("")}</ul>`); items = []; } };
  lines.forEach(raw => {
    const line = raw.trim();
    if (!line) { flush(); return; }
    const h = line.match(/^(#{1,4})\s+(.+)$/);
    if (h) { flush(); html.push(`<h${Math.min(4, h[1].length + 2)}>${inline(h[2])}</h${Math.min(4, h[1].length + 2)}>`); return; }
    if (line.startsWith("- ")) { items.push(line.slice(2)); return; }
    flush(); html.push(`<p>${inline(line)}</p>`);
  });
  flush();
  return html.join("");
}

function inline(text) {
  return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>");
}

function cardTitle(eq, mode) {
  const label = mode === "field" ? eq.field : mode === "level" ? eq.level : mode === "year" ? formatYear(eq.year) : "";
  return `<span class="card-title-name">${escapeHtml(eq.name)}</span>${label ? `<span class="card-context-label is-${escapeHtml(mode)}">${escapeHtml(label)}</span>` : ""}`;
}

function formatYear(year) {
  const value = Number(year);
  if (!Number.isFinite(value)) return "";
  return value < 0 ? `${Math.abs(value)} a. C.` : String(value);
}

function contextColor(eq, mode) {
  const source = mode === "level" ? eq.level : eq.field || eq.name;
  let hash = 0;
  for (const char of String(source)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `hsl(${hash % 360} 78% 48%)`;
}

function getWidthLevel(lines) {
  const length = Math.max(1, ...asList(lines).map(line => String(line).length));
  if (length > 82) return 3;
  if (length > 42) return 2;
  return 1;
}

function getColumnSpan(level) { return { 1: 2, 2: 3, 3: 4 }[level] || 2; }
function asList(value) { return Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []; }
function scheduleMasonry(grid) {
  const run = () => {
    const css = getComputedStyle(grid);
    const row = parseFloat(css.gridAutoRows) || 10;
    const gap = parseFloat(css.rowGap) || 0;
    grid.querySelectorAll(".equation-card").forEach(card => {
      const min = Number(card.dataset.minColSpan || 2);
      const span = Math.max(min, Math.ceil((card.getBoundingClientRect().height + gap) / (row + gap)));
      card.style.gridRowEnd = `span ${span}`;
    });
  };
  setTimeout(run, 80); setTimeout(run, 260); setTimeout(run, 640);
}
function loadStyle(path) {
  const id = `formula-style-${path.replace(/[^a-z0-9_-]+/gi, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id; link.rel = "stylesheet"; link.href = path; document.head.appendChild(link);
}
function encodePath(path) { return String(path).split("/").map(encodeURIComponent).join("/"); }
function cssEscape(value) { return window.CSS?.escape ? CSS.escape(value) : String(value).replace(/"/g, ""); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
