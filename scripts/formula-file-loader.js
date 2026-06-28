import { formulaManifest } from "../formulas/manifest.js";

const REPOSITORY = "AlejandroPico/Formulas";
const BRANCH = "main";
const TREE_API = `https://api.github.com/repos/${REPOSITORY}/git/trees/${BRANCH}?recursive=1`;
const FORMULAS_ROOT = "formulas";
const CATALOG_PATH = "formulas/catalog.json";
const IGNORED_FORMULA_FOLDERS = new Set(["shared"]);

const STANDARD_SECTIONS = [
  { file: "formula.tex", key: "formula", label: "Fórmula", type: "formula", order: 10 },
  { file: "significado.md", key: "significado", label: "Significado", type: "markdown", order: 20 },
  { file: "historia.md", key: "historia", label: "Historia", type: "markdown", order: 30 },
  { file: "derivacion.md", key: "derivacion", label: "Derivación", type: "markdown", order: 40 },
  { file: "usos.md", key: "usos", label: "Usos", type: "markdown", order: 50 },
  { file: "ficha.md", key: "ficha", label: "Ficha", type: "markdown", order: 60 }
];

const STANDARD_ROOT_FILES = new Set(["meta.json", ...STANDARD_SECTIONS.map(section => section.file)]);

export async function loadFormulaFiles(onProgress = () => {}) {
  onProgress({ message: "Cargando catálogo de fórmulas", value: 6 });
  const catalog = await loadCatalog();
  const catalogMap = new Map(catalog.map(entry => [entry.id, entry]));

  onProgress({ message: "Leyendo índice de carpetas", value: 16 });
  const records = await discoverFormulaRecords(onProgress);
  const mergedRecords = mergeCatalogAndTree(catalog, records);

  onProgress({ message: `Preparando ${mergedRecords.length} fichas`, value: 34 });
  const loaded = [];
  for (let index = 0; index < mergedRecords.length; index += 1) {
    const record = mergedRecords[index];
    const progress = 34 + Math.round((index / Math.max(mergedRecords.length, 1)) * 58);
    onProgress({ message: `Indexando ${record.id}`, value: progress });
    const formula = await buildFormulaEntry(record, catalogMap.get(record.id)).catch(error => {
      console.warn(`No se pudo indexar ${record.id}`, error);
      return null;
    });
    if (formula) loaded.push(formula);
  }
  onProgress({ message: "Índice de fórmulas preparado", value: 96 });
  return loaded;
}

async function loadCatalog() {
  try {
    const response = await fetch(CATALOG_PATH, { cache: "no-cache" });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload) ? payload : [];
  } catch (error) {
    console.warn("No se pudo cargar formulas/catalog.json", error);
    return [];
  }
}

async function discoverFormulaRecords(onProgress) {
  try {
    const response = await fetch(TREE_API, { cache: "no-cache" });
    if (!response.ok) throw new Error(`GitHub tree API ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.tree) || payload.truncated) throw new Error("Árbol de GitHub incompleto");
    const records = recordsFromTree(payload.tree);
    if (records.length) return records;
  } catch (error) {
    console.warn("No se pudo escanear el árbol de GitHub; se usa catalog/manifest como respaldo.", error);
    onProgress({ message: "Escaneo remoto no disponible; usando catálogo", value: 24 });
  }
  return recordsFromManifest();
}

function recordsFromTree(tree) {
  const byFolder = new Map();
  tree
    .filter(item => item.type === "blob" && item.path?.startsWith(`${FORMULAS_ROOT}/`))
    .forEach(item => {
      const parts = item.path.split("/");
      const id = parts[1];
      if (!id || IGNORED_FORMULA_FOLDERS.has(id)) return;
      const rest = parts.slice(2).join("/");
      if (!rest || rest === "README.md" || rest === "manifest.js" || rest === "catalog.json") return;
      if (!byFolder.has(id)) byFolder.set(id, { id, folder: `${FORMULAS_ROOT}/${id}`, files: new Map() });
      byFolder.get(id).files.set(rest, item.path);
    });
  return [...byFolder.values()]
    .filter(record => record.files.has("meta.json"))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function recordsFromManifest() {
  return formulaManifest
    .filter(entry => entry.source === "files")
    .map(entry => {
      const folder = entry.folder;
      const id = entry.id;
      const files = new Map();
      files.set("meta.json", `${folder}/meta.json`);
      STANDARD_SECTIONS.forEach(section => files.set(section.file, `${folder}/${section.file}`));
      files.set("simulacion/index.js", `${folder}/simulacion/index.js`);
      files.set("simulacion/styles.css", `${folder}/simulacion/styles.css`);
      return { id, folder, files };
    });
}

function mergeCatalogAndTree(catalog, treeRecords) {
  const byId = new Map();
  catalog.forEach(entry => {
    const folder = entry.folder || `${FORMULAS_ROOT}/${entry.id}`;
    byId.set(entry.id, { id: entry.id, folder, files: fallbackFiles(folder) });
  });
  treeRecords.forEach(record => byId.set(record.id, record));
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function fallbackFiles(folder) {
  const files = new Map();
  files.set("meta.json", `${folder}/meta.json`);
  STANDARD_SECTIONS.forEach(section => files.set(section.file, `${folder}/${section.file}`));
  files.set("simulacion/index.js", `${folder}/simulacion/index.js`);
  files.set("simulacion/styles.css", `${folder}/simulacion/styles.css`);
  return files;
}

async function buildFormulaEntry(record, catalogEntry) {
  const meta = catalogEntry || await fetchJson(record.files.get("meta.json"));
  const formula = normalizeFormulaList(meta.formula?.length ? meta.formula : await tryFetchFormula(record.files.get("formula.tex")));
  const formulaText = normalizeFormulaList(meta.formulaText || meta.formula_text || meta.explainedFormula || []);
  const sections = buildSectionIndex(record, formula);
  const simulationSection = sections.find(section => section.type === "simulation");

  return {
    id: meta.id || record.id,
    name: meta.name || prettifyFileName(record.id),
    author: meta.author || "",
    year: meta.year ?? "",
    field: meta.field || "Sin área",
    level: meta.level || "Sin nivel",
    color: meta.color || "#5d5af6",
    source: "files",
    folder: record.folder,
    formula,
    formulaText,
    summary: meta.summary || "",
    meaning: "",
    history: "",
    derivation: "",
    uses: [],
    variables: [],
    ficha: "",
    simulation: meta.simulation || record.id,
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
  sections.push(...customRootSections(record));
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
  return [...record.files.entries()]
    .filter(([rest]) => isCustomRootSection(rest))
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

function isCustomRootSection(rest) {
  if (rest.includes("/")) return false;
  if (STANDARD_ROOT_FILES.has(rest)) return false;
  return rest.endsWith(".md") || rest.endsWith(".tex");
}

async function tryFetchFormula(path) {
  if (!path) return [];
  const text = await fetchText(path).catch(() => "");
  return parseFormulaTex(text);
}

async function fetchText(path) {
  const response = await fetch(encodePath(path), { cache: "no-cache" });
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  return response.text();
}

async function fetchJson(path) {
  const response = await fetch(encodePath(path), { cache: "no-cache" });
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  return response.json();
}

function encodePath(path) {
  return String(path).split("/").map(encodeURIComponent).join("/");
}

function normalizeFormulaList(value) {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);
  if (!value) return [];
  return parseFormulaTex(String(value));
}

function parseFormulaTex(value) {
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
