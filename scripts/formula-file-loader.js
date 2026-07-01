import { formulaManifest } from "../formulas/manifest.js";

const FORMULAS_ROOT = "formulas";
const CATALOG_PATH = "formulas/catalog.json";
const RECENT_CATALOG_PATH = "formulas/catalog-recent.json";
const LORENTZ_CATALOG_PATH = "formulas/catalog-lorentz.json";
const QUANTUM_CATALOG_PATH = "formulas/catalog-quantum.json";
const CHEMISTRY_CATALOG_PATH = "formulas/catalog-chemistry.json";
const STATISTICS_CATALOG_PATH = "formulas/catalog-statistics.json";
const MACHINE_LEARNING_CATALOG_PATH = "formulas/catalog-machine-learning.json";
const APPLIED_MODELS_CATALOG_PATH = "formulas/catalog-applied-models.json";
const FORMULA_FIXES_CATALOG_PATH = "formulas/catalog-formula-fixes.json";

const CATALOG_NAME_ALIASES = new Map([
  ["ecuacion-de-friedmann", "ecuaciones-de-friedmann"],
  ["divergencia-kl", "divergencia-de-kullback-leibler"]
]);

const STANDARD_SECTIONS = [
  { file: "formula.tex", key: "formula", label: "Fórmula", type: "formula", order: 10 },
  { file: "significado.md", key: "significado", label: "Significado", type: "markdown", order: 20 },
  { file: "historia.md", key: "historia", label: "Historia", type: "markdown", order: 30 },
  { file: "derivacion.md", key: "derivacion", label: "Derivación", type: "markdown", order: 40 },
  { file: "usos.md", key: "usos", label: "Usos", type: "markdown", order: 50 },
  { file: "ficha.md", key: "ficha", label: "Ficha", type: "markdown", order: 60 }
];

export async function loadFormulaFiles(onProgress = () => {}) {
  onProgress({ message: "Cargando catálogo de fórmulas", value: 12 });
  const catalog = await loadCatalog();
  const records = recordsFromCatalog(catalog);
  onProgress({ message: `Preparando ${records.length} fichas`, value: 42 });
  const loaded = records.map((record, index) => {
    onProgress({ message: `Indexando ${record.id}`, value: 42 + Math.round((index / Math.max(records.length, 1)) * 50) });
    return buildFormulaEntry(record);
  });
  onProgress({ message: "Índice de fórmulas preparado", value: 96 });
  return loaded;
}

async function loadCatalog() {
  try {
    const catalog = await loadJsonArray(CATALOG_PATH);
    const recent = await loadOptionalJsonArray(RECENT_CATALOG_PATH);
    const lorentz = await loadOptionalJsonArray(LORENTZ_CATALOG_PATH);
    const quantum = await loadOptionalJsonArray(QUANTUM_CATALOG_PATH);
    const chemistry = await loadOptionalJsonArray(CHEMISTRY_CATALOG_PATH);
    const statistics = await loadOptionalJsonArray(STATISTICS_CATALOG_PATH);
    const machineLearning = await loadOptionalJsonArray(MACHINE_LEARNING_CATALOG_PATH);
    const appliedModels = await loadOptionalJsonArray(APPLIED_MODELS_CATALOG_PATH);
    const formulaFixes = await loadOptionalJsonArray(FORMULA_FIXES_CATALOG_PATH);
    return mergeCatalogEntries(catalog, recent, lorentz, quantum, chemistry, statistics, machineLearning, appliedModels, formulaFixes);
  } catch (error) {
    console.warn("No se pudo cargar formulas/catalog.json; usando manifest como respaldo.", error);
    return recordsFromManifest().map(record => ({
      id: record.id,
      folder: record.folder,
      name: prettifyFileName(record.id),
      field: "Sin área",
      level: "Sin nivel",
      color: "#5d5af6",
      formula: []
    }));
  }
}

async function loadJsonArray(path) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  const payload = await response.json();
  return Array.isArray(payload) ? payload : [];
}

async function loadOptionalJsonArray(path) {
  try {
    return await loadJsonArray(path);
  } catch {
    return [];
  }
}

function mergeCatalogEntries(...sets) {
  const byId = new Map();
  const byName = new Map();
  for (const entry of sets.flat()) {
    if (!entry?.id) continue;
    const nameKey = catalogDedupKey(entry);
    if (byName.has(nameKey)) byId.delete(byName.get(nameKey));
    byName.set(nameKey, entry.id);
    byId.set(entry.id, entry);
  }
  return [...byId.values()];
}

