const ADMIN_TOOLS_ID = "catalogAdminTools";
const CATALOG_DIALOG_ID = "catalogDialog";
const PROMPT_DIALOG_ID = "formulaPromptDialog";

let equations = window.FormulasAtlas?.equations || [];

window.addEventListener("formulas:catalog-ready", event => {
  equations = event.detail?.equations || [];
});

document.addEventListener("DOMContentLoaded", () => {
  installHiddenTools();
  createDialogs();
});

function installHiddenTools() {
  const filterToggle = document.querySelector("#filterToggle");
  const filterPanel = document.querySelector("#filterPanel");
  if (!filterToggle || !filterPanel) return;

  filterToggle.addEventListener("click", event => {
    if (!event.altKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    filterPanel.hidden = false;
    filterToggle.setAttribute("aria-expanded", "true");
    const tools = ensureAdminTools(filterPanel);
    tools.hidden = !tools.hidden;
  }, true);
}

function ensureAdminTools(filterPanel) {
  let tools = filterPanel.querySelector(`#${ADMIN_TOOLS_ID}`);
  if (tools) return tools;
  tools = document.createElement("section");
  tools.id = ADMIN_TOOLS_ID;
  tools.className = "catalog-admin-tools";
  tools.hidden = true;
  tools.innerHTML = `
    <strong>Herramientas avanzadas</strong>
    <button type="button" data-admin-action="catalog">Catálogo</button>
    <button type="button" data-admin-action="validator">Validador LaTeX</button>
    <button type="button" data-admin-action="prompt">Superprompt</button>
  `;
  tools.addEventListener("click", event => {
    const action = event.target.closest("button")?.dataset.adminAction;
    if (action === "catalog") openCatalogDialog("inventory");
    if (action === "validator") openCatalogDialog("validator");
    if (action === "prompt") openPromptDialog();
  });
  filterPanel.appendChild(tools);
  return tools;
}

function createDialogs() {
  if (!document.querySelector(`#${CATALOG_DIALOG_ID}`)) {
    const dialog = document.createElement("dialog");
    dialog.id = CATALOG_DIALOG_ID;
    dialog.className = "catalog-dialog";
    document.body.appendChild(dialog);
  }
  if (!document.querySelector(`#${PROMPT_DIALOG_ID}`)) {
    const dialog = document.createElement("dialog");
    dialog.id = PROMPT_DIALOG_ID;
    dialog.className = "catalog-dialog prompt-dialog";
    document.body.appendChild(dialog);
  }
}

function openCatalogDialog(mode = "inventory") {
  const dialog = document.querySelector(`#${CATALOG_DIALOG_ID}`);
  const rows = buildInventoryRows(getEquations());
  const validation = rows.map(row => ({ ...row, issues: validateRow(row) }));
  const fields = countBy(rows, "field");
  const levels = countBy(rows, "level");
  const complete = validation.filter(row => row.completeness === "Completa").length;
  const withSim = rows.filter(row => row.hasSimulation).length;
  const withProblems = validation.filter(row => row.issues.length).length;

  dialog.innerHTML = `
    <article class="catalog-page">
      <header class="catalog-header">
        <div>
          <span>Inventario técnico</span>
          <h2>Catálogo de fórmulas</h2>
        </div>
        <button type="button" class="catalog-close" aria-label="Cerrar">×</button>
      </header>
      <nav class="catalog-tabs" aria-label="Vistas de catálogo">
        <button type="button" data-catalog-tab="inventory" class="${mode === "inventory" ? "active" : ""}">Inventario</button>
        <button type="button" data-catalog-tab="coverage" class="${mode === "coverage" ? "active" : ""}">Cobertura</button>
        <button type="button" data-catalog-tab="validator" class="${mode === "validator" ? "active" : ""}">Validador</button>
      </nav>
      <section class="catalog-actions">
        <input type="search" placeholder="Filtrar catálogo por nombre, área, nivel, etiqueta o símbolo…" data-catalog-search>
        <button type="button" data-download="csv">Descargar CSV</button>
        <button type="button" data-download="json">Descargar JSON</button>
      </section>
      <section class="catalog-summary">
        <article><strong>${rows.length}</strong><span>fórmulas</span></article>
        <article><strong>${fields.size}</strong><span>áreas</span></article>
        <article><strong>${levels.size}</strong><span>niveles</span></article>
        <article><strong>${withSim}</strong><span>simuladores</span></article>
        <article><strong>${complete}</strong><span>completas</span></article>
        <article class="${withProblems ? "warn" : "ok"}"><strong>${withProblems}</strong><span>avisos</span></article>
      </section>
      <section data-view="inventory" class="catalog-view ${mode === "inventory" ? "active" : ""}">${inventoryTable(rows)}</section>
      <section data-view="coverage" class="catalog-view ${mode === "coverage" ? "active" : ""}">${coverageView(rows, fields, levels)}</section>
      <section data-view="validator" class="catalog-view ${mode === "validator" ? "active" : ""}">${validatorTable(validation)}</section>
    </article>`;

  bindCatalogDialog(dialog, rows, validation);
  dialog.showModal();
}

function bindCatalogDialog(dialog, rows, validation) {
  dialog.querySelector(".catalog-close")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); }, { once: true });
  dialog.querySelectorAll("[data-catalog-tab]").forEach(button => {
    button.addEventListener("click", () => {
      dialog.querySelectorAll("[data-catalog-tab]").forEach(item => item.classList.toggle("active", item === button));
      dialog.querySelectorAll("[data-view]").forEach(view => view.classList.toggle("active", view.dataset.view === button.dataset.catalogTab));
    });
  });
  dialog.querySelector("[data-catalog-search]")?.addEventListener("input", event => {
    const query = normalize(event.target.value);
    dialog.querySelectorAll("tbody tr[data-index]").forEach(row => {
      row.hidden = query && !normalize(row.textContent).includes(query);
    });
  });
  dialog.querySelector("[data-download='csv']")?.addEventListener("click", () => downloadCsv(rows));
  dialog.querySelector("[data-download='json']")?.addEventListener("click", () => downloadJson(rows, validation));
}

