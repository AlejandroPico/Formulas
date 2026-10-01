const ADMIN_TOOLS_ID = "catalogAdminTools";
const CATALOG_DIALOG_ID = "catalogDialog";
const PROMPT_DIALOG_ID = "formulaPromptDialog";
const REQUIRED_SECTION_KEYS = ["formula", "significado", "historia", "derivacion", "usos", "ficha", "aprendizaje", "unidades"];

let equations = window.FormulasAtlas?.equations || [];
let reviews = {};
let reviewLoadError = false;

window.addEventListener("formulas:catalog-ready", event => {
  equations = event.detail?.equations || [];
});
window.addEventListener("formulas:catalog-mutated", () => {
  equations = window.FormulasAtlas?.equations || equations;
});
window.addEventListener("formulas:catalog-normalized", () => {
  equations = window.FormulasAtlas?.equations || equations;
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
    <button type="button" data-admin-action="inventory">Inventario</button>
    <button type="button" data-admin-action="prompt">Superprompt</button>
  `;
  tools.addEventListener("click", event => {
    const action = event.target.closest("button")?.dataset.adminAction;
    if (action === "inventory") openCatalogDialog("inventory");
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

async function openCatalogDialog(mode = "inventory") {
  try {
    const response = await fetch('formulas/revisions.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('No se pudo leer el registro');
    reviews = (await response.json()).reviews || {};
    reviewLoadError = false;
  } catch { reviews = {}; reviewLoadError = true; }
  const dialog = document.querySelector(`#${CATALOG_DIALOG_ID}`);
  const rows = buildInventoryRows(getEquations());
  const validation = rows.map(row => ({ ...row, issues: validateRow(row) }));
  const nameCounts = countBy(rows.map(row => ({ name: normalize(row.name) })), 'name');
  validation.forEach(row => { if (nameCounts.get(normalize(row.name)) > 1) row.issues.push(issue('structure', 'nombre repetido; revisar alcance y duplicados')); });
  const fields = countBy(rows, "field");
  const levels = countBy(rows, "level");
  const complete = validation.filter(row => row.completeness === "Completa").length;
  const withSim = rows.filter(row => row.hasSimulation).length;
  const withProblems = validation.filter(row => row.issues.length).length;
  const latexProblems = validation.filter(row => row.issues.some(issue => issue.kind === "latex")).length;
  const structureProblems = validation.filter(row => row.issues.some(issue => issue.kind === "structure")).length;

  dialog.innerHTML = `
    <article class="catalog-page">
      <header class="catalog-header">
        <div><span>Inventario técnico</span><h2>Catálogo de fórmulas</h2></div>
        <button type="button" class="catalog-close" aria-label="Cerrar">×</button>
      </header>
      <nav class="catalog-tabs" aria-label="Vistas de catálogo">
        <button type="button" data-catalog-tab="inventory" class="${mode === "inventory" ? "active" : ""}">Inventario</button>
        <button type="button" data-catalog-tab="coverage" class="${mode === "coverage" ? "active" : ""}">Cobertura</button>
        <button type="button" data-catalog-tab="validator" class="${mode === "validator" ? "active" : ""}">Validador</button>
        <button type="button" data-catalog-tab="reviews" class="${mode === "reviews" ? "active" : ""}">Revisiones <small>${rows.filter(row => row.revision).length} / ${rows.length}</small></button>
      </nav>
      <section class="catalog-actions">
        <input type="search" aria-label="Buscar en el catálogo" placeholder="Nombre, área, nivel o símbolo…" data-catalog-search>
        <select data-review-filter aria-label="Estado de revisión"><option value="all">Todas las revisiones</option><option value="pending">Pendientes</option><option value="reviewed">Revisadas</option></select>
        <button type="button" data-download="csv">Descargar CSV</button>
        <button type="button" data-download="json">Descargar JSON</button>
        <button type="button" data-download="excel">Descargar Excel</button>
      </section>
      <section class="catalog-summary">
        <article><strong>${rows.length}</strong><span>fórmulas</span></article>
        <article><strong>${fields.size}</strong><span>áreas</span></article>
        <article><strong>${levels.size}</strong><span>niveles</span></article>
        <article><strong>${withSim}</strong><span>simuladores</span></article>
        <article><strong>${complete}</strong><span>completas</span></article>
        <article class="${withProblems ? "warn" : "ok"}"><strong>${withProblems}</strong><span>con avisos</span></article>
        <article class="${latexProblems ? "warn" : "ok"}"><strong>${latexProblems}</strong><span>LaTeX</span></article>
        <article class="${structureProblems ? "warn" : "ok"}"><strong>${structureProblems}</strong><span>estructura</span></article>
      </section>
      <section data-view="inventory" class="catalog-view ${mode === "inventory" ? "active" : ""}">${inventoryTable(rows)}</section>
      <section data-view="coverage" class="catalog-view ${mode === "coverage" ? "active" : ""}">${coverageView(rows, fields, levels)}</section>
      <section data-view="validator" class="catalog-view ${mode === "validator" ? "active" : ""}"><p class="catalog-note">Comprueba metadatos, secciones declaradas, duplicados y delimitadores. Un resultado técnico correcto no equivale a una revisión científica completa ni verifica la ejecución del simulador.</p>${validatorTable(validation)}</section>
      <section data-view="reviews" class="catalog-view ${mode === "reviews" ? "active" : ""}">${reviewsTable(rows)}</section>
    </article>`;

  bindCatalogDialog(dialog, rows, validation);
  if (!dialog.open) dialog.showModal();
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
  const filterRows = () => {
    const query = normalize(dialog.querySelector('[data-catalog-search]').value);
    const status = dialog.querySelector('[data-review-filter]').value;
    dialog.querySelectorAll("tbody tr[data-index]").forEach(row => {
      const entry = rows[Number(row.dataset.index)];
      const haystack = [entry.name, entry.field, entry.level, entry.tags, entry.symbols, row.textContent].join(' ');
      row.hidden = Boolean(query && !normalize(haystack).includes(query)) || (status === 'pending' && entry.revision > 0) || (status === 'reviewed' && !entry.revision);
    });
  };
  dialog.querySelector('[data-catalog-search]').addEventListener('input', filterRows);
  dialog.querySelector('[data-review-filter]').addEventListener('change', filterRows);
  dialog.querySelectorAll('[data-open-formula]').forEach(button => button.addEventListener('click', async () => {
    const eq = getEquations().find(item => item.id === button.dataset.openFormula);
    if (!eq) return;
    dialog.close();
    const { openEquationModal } = await import('./render-dynamic.js');
    openEquationModal(eq);
  }));
  dialog.querySelector("[data-download='csv']")?.addEventListener("click", () => downloadCsv(rows));
  dialog.querySelector("[data-download='json']")?.addEventListener("click", () => downloadJson(rows, validation));
  dialog.querySelector("[data-download='excel']")?.addEventListener("click", () => downloadExcel(rows, validation));
}

function buildInventoryRows(items) {
  return items.map(eq => {
    const history = reviews[eq.id] || [];
    const latest = history.at(-1);
    const sections = Array.isArray(eq.sections) ? eq.sections : [];
    const sectionKeys = [...new Set(sections.map(section => section?.key).filter(Boolean))];
    const formulaList = Array.isArray(eq.formula) ? eq.formula.map(value => String(value).trim()).filter(Boolean) : [];
    const missingSections = REQUIRED_SECTION_KEYS.filter(key => !sectionKeys.includes(key));
    return {
      id: eq.id || "",
      name: eq.name || eq.id || "Sin nombre",
      author: eq.author || "",
      year: eq.year ?? "",
      field: eq.field || "Sin área",
      level: eq.level || "Sin nivel",
      folder: eq.folder || "",
      createdAt: eq.createdAt || '',
      revision: latest?.revision || 0,
      reviewedAt: latest?.date || '',
      simulatorVersion: latest?.simulatorVersion || '',
      reviewSummary: latest?.summary || '',
      reviewScope: latest?.scope?.join(', ') || '',
      reviewHistory: history,
      formulaList,
      formulas: formulaList.join(" ⟐ "),
      formulaCount: formulaList.length,
      tags: (eq.tags || []).join(", "),
      symbols: (eq.symbols || []).join(", "),
      prerequisites: (eq.prerequisites || []).join("; "),
      learningPath: (eq.learningPath || []).join("; "),
      units: eq.units || "",
      dimensions: eq.dimensions || "",
      sectionKeys,
      missingSections,
      hasSimulation: sectionKeys.includes("simulacion"),
      completeness: missingSections.length ? "Incompleta" : "Completa"
    };
  });
}

function validateRow(row) {
  const issues = [];
  if (!row.id) issues.push(issue("structure", "sin id"));
  if (!row.folder) issues.push(issue("structure", "sin carpeta"));
  if (!row.name) issues.push(issue("structure", "sin nombre"));
  if (!row.field || row.field === "Sin área") issues.push(issue("structure", "sin área"));
  if (!row.level || row.level === "Sin nivel") issues.push(issue("structure", "sin nivel"));
  if (!row.formulaCount) issues.push(issue("latex", "sin fórmula"));
  if (row.missingSections.length) issues.push(issue("structure", `faltan: ${row.missingSections.join(", ")}`));

  row.formulaList.forEach((formula, index) => {
    const prefix = row.formulaList.length > 1 ? `fórmula ${index + 1}: ` : "";
    if (/^ok$|\bequals\b|\bprime equals\b/i.test(formula)) issues.push(issue('latex', `${prefix}texto provisional; falta expresión simbólica`));
    if (!balanced(formula, "{", "}")) issues.push(issue("latex", `${prefix}llaves desbalanceadas`));
    if (!balanced(stripLatexCommandsForDelimiterCheck(formula), "(", ")")) issues.push(issue("latex", `${prefix}paréntesis desbalanceados`));
    if (!balanced(stripLatexCommandsForDelimiterCheck(formula), "[", "]")) issues.push(issue("latex", `${prefix}corchetes desbalanceados`));
    const left = countLatexDelimiterCommand(formula, "left");
    const right = countLatexDelimiterCommand(formula, "right");
    if (left !== right) issues.push(issue("latex", `${prefix}left/right desbalanceados`));
    if (/\\right(?![A-Za-z\s.()\[\]{}|\\])/u.test(formula)) issues.push(issue("latex", `${prefix}right sin delimitador reconocido`));
    const begins = [...formula.matchAll(/\\begin\{([^{}]+)\}/g)].map(match => match[1]);
    const ends = [...formula.matchAll(/\\end\{([^{}]+)\}/g)].map(match => match[1]);
    if (begins.join("|") !== ends.join("|")) issues.push(issue("latex", `${prefix}entorno begin/end desbalanceado`));
  });

  return dedupeIssues(issues);
}

function issue(kind, message) {
  return { kind, message };
}

function dedupeIssues(issues) {
  const seen = new Set();
  return issues.filter(item => {
    const key = `${item.kind}:${item.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function stripLatexCommandsForDelimiterCheck(value) {
  return String(value)
    .replace(/\\(?:rightarrow|leftarrow|leftrightarrow|Rightarrow|Leftarrow|Leftrightarrow)/g, "")
    .replace(/\\(?:left|right)(?=[\s.()\[\]{}|\\])/g, "")
    .replace(/\\text\{[^{}]*\}/g, "")
    .replace(/\\operatorname\{[^{}]*\}/g, "");
}

function countLatexDelimiterCommand(value, command) {
  return (String(value).match(new RegExp(`\\\\${command}(?![A-Za-z])`, "g")) || []).length;
}

function balanced(text, open, close) {
  let depth = 0;
  for (const char of String(text)) {
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
    <thead><tr><th>Nombre</th><th>Carpeta</th><th>Fórmulas</th><th>Resultado técnico</th><th>Revisión completa</th><th>Simulador</th></tr></thead>
    <tbody>${rows.map((row, index) => {
      const result = row.issues.length
        ? row.issues.map(item => `<span class="validator-issue is-${item.kind}">${esc(item.message)}</span>`).join(" ")
        : "OK";
      return `<tr data-index="${index}" class="${row.issues.length ? "has-warning" : "is-ok"}"><td><strong>${esc(row.name)}</strong></td><td><code>${esc(row.folder)}</code></td><td>${row.formulaCount}</td><td>${result}</td><td>${reviewStatus(row)}</td><td>${row.simulatorVersion ? `v${esc(row.simulatorVersion)} · ${formatDate(row.reviewedAt)}` : 'Pendiente de revisión'}</td></tr>`;
    }).join("")}</tbody>
  </table></div>`;
}

function reviewStatus(row) {
  if (reviewLoadError) return '<span class="review-pending">Registro no disponible</span>';
  return `<span class="${row.revision ? 'review-done' : 'review-pending'}">${row.revision ? `✓ Revisada · r${esc(row.revision)}` : '○ Pendiente'}</span>`;
}
function formatDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || '') ? new Date(`${value}T12:00:00`).toLocaleDateString('es-ES') : 'Sin constancia';
}
function reviewsTable(rows) {
  return `<p class="catalog-note">${reviewLoadError ? 'No se pudo cargar el registro de revisiones. Vuelve a abrir el catálogo para reintentar.' : 'Una revisión completa incluye todas las pestañas, los símbolos y el simulador. La fecha de creación corresponde a su primera incorporación en Git; el año histórico aparece en Inventario.'}</p>
    <div class="catalog-table-wrap"><table class="catalog-table"><thead><tr><th>Fórmula</th><th>Creación</th><th>Estado</th><th>Última revisión</th><th>Simulador</th><th>Historial</th></tr></thead><tbody>${rows.map((row, index) => `<tr data-index="${index}"><td><button class="catalog-formula-link" data-open-formula="${esc(row.id)}">${esc(row.name)}</button><small>${esc(row.field)}</small></td><td>${formatDate(row.createdAt)}</td><td>${reviewStatus(row)}</td><td>${row.reviewedAt ? formatDate(row.reviewedAt) : '—'}</td><td>${row.simulatorVersion ? `v${esc(row.simulatorVersion)}` : '—'}</td><td>${row.reviewHistory.length ? `<details><summary>${esc(row.reviewSummary)}</summary>${row.reviewHistory.map(review => `<p><strong>r${esc(review.revision)} · ${formatDate(review.date)}</strong><br>${esc(review.summary)}<br><small>${esc(review.scope.join(' · '))}</small></p>`).join('')}</details>` : 'Aún no revisada'}</td></tr>`).join('')}</tbody></table></div>`;
}

function coverageView(rows, fields, levels) {
  const tags = new Map();
  rows.forEach(row => row.tags.split(',').map(tag => tag.trim()).filter(Boolean).forEach(tag => tags.set(tag, (tags.get(tag) || 0) + 1)));
  return `<div class="coverage-grid">
    <section><h3>Cobertura por disciplina</h3>${barList([...fields.entries()].sort((a, b) => b[1] - a[1]), rows.length)}</section>
      <section><h3>Cobertura por nivel</h3>${barList([...levels.entries()].sort((a, b) => b[1] - a[1]), rows.length)}</section>
      <section><h3>Cobertura por etiquetas</h3><p class="catalog-note">Conceptos de las fichas. Una fórmula puede tener varias etiquetas; los totales no se suman como disciplinas. El estado de revisión se consulta en Revisiones.</p>${barList([...tags.entries()].sort((a, b) => b[1] - a[1]), rows.length)}</section>
  </div>`;
}

function barList(entries, total) {
  const bars = values => `<div class="coverage-bars">${values.map(([label, count]) => `<div class="coverage-row"><span>${esc(label)}</span><b>${count}</b><i style="--w:${Math.max(3, Math.round((count / Math.max(total, 1)) * 100))}%"></i></div>`).join("")}</div>`;
  return bars(entries.slice(0,8)) + (entries.length > 8 ? `<details><summary>Ver ${entries.length-8} más · ${entries.length} en total</summary>${bars(entries.slice(8))}</details>` : '');
}

function countBy(rows, key) {
  const map = new Map();
  rows.forEach(row => map.set(row[key] || "Sin dato", (map.get(row[key] || "Sin dato") || 0) + 1));
  return map;
}

const EXPORT_COLUMNS = ["id", "name", "author", "year", "field", "level", "folder", "formulaCount", "hasSimulation", "completeness", "createdAt", "revision", "reviewedAt", "simulatorVersion", "reviewScope", "tags", "symbols", "prerequisites", "learningPath", "units", "dimensions", "formulas"];

function downloadCsv(rows) {
  const csv = [EXPORT_COLUMNS.join(";"), ...rows.map(row => EXPORT_COLUMNS.map(column => csvCell(row[column])).join(";"))].join("\n");
  downloadBlob(csv, "catalogo-formulas.csv", "text/csv;charset=utf-8");
}

function downloadJson(rows, validation) {
  const safeValidation = validation.map(row => ({ id: row.id, name: row.name, issues: row.issues }));
  downloadBlob(JSON.stringify({ generatedAt: new Date().toISOString(), formulas: rows, validation: safeValidation }, null, 2), "catalogo-formulas.json", "application/json;charset=utf-8");
}

function downloadExcel(rows, validation) {
  const validationById = new Map(validation.map(row => [row.id, row.issues.map(item => item.message).join(", ") || "OK"]));
  const columns = [...EXPORT_COLUMNS, "latexValidation"];
  const tableRows = rows.map(row => `<tr>${columns.map(column => `<td>${esc(column === "latexValidation" ? validationById.get(row.id) : row[column])}</td>`).join("")}</tr>`).join("");
  const workbook = `<!doctype html><html><head><meta charset="utf-8"><style>table{border-collapse:collapse}th,td{border:1px solid #999;padding:4px 8px}th{background:#e5e7eb}</style></head><body><table><thead><tr>${columns.map(column => `<th>${esc(column)}</th>`).join("")}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
  downloadBlob(`\ufeff${workbook}`, "catalogo-formulas.xls", "application/vnd.ms-excel;charset=utf-8");
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
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function openPromptDialog() {
  const dialog = document.querySelector(`#${PROMPT_DIALOG_ID}`);
  const prompt = superPromptText();
  dialog.innerHTML = `<article class="catalog-page">
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
  return `Actúa como desarrollador y editor científico del proyecto "Atlas de Ecuaciones Famosas". Usa exclusivamente la arquitectura formulas/<formula-id>/ y los catálogos formulas/catalog*.json. Cada fórmula debe incluir meta.json, formula.tex, significado.md, historia.md, derivacion.md, usos.md, ficha.md y, cuando proceda, simulacion/index.js y simulacion/styles.css. Comprueba metadatos, fórmula explicada, secciones, unidades, dimensionalidad, llaves, paréntesis, corchetes, pares left/right y exportación del simulador antes de integrarla.`;
}

function getEquations() {
  return window.FormulasAtlas?.equations || equations || [];
}

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
