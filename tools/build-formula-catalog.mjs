import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FORMULAS_DIR = path.join(ROOT, "formulas");
const CATALOG_PATH = path.join(FORMULAS_DIR, "catalog.json");
const IGNORE = new Set(["shared"]);
const STANDARD = [
  "formula.tex",
  "significado.md",
  "historia.md",
  "derivacion.md",
  "usos.md",
  "ficha.md"
];

const previous = await readJson(CATALOG_PATH, []);
const previousById = new Map(previous.map(entry => [entry.id, entry]));
const entries = [];

for (const name of await fs.readdir(FORMULAS_DIR)) {
  const folderPath = path.join(FORMULAS_DIR, name);
  const stat = await fs.stat(folderPath);
  if (!stat.isDirectory() || IGNORE.has(name)) continue;
  const metaPath = path.join(folderPath, "meta.json");
  if (!(await exists(metaPath))) continue;

  const meta = await readJson(metaPath, {});
  const previousEntry = previousById.get(meta.id || name) || {};
  const formulaPath = path.join(folderPath, "formula.tex");
  const formula = meta.formula || previousEntry.formula || await readFormula(formulaPath);
  const formulaText = normalizeFormulaTextList(meta.formulaText || meta.formula_text || previousEntry.formulaText || []);
  const sections = await discoverSections(folderPath);
  const summary = meta.summary || previousEntry.summary || await firstParagraph(path.join(folderPath, "significado.md"));

  entries.push({
    id: meta.id || name,
    name: meta.name || titleFromId(name),
    author: meta.author || "",
    year: meta.year ?? "",
    field: meta.field || "Sin área",
    level: meta.level || "Sin nivel",
    color: meta.color || "#5d5af6",
    folder: `formulas/${name}`,
    formula,
    formulaText,
    summary,
    simulation: meta.simulation ?? (sections.some(section => section.file === "simulacion/index.js") ? name : false),
    sections
  });
}

entries.sort((a, b) => Number(a.year || 0) - Number(b.year || 0) || a.name.localeCompare(b.name, "es"));
await fs.writeFile(CATALOG_PATH, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
console.log(`Catalog written: ${entries.length} formulas`);

async function discoverSections(folderPath) {
  const sections = [];
  for (const file of STANDARD) {
    if (await exists(path.join(folderPath, file))) sections.push({ file });
  }
  for (const item of await fs.readdir(folderPath)) {
    const itemPath = path.join(folderPath, item);
    const stat = await fs.stat(itemPath);
    if (!stat.isFile()) continue;
    if (item === "meta.json" || STANDARD.includes(item)) continue;
    if (item.endsWith(".md") || item.endsWith(".tex")) sections.push({ file: item });
  }
  if (await exists(path.join(folderPath, "simulacion", "index.js"))) {
    sections.push({ file: "simulacion/index.js" });
    if (await exists(path.join(folderPath, "simulacion", "styles.css"))) sections.push({ file: "simulacion/styles.css" });
  }
  return sections;
}

async function readFormula(filePath) {
  if (!(await exists(filePath))) return [];
  const text = await fs.readFile(filePath, "utf8");
  return text.split(/\n\s*\n/g).map(line => line.trim()).filter(Boolean);
}

async function firstParagraph(filePath) {
  if (!(await exists(filePath))) return "";
  const text = await fs.readFile(filePath, "utf8");
  return text
    .split(/\n\s*\n/g)
    .map(block => block.trim())
    .find(block => block && !block.startsWith("#"))
    ?.replace(/\s+/g, " ") || "";
}

function normalizeFormulaTextList(value) {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list.map(item => String(item)
    .replace(/\bes igual a\b/gi, "=")
    .replace(/\bpor\b/gi, "·")
    .replace(/\bdividida por\b/gi, "/")
    .replace(/\bdividido por\b/gi, "/")
    .replace(/\bmás\b/gi, "+")
    .replace(/\bmenos\b/gi, "−")
    .replace(/\s*([=+−±/·])\s*/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim()
  ).filter(Boolean);
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function titleFromId(id) {
  const text = id.replace(/[-_]+/g, " ");
  return text.charAt(0).toLocaleUpperCase("es") + text.slice(1);
}