function buildInventoryRows(items) {
  return items.map(eq => {
    const sections = Array.isArray(eq.sections) ? eq.sections : [];
    const sectionKeys = sections.map(section => section.key);
    return {
      id: eq.id,
      name: eq.name,
      author: eq.author || "",
      year: eq.year ?? "",
      field: eq.field || "Sin área",
      level: eq.level || "Sin nivel",
      folder: eq.folder || "",
      formulas: (eq.formula || []).join(" | "),
      formulaCount: (eq.formula || []).length,
      tags: (eq.tags || []).join(", "),
      symbols: (eq.symbols || []).join(", "),
      prerequisites: (eq.prerequisites || []).join("; "),
      learningPath: (eq.learningPath || []).join("; "),
      units: eq.units || "",
      dimensions: eq.dimensions || "",
      hasFormula: sectionKeys.includes("formula"),
      hasMeaning: sectionKeys.includes("significado"),
      hasHistory: sectionKeys.includes("historia"),
      hasDerivation: sectionKeys.includes("derivacion"),
      hasUses: sectionKeys.includes("usos"),
      hasSheet: sectionKeys.includes("ficha"),
      hasLearning: sectionKeys.includes("aprendizaje"),
      hasUnits: sectionKeys.includes("unidades"),
      hasSolver: sectionKeys.includes("despejar"),
      hasSimulation: sectionKeys.includes("simulacion"),
      completeness: requiredSectionsPresent(sectionKeys) ? "Completa" : "Incompleta"
    };
  });
}

function requiredSectionsPresent(keys) {
  return ["formula", "significado", "historia", "derivacion", "usos", "ficha", "aprendizaje", "unidades"].every(key => keys.includes(key));
}

function validateRow(row) {
  const issues = [];
  if (!row.id || !row.folder) issues.push("sin id/carpeta");
  if (!row.hasFormula || !row.formulaCount) issues.push("sin fórmula");
  if (row.completeness !== "Completa") issues.push("secciones incompletas");
  for (const formula of row.formulas.split(" | ").filter(Boolean)) {
    if (!balanced(formula, "{", "}")) issues.push("llaves desbalanceadas");
    if (!balanced(formula, "(", ")")) issues.push("paréntesis visualmente sospechosos");
    const left = (formula.match(/\\left/g) || []).length;
    const right = (formula.match(/\\right/g) || []).length;
    if (left !== right) issues.push("left/right desbalanceados");
    if (/\\right(?![\s.()\[\]{}|\\])/.test(formula)) issues.push("right sin delimitador reconocido");
  }
  return [...new Set(issues)];
}