function catalogDedupKey(entry) {
  const key = sectionKeyFromFile(entry.name || entry.id);
  return CATALOG_NAME_ALIASES.get(key) || key;
}

function recordsFromCatalog(catalog) {
  return catalog.map(entry => {
    const folder = entry.folder || `${FORMULAS_ROOT}/${entry.id}`;
    return {
      ...entry,
      folder,
      files: filesFromCatalogEntry(entry, folder)
    };
  });
}

function filesFromCatalogEntry(entry, folder) {
  const files = new Map();
  files.set("meta.json", `${folder}/meta.json`);
  const declaredSections = Array.isArray(entry.sections) ? entry.sections : defaultSectionFiles(entry);
  declaredSections.forEach(section => {
    if (!section?.file) return;
    files.set(section.file, `${folder}/${section.file}`);
  });
  if (entry.simulation !== false) {
    files.set("simulacion/index.js", `${folder}/simulacion/index.js`);
    files.set("simulacion/styles.css", `${folder}/simulacion/styles.css`);
  }
  return files;
}

function defaultSectionFiles(entry) {
  const sections = STANDARD_SECTIONS.map(section => ({ file: section.file }));
  if (Array.isArray(entry.extraSections)) {
    entry.extraSections.forEach(file => sections.push({ file }));
  }
  return sections;
}

function recordsFromManifest() {
  return formulaManifest
    .filter(entry => entry.source === "files")
    .map(entry => ({ id: entry.id, folder: entry.folder, files: filesFromCatalogEntry(entry, entry.folder) }));
}

function buildFormulaEntry(record) {
  const formula = normalizeFormulaList(record.formula);
  const formulaText = normalizeFormulaList(record.formulaText || record.formula_text || record.explainedFormula || []);
  const sections = buildSectionIndex(record, formula);
  const simulationSection = sections.find(section => section.type === "simulation");

  return {
    id: record.id,
    name: record.name || prettifyFileName(record.id),
    author: record.author || "",
    year: record.year ?? "",
    field: record.field || "Sin área",
    level: record.level || "Sin nivel",
    color: record.color || "#5d5af6",
    source: "files",
    folder: record.folder,
    formula,
    formulaText,
    summary: record.summary || "",
    meaning: "",
    history: "",
    derivation: "",
    uses: [],
    variables: [],
    ficha: "",
    simulation: record.simulation || record.id,
    simulationModule: simulationSection?.path || "",
    simulationStylePath: simulationSection?.stylePath || "",
    sections
  };
}

function buildSectionIndex(record, formula) {
  const sections = [];
  for (const descriptor of STANDARD_SECTIONS) {
    const path = record.files.get(descriptor.file);
    if (!path) continue;
    sections.push({
      ...descriptor,
      path,
      content: descriptor.type === "formula" ? formula.join("\n\n") : "",
      lazy: descriptor.type !== "formula"
    });
  }
  customRootSections(record).forEach(section => sections.push(section));
  if (record.files.has("simulacion/index.js")) {
    sections.push({
      key: "simulacion",
      label: "Simulación",
      type: "simulation",
      order: 900,
      path: record.files.get("simulacion/index.js"),
      stylePath: record.files.get("simulacion/styles.css") || "",
      content: ""
    });
  }
  return sections.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, "es"));
}

function customRootSections(record) {
  const standardFiles = new Set(STANDARD_SECTIONS.map(section => section.file));
  return [...record.files.entries()]
    .filter(([rest]) => !standardFiles.has(rest) && !rest.includes("/") && (rest.endsWith(".md") || rest.endsWith(".tex")))
    .sort(([a], [b]) => a.localeCompare(b, "es"))
    .map(([rest, path], index) => ({
      file: rest,
      key: sectionKeyFromFile(rest),
      label: prettifyFileName(rest.replace(/\.[^.]+$/, "")),
      type: rest.endsWith(".tex") ? "formula" : "markdown",
      order: 100 + index,
      path,
      content: "",
      lazy: true
    }));
}

function normalizeFormulaList(value) {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(/\n\s*\n/g)
    .map(line => line.trim())
    .filter(Boolean);
}

function sectionKeyFromFile(file) {
  return file
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "seccion";
}

function prettifyFileName(value) {
  const text = String(value)
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return text.charAt(0).toLocaleUpperCase("es") + text.slice(1);
}
