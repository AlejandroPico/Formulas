import { promises as fs } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

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

const catalogFiles = (await fs.readdir(FORMULAS_DIR)).filter(file => /^catalog.*\.json$/.test(file) && file !== 'catalog-index.json');
const previous = (await Promise.all(catalogFiles.map(file => readJson(path.join(FORMULAS_DIR, file), [])))).flat();
const previousById = new Map(previous.map(entry => [entry.id, entry]));
const entries = [];
const searchIndex = {};
const createdDates = new Map();
let date = '';
const history = execFileSync('git', ['log', '--format=DATE:%aI', '--name-only', '--diff-filter=A', '--', 'formulas', 'scripts'], { encoding: 'utf8' });
for (const line of history.split(/\r?\n/)) {
  if (line.startsWith('DATE:')) date = line.slice(5, 15);
  else if (line.trim()) createdDates.set(line.trim(), date);
}

for (const name of await fs.readdir(FORMULAS_DIR)) {
  const folderPath = path.join(FORMULAS_DIR, name);
  const stat = await fs.stat(folderPath);
  if (!stat.isDirectory() || IGNORE.has(name)) continue;
  const metaPath = path.join(folderPath, "meta.json");
  if (!(await exists(metaPath))) continue;

  const meta = await readJson(metaPath, {});
  const previousEntry = previousById.get(meta.id || name) || {};
  const formulaPath = path.join(folderPath, "formula.tex");
  const formula = firstNonEmptyList(await readFormula(formulaPath), meta.formula, previousEntry.formula);
  const formulaText = normalizeFormulaTextList(meta.formulaText || meta.formula_text || previousEntry.formulaText || []);
  const sections = await discoverSections(folderPath);
  const summary = meta.summary || previousEntry.summary || await firstParagraph(path.join(folderPath, "significado.md"));
  searchIndex[meta.id || name] = (await Promise.all(sections.filter(section => section.file.endsWith('.md')).map(section => fs.readFile(path.join(folderPath, section.file), 'utf8')))).join(' ').replace(/\s+/g, ' ').trim();

  entries.push({
    ...previousEntry,
    ...meta,
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
    createdAt: meta.createdAt || createdDates.get(`formulas/${name}/meta.json`) || null,
    sections
  });
}

entries.sort((a, b) => Number(a.year || 0) - Number(b.year || 0) || a.name.localeCompare(b.name, "es"));
await fs.writeFile(path.join(FORMULAS_DIR, 'catalog-index.json'), `${JSON.stringify(entries)}\n`, "utf8");
await fs.writeFile(path.join(FORMULAS_DIR, 'search-index.json'), `${JSON.stringify(searchIndex)}\n`, 'utf8');
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

function firstNonEmptyList(...values) {
  for (const value of values) {
    if (Array.isArray(value) && value.length) return value;
    if (typeof value === "string" && value.trim()) return [value.trim()];
  }
  return [];
}

function normalizeFormulaTextList(value) {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list.map(item => String(item)
    .replace(/\bdividida por\b/gi, "/")
    .replace(/\bdividido por\b/gi, "/")
    .replace(/\bes igual a\b/gi, "=")
    .replace(/\bpor\b/gi, "·")
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