function balanced(text, open, close) {
  let depth = 0;
  for (const char of text) {
    if (char === open) depth += 1;
    if (char === close) depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
}

function inventoryTable(rows) {
  return `<div class="catalog-table-wrap"><table class="catalog-table">
    <thead><tr><th>Nombre</th><th>Área</th><th>Nivel</th><th>Año</th><th>Fórmulas</th><th>Sim.</th><th>Estado</th><th>Etiquetas</th></tr></thead>
    <tbody>${rows.map((row, index) => `<tr data-index="${index}"><td><strong>${esc(row.name)}</strong><small>${esc(row.id)}</small></td><td>${esc(row.field)}</td><td>${esc(row.level)}</td><td>${esc(row.year)}</td><td>${row.formulaCount}</td><td>${row.hasSimulation ? "Sí" : "No"}</td><td>${esc(row.completeness)}</td><td>${esc(row.tags)}</td></tr>`).join("")}</tbody>
  </table></div>`;
}

function validatorTable(rows) {
  return `<div class="catalog-table-wrap"><table class="catalog-table">
    <thead><tr><th>Nombre</th><th>Carpeta</th><th>Fórmulas</th><th>Avisos</th></tr></thead>
    <tbody>${rows.map((row, index) => `<tr data-index="${index}" class="${row.issues.length ? "has-warning" : "is-ok"}"><td><strong>${esc(row.name)}</strong></td><td><code>${esc(row.folder)}</code></td><td>${row.formulaCount}</td><td>${row.issues.length ? esc(row.issues.join(", ")) : "OK"}</td></tr>`).join("")}</tbody>
  </table></div>`;
}

function coverageView(rows, fields, levels) {
  return `
    <div class="coverage-grid">
      <section><h3>Cobertura por disciplina</h3>${barList([...fields.entries()].sort((a, b) => b[1] - a[1]), rows.length)}</section>
      <section><h3>Cobertura por nivel</h3>${barList([...levels.entries()].sort((a, b) => b[1] - a[1]), rows.length)}</section>
    </div>`;
}

function barList(entries, total) {
  return `<div class="coverage-bars">${entries.map(([label, count]) => `<div class="coverage-row"><span>${esc(label)}</span><b>${count}</b><i style="--w:${Math.max(3, Math.round((count / Math.max(total, 1)) * 100))}%"></i></div>`).join("")}</div>`;
}

function countBy(rows, key) {
  const map = new Map();
  rows.forEach(row => map.set(row[key] || "Sin dato", (map.get(row[key] || "Sin dato") || 0) + 1));
  return map;
}

function downloadCsv(rows) {
  const columns = ["id", "name", "author", "year", "field", "level", "folder", "formulaCount", "hasSimulation", "completeness", "tags", "symbols", "prerequisites", "learningPath", "units", "dimensions", "formulas"];
  const csv = [columns.join(";"), ...rows.map(row => columns.map(column => csvCell(row[column])).join(";"))].join("\n");
  downloadBlob(csv, "catalogo-formulas.csv", "text/csv;charset=utf-8");
}

function downloadJson(rows, validation) {
  downloadBlob(JSON.stringify({ generatedAt: new Date().toISOString(), formulas: rows, validation }, null, 2), "catalogo-formulas.json", "application/json;charset=utf-8");
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function downloadBlob(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function openPromptDialog() {
  const dialog = document.querySelector(`#${PROMPT_DIALOG_ID}`);
  const prompt = superPromptText();
  dialog.innerHTML = `
    <article class="catalog-page">
      <header class="catalog-header"><div><span>Guía transferible</span><h2>Superprompt para añadir fórmulas</h2></div><button type="button" class="catalog-close" aria-label="Cerrar">×</button></header>
      <section class="catalog-actions"><button type="button" data-copy-prompt>Copiar</button><button type="button" data-download-prompt>Descargar TXT</button></section>
      <textarea class="superprompt-box" spellcheck="false">${esc(prompt)}</textarea>
    </article>`;
  dialog.querySelector(".catalog-close")?.addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-copy-prompt]")?.addEventListener("click", () => navigator.clipboard?.writeText(prompt));
  dialog.querySelector("[data-download-prompt]")?.addEventListener("click", () => downloadBlob(prompt, "superprompt-nueva-formula.txt", "text/plain;charset=utf-8"));
  dialog.showModal();
}

function superPromptText() {
  return `Actúa como desarrollador y editor científico del proyecto "Atlas de Ecuaciones Famosas". El repositorio usa una arquitectura moderna basada exclusivamente en la carpeta formulas/. No uses la antigua carpeta data/. Cada fórmula vive en una carpeta propia: formulas/<formula-id>/.

Objetivo: añadir o migrar una nueva fórmula, ecuación, identidad, modelo o ficha científica al sistema moderno. Puede que te entregue solo el nombre de la fórmula, contenido parcial, o un HTML con JavaScript que ya contiene un widget/simulador. Debes analizarlo, mejorarlo y adaptarlo al sistema del atlas.

Estructura obligatoria por fórmula:
formulas/<formula-id>/
- meta.json
- formula.tex
- significado.md
- historia.md
- derivacion.md
- usos.md
- ficha.md
- simulacion/index.js
- simulacion/styles.css

El loader escanea los catálogos formulas/catalog*.json y las carpetas indicadas. Cada archivo .md o .tex adicional en la raíz de la carpeta puede convertirse en una pestaña extra. Las pestañas estándar son: Fórmula, Significado, Historia, Derivación, Usos, Ficha, Aprendizaje, Unidades, Despejar y Simulación. Aprendizaje integra prerrequisitos y ruta de aprendizaje. Unidades integra unidades habituales, dimensionalidad y símbolos detectados.

meta.json debe incluir como mínimo: id, name, author, year, field, level, color, simulation, formulaText y summary. Usa niveles normalizados: ESO, Bachillerato, Universidad inicial, Universidad o Avanzado. Añade tags si procede: área, técnica, disciplina, tipo de modelo, uso educativo y conceptos clave.

formula.tex debe contener la fórmula simbólica en LaTeX, una o varias líneas separadas por líneas en blanco. Evita errores de MathJax: no uses \left o \right si no son imprescindibles; si los usas, deben estar perfectamente emparejados. Comprueba llaves, paréntesis y corchetes. Para fórmulas con paréntesis exteriores, usa paréntesis literales normales cuando sea suficiente. No incrustes palabras largas dentro de subíndices si puede usarse una letra estándar; por ejemplo, usa c para clase correcta en vez de "correcta".

formulaText debe ser la versión explicada o semiverbalizada de la fórmula. La interfaz tiene dos modos: fórmula simbólica y fórmula explicada. La simbólica se renderiza con MathJax. La explicada debe ser legible para estudiantes y no depender de LaTeX complejo.

significado.md debe explicar qué dice la fórmula, cómo se interpreta y qué intuición física, matemática, estadística o computacional transmite.

historia.md debe explicar contexto histórico, autores, año aproximado, problema que resolvía, impacto y evolución.

derivacion.md debe incluir una derivación razonable al nivel de la ficha. Si la derivación completa es demasiado avanzada, resume el camino conceptual y aclara los supuestos.

usos.md debe enumerar aplicaciones reales: educación, laboratorio, ingeniería, investigación, informática, economía, biología o el campo que corresponda.

ficha.md debe incluir identificación, variables, lectura del simulador, notas de validez, limitaciones y recomendaciones didácticas.

Simulador: si te paso un HTML con JavaScript, debes analizar el widget original, conservar la idea central, corregir errores, eliminar código global frágil y migrarlo a simulacion/index.js. El módulo debe exportar una función de montaje por defecto o nombrada. Recibirá un objeto con root, canvas, controls y readout. Debe crear controles claros, dibujar en canvas si procede, actualizar readout, y devolver una función de limpieza si usa intervalos, requestAnimationFrame o listeners persistentes. simulacion/styles.css debe contener estilos locales si hacen falta.

Catálogo: añade o actualiza la entrada en el catálogo correspondiente dentro de formulas/catalog*.json si el generador automático aún no la incorpora. La entrada debe apuntar a folder: "formulas/<formula-id>" y simulation: "<formula-id>" cuando exista simulador. Evita duplicados por nombre o por id.

Validación antes de terminar: comprueba que no hay referencias a data/. Comprueba que formula.tex existe. Comprueba que las secciones estándar existen. Comprueba que las fórmulas no tienen llaves/paréntesis desbalanceados. Comprueba que el simulador exporta una función de montaje. Comprueba que el nombre, id, field, level y tags son coherentes.

Resultado esperado: crea los archivos completos, mejora el simulador si existe, añade metadatos, fórmula simbólica, fórmula explicada, significado, historia, derivación, usos, ficha, unidades/prerrequisitos si procede, y deja la fórmula integrada en el atlas sin duplicar fichas antiguas.`;
}

function getEquations() {
  return equations.length ? equations : (window.FormulasAtlas?.equations || []);
}

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
