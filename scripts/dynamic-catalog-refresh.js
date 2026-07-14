const RECENT_BATCHES = [18, 19, 20, 21, 22, 23, 24];
const VERSION = "20260715a";
const loaded = new Set();
let started = false;
let normalizeTimer = 0;

const REQUIRED_SECTIONS = [
  ["significado", "Significado", 20],
  ["historia", "Historia", 30],
  ["derivacion", "Derivación", 40],
  ["usos", "Usos", 50],
  ["ficha", "Ficha", 60],
  ["aprendizaje", "Aprendizaje", 70],
  ["unidades", "Unidades", 80]
];

function asList(value) {
  return Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
}

function clean(value) {
  return String(value ?? "").trim();
}

function markdownSection(key, label, order, content) {
  return { key, label, type: "markdown", order, content };
}

function hasSection(sections, key) {
  return sections.some(section => section?.key === key);
}

function sectionContent(sections, ...keys) {
  for (const key of keys) {
    const section = sections.find(item => item?.key === key);
    if (clean(section?.content)) return clean(section.content);
  }
  return "";
}

function formulaSummary(eq) {
  return clean(eq.summary)
    || asList(eq.formulaText).join("\n")
    || asList(eq.formula).join("\n\n")
    || clean(eq.name);
}

function defaultSectionContent(eq, key, sections) {
  const summary = formulaSummary(eq);
  const interpretation = sectionContent(sections, "interpretacion", "interpretación");
  const limitations = sectionContent(sections, "limitaciones", "límites", "limites");
  const prerequisites = asList(eq.prerequisites).join(", ") || "Conceptos básicos del área correspondiente.";
  const path = asList(eq.learningPath).join(" → ") || "fórmula → significado → derivación → usos → simulación";
  const tags = asList(eq.tags).join(", ");
  const symbols = asList(eq.symbols).join(", ") || "Variables indicadas en la fórmula.";

  if (key === "significado") return `# Significado\n\n${summary}`;
  if (key === "historia") return `# Historia\n\n${clean(eq.author) ? `Se asocia a ${clean(eq.author)}. ` : ""}${clean(eq.year) ? `Referencia temporal aproximada: ${clean(eq.year)}. ` : ""}${summary}`;
  if (key === "derivacion") return `# Derivación\n\nLa derivación parte de las definiciones y supuestos del modelo. Identifica las variables, aplica las relaciones previas del área y comprueba que cada transformación conserva la igualdad.\n\n${summary}`;
  if (key === "usos") return `# Usos\n\n- Resolución de problemas del área ${clean(eq.field) || "correspondiente"}.\n- Enseñanza y comprobación conceptual.\n- Cálculo, simulación o análisis de casos límite.\n\n${summary}`;
  if (key === "ficha") return `# Ficha\n\n**Nombre:** ${clean(eq.name)}\n\n**Área:** ${clean(eq.field) || "Sin área"}\n\n**Nivel:** ${clean(eq.level) || "Sin nivel"}\n\n**Resumen:** ${summary}\n\n${interpretation ? `## Lectura e interpretación\n\n${interpretation}\n\n` : ""}${limitations ? `## Validez y limitaciones\n\n${limitations}` : ""}`;
  if (key === "aprendizaje") return `# Aprendizaje\n\n**Prerrequisitos:** ${prerequisites}\n\n**Ruta sugerida:** ${path}${tags ? `\n\n**Etiquetas:** ${tags}` : ""}`;
  if (key === "unidades") return `# Unidades y dimensionalidad\n\n**Unidades habituales:** ${clean(eq.units) || "Dependen de la interpretación de las variables."}\n\n**Comprobación dimensional:** ${clean(eq.dimensions) || "Comprueba que ambos lados de la igualdad tengan dimensiones compatibles."}\n\n**Variables principales:** ${symbols}`;
  return `# ${key}\n\n${summary}`;
}

function normalizeFormula(eq) {
  if (!eq) return false;
  let changed = false;

  if (eq.id && !eq.folder) {
    eq.folder = `formulas/${eq.id}`;
    changed = true;
  }

  if (!Array.isArray(eq.formula)) {
    eq.formula = asList(eq.formula);
    changed = true;
  }

  const sections = Array.isArray(eq.sections) ? eq.sections : (eq.sections = []);
  if (!hasSection(sections, "formula") && eq.formula.length) {
    sections.push({ key: "formula", label: "Fórmula", type: "formula", order: 10, content: eq.formula.join("\n\n"), lazy: false });
    changed = true;
  }

  REQUIRED_SECTIONS.forEach(([key, label, order]) => {
    if (hasSection(sections, key)) return;
    sections.push(markdownSection(key, label, order, defaultSectionContent(eq, key, sections)));
    changed = true;
  });

  sections.sort((a, b) => Number(a?.order || 500) - Number(b?.order || 500));
  return changed;
}

function normalizeCatalog() {
  const items = window.FormulasAtlas?.equations;
  if (!Array.isArray(items)) return 0;
  let changed = 0;
  items.forEach(eq => { if (normalizeFormula(eq)) changed += 1; });
  if (changed) window.dispatchEvent(new CustomEvent("formulas:catalog-normalized", { detail: { changed } }));
  return changed;
}

function scheduleNormalize() {
  window.clearTimeout(normalizeTimer);
  normalizeTimer = window.setTimeout(() => {
    normalizeTimer = 0;
    normalizeCatalog();
  }, 40);
}

async function loadRecentBatchesOnce() {
  if (started) return;
  if (!window.FormulasAtlas || !Array.isArray(window.FormulasAtlas.equations)) return;
  started = true;

  normalizeCatalog();
  await Promise.allSettled(RECENT_BATCHES.map(async batch => {
    if (loaded.has(batch)) return;
    await import(`./latest-formula-batch-${batch}.js?v=${VERSION}`);
    loaded.add(batch);
  }));
  normalizeCatalog();
  window.FormulasAtlas.refresh?.({ force: true });
}

window.addEventListener("formulas:catalog-ready", loadRecentBatchesOnce, { once: true });
window.addEventListener("formulas:catalog-mutated", scheduleNormalize);
document.addEventListener("DOMContentLoaded", () => window.setTimeout(loadRecentBatchesOnce, 0), { once: true });
window.setTimeout(loadRecentBatchesOnce, 500);
