import { formulaManifest } from "../formulas/manifest.js";

const REPOSITORY = "AlejandroPico/Formulas";
const BRANCH = "main";
const TREE_API = `https://api.github.com/repos/${REPOSITORY}/git/trees/${BRANCH}?recursive=1`;
const FORMULAS_ROOT = "formulas";
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
  onProgress({ message: "Escaneando carpeta formulas", value: 6 });
  const records = await discoverFormulaRecords(onProgress);
  onProgress({ message: `Cargando ${records.length} fórmulas desde archivos`, value: 18 });
  const loaded = [];
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    onProgress({ message: `Cargando ${record.id}`, value: 18 + Math.round((index / Math.max(records.length, 1)) * 76) });
    const formula = await loadFormulaEntry(record).catch(error => {
      console.warn(`No se pudo cargar ${record.id}`, error);
      return null;
    });
    if (formula) loaded.push(formula);
  }
  onProgress({ message: "Fórmulas de archivos cargadas", value: 96 });
  return loaded;
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
    console.warn("No se pudo escanear el árbol de GitHub; se usa manifest como respaldo.", error);
    onProgress({ message: "Escaneo remoto no disponible; usando manifest", value: 12 });
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
      if (!rest || rest === "README.md" || rest === "manifest.js") return;
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

async function loadFormulaEntry(record) {
  const meta = await fetchJson(record.files.get("meta.json"));
  const sections = [];
  for (const descriptor of STANDARD_SECTIONS) {
    const path = record.files.get(descriptor.file);
    if (!path) continue;
    const content = await fetchText(path).catch(() => "");
    if (!content.trim()) continue;
    sections.push({ ...descriptor, path, content });
  }

  const customSections = await loadCustomRootSections(record);
  sections.push(...customSections);

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

  sections.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, "es"));
  const formulaSection = sections.find(section => section.type === "formula");
  const meaningSection = sections.find(section => section.key === "significado") || sections.find(section => section.type === "markdown");
  const fichaSection = sections.find(section => section.key === "ficha");
  const usesSection = sections.find(section => section.key === "usos");
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
    formula: formulaSection ? parseFormulaTex(formulaSection.content) : [],
    summary: meta.summary || firstContentParagraph(meaningSection?.content || ""),
    meaning: markdownToPlainText(meaningSection?.content || ""),
    history: markdownToPlainText(sections.find(section => section.key === "historia")?.content || ""),
    derivation: markdownToPlainText(sections.find(section => section.key === "derivacion")?.content || ""),
    uses: usesSection ? parseBullets(usesSection.content) : [],
    variables: fichaSection ? parseVariables(fichaSection.content) : [],
    ficha: markdownToPlainText(fichaSection?.content || ""),
    simulation: meta.simulation || record.id,
    simulationModule: simulationSection?.path || "",
    simulationStylePath: simulationSection?.stylePath || "",
    sections
  };
}

async function loadCustomRootSections(record) {
  const custom = [...record.files.entries()]
    .filter(([rest]) => isCustomRootSection(rest))
    .sort(([a], [b]) => a.localeCompare(b, "es"));
  const loaded = [];
  for (let index = 0; index < custom.length; index += 1) {
    const [rest, path] = custom[index];
    const content = await fetchText(path).catch(() => "");
    if (!content.trim()) continue;
    loaded.push({
      file: rest,
      key: sectionKeyFromFile(rest),
      label: prettifyFileName(rest.replace(/\.[^.]+$/, "")),
      type: rest.endsWith(".tex") ? "formula" : "markdown",
      order: 100 + index,
      path,
      content
    });
  }
  return loaded;
}

function isCustomRootSection(rest) {
  if (rest.includes("/")) return false;
  if (STANDARD_ROOT_FILES.has(rest)) return false;
  return rest.endsWith(".md") || rest.endsWith(".tex");
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

function parseFormulaTex(value) {
  return String(value)
    .split(/\n\s*\n/g)
    .map(line => line.trim())
    .filter(Boolean);
}

function markdownToPlainText(value) {
  return String(value)
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"))
    .map(line => line.replace(/^-\s+/, ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstContentParagraph(value) {
  return String(value)
    .split(/\n\s*\n/g)
    .map(block => block.trim())
    .filter(block => block && !block.startsWith("#"))[0]
    ?.replace(/\s+/g, " ")
    .trim() || "";
}

function parseBullets(value) {
  const bullets = String(value)
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.startsWith("- "))
    .map(line => line.slice(2).trim());
  return bullets.length ? bullets : [markdownToPlainText(value)].filter(Boolean);
}

function parseVariables(value) {
  const lines = String(value).split("\n");
  const variables = [];
  let inVariables = false;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^##\s+Variables/i.test(line)) {
      inVariables = true;
      continue;
    }
    if (inVariables && line.startsWith("## ")) break;
    if (inVariables && line.startsWith("- ")) variables.push(line.slice(2).trim());
  }
  return variables;
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
