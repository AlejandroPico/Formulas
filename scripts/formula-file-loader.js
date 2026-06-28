import { formulaManifest } from "../formulas/manifest.js";

export async function loadFormulaFiles() {
  const migrated = formulaManifest.filter(entry => entry.source === "files");
  const loaded = await Promise.all(migrated.map(loadFormulaEntry));
  return loaded.filter(Boolean);
}

async function loadFormulaEntry(entry) {
  const folder = entry.folder;
  const [meta, formula, significado, historia, derivacion, usos, ficha] = await Promise.all([
    fetchJson(`${folder}/meta.json`),
    fetchText(`${folder}/formula.tex`),
    fetchText(`${folder}/significado.md`),
    fetchText(`${folder}/historia.md`),
    fetchText(`${folder}/derivacion.md`),
    fetchText(`${folder}/usos.md`),
    fetchText(`${folder}/ficha.md`)
  ]);

  return {
    ...meta,
    formula: parseFormulaTex(formula),
    summary: firstContentParagraph(significado),
    meaning: markdownToPlainText(significado),
    history: markdownToPlainText(historia),
    derivation: markdownToPlainText(derivacion),
    uses: parseBullets(usos),
    variables: parseVariables(ficha),
    ficha: markdownToPlainText(ficha),
    simulation: meta.simulation || entry.id
  };
}

async function fetchText(path) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  return response.text();
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  return response.json();
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
