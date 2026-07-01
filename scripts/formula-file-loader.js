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

const LEVEL_ALIASES = [
  [/eso|secundaria/i, "ESO"],
  [/bachiller/i, "Bachillerato"],
  [/universidad inicial|universitario inicial|inicial/i, "Universidad inicial"],
  [/universidad|grado|ingenier/i, "Universidad"],
  [/avanzado|doctorado|investig/i, "Avanzado"]
];

const DOMAIN_PROFILES = [
  {
    match: /geometr|trigonom|álgebra|algebra|análisis|analisis|cálculo|calculo|teoría de números|teoria de numeros/i,
    tags: ["matemáticas", "abstracción", "demostración"],
    prerequisites: ["Álgebra elemental", "notación funcional", "manipulación simbólica"],
    path: ["Repasar variables y operaciones", "estudiar la interpretación geométrica o analítica", "resolver ejercicios guiados", "comparar con fórmulas relacionadas"],
    units: "Normalmente no tiene una unidad fija: depende de la magnitud que representen sus variables.",
    dimensions: "Debe comprobarse que cada igualdad compare objetos del mismo tipo algebraico o geométrico."
  },
  {
    match: /mecánica|mecanica|relatividad|cosmolog|física|fisica|fluidos|electro|cuántica|cuantica|termodinámica|termodinamica/i,
    tags: ["física", "modelo", "magnitudes"],
    prerequisites: ["Álgebra", "cálculo diferencial", "unidades del SI", "lectura de vectores o campos si aparecen"],
    path: ["Identificar magnitudes y unidades", "comprobar dimensionalidad", "estudiar casos límite", "ejecutar la simulación variando parámetros"],
    units: "Preferentemente unidades SI: metro, kilogramo, segundo, amperio, kelvin, mol y candela según corresponda.",
    dimensions: "La expresión debe conservar homogeneidad dimensional: ambos lados de una igualdad deben tener la misma dimensión física."
  },
  {
    match: /química|quimica|cinética|cinetica|bioquímica|bioquimica|termoquímica|termoquimica/i,
    tags: ["química", "laboratorio", "modelo experimental"],
    prerequisites: ["Moles y concentración", "temperatura absoluta", "energía", "logaritmos y exponenciales"],
    path: ["Revisar significado de constantes", "pasar unidades a SI o unidades químicas coherentes", "comparar con datos experimentales", "analizar sensibilidad de parámetros"],
    units: "Se usan K, mol, L, J, Pa, M o unidades SI equivalentes según el contexto químico.",
    dimensions: "Las constantes deben expresarse en unidades compatibles con la forma concreta de la ecuación."
  },
  {
    match: /probabilidad|estadística|estadistica|información|informacion|telecomunicaciones/i,
    tags: ["probabilidad", "estadística", "información"],
    prerequisites: ["Probabilidad básica", "sumatorios o integrales", "logaritmos", "distribuciones"],
    path: ["Interpretar variables aleatorias", "localizar normalizaciones", "analizar límites", "relacionar con incertidumbre o datos"],
    units: "Probabilidades adimensionales; información en bits si el logaritmo es base 2 o nats si es natural.",
    dimensions: "Las probabilidades deben ser adimensionales y estar normalizadas cuando proceda."
  },
  {
    match: /aprendizaje|machine|inteligencia|optimización|optimizacion|transformers|refuerzo/i,
    tags: ["IA", "optimización", "datos"],
    prerequisites: ["Álgebra lineal", "cálculo diferencial", "probabilidad", "programación básica"],
    path: ["Entender entradas y salidas", "identificar función objetivo", "probar parámetros en el simulador", "relacionar fórmula con entrenamiento o inferencia"],
    units: "Habitualmente adimensional; logits, pérdidas y probabilidades dependen de normalizaciones del modelo.",
    dimensions: "Muchas expresiones son escalares, vectores o tensores sin dimensión física directa. Lo importante es que las formas matriciales sean compatibles."
  },
  {
    match: /finanzas|econom/i,
    tags: ["finanzas", "riesgo", "modelo cuantitativo"],
    prerequisites: ["Interés compuesto", "probabilidad", "estadística", "cálculo básico"],
    path: ["Identificar supuestos del modelo", "comparar variables de mercado", "probar sensibilidad", "evaluar límites de aplicabilidad"],
    units: "Moneda, tiempo anualizado, tasas en tanto por uno y volatilidad anualizada según convención.",
    dimensions: "Las tasas deben estar en escalas temporales coherentes con el vencimiento."
  },
  {
    match: /biología|biologia|bio|población|poblacion|epidemiolog/i,
    tags: ["biología matemática", "dinámica", "modelo poblacional"],
    prerequisites: ["Funciones", "ecuaciones diferenciales básicas", "tasas de cambio", "lectura de gráficas"],
    path: ["Interpretar poblaciones o concentraciones", "estudiar equilibrios", "simular variación de parámetros", "comparar con datos reales"],
    units: "Poblaciones, concentraciones, tiempo y tasas ajustadas al sistema estudiado.",
    dimensions: "Las tasas suelen tener dimensión inversa de tiempo; las poblaciones o concentraciones deben mantenerse positivas."
  }
];

const LATEX_SYMBOL_MAP = new Map([
  ["alpha", "α"], ["beta", "β"], ["gamma", "γ"], ["delta", "δ"], ["Delta", "Δ"],
  ["epsilon", "ε"], ["varepsilon", "ε"], ["lambda", "λ"], ["Lambda", "Λ"],
  ["mu", "μ"], ["nu", "ν"], ["rho", "ρ"], ["sigma", "σ"], ["Sigma", "Σ"],
  ["theta", "θ"], ["Theta", "Θ"], ["phi", "φ"], ["varphi", "φ"], ["Phi", "Φ"],
  ["omega", "ω"], ["Omega", "Ω"], ["psi", "ψ"], ["Psi", "Ψ"], ["tau", "τ"], ["eta", "η"],
  ["hbar", "ℏ"]
]);

const IGNORED_LATEX_COMMANDS = new Set([
  "frac", "sqrt", "left", "right", "lVert", "rVert", "langle", "rangle", "cdot", "times", "pm", "mp",
  "sum", "prod", "int", "iint", "iiint", "oint", "partial", "nabla", "Box", "mathcal", "mathbf", "hat",
  "operatorname", "mathrm", "exp", "log", "ln", "sin", "cos", "tan", "max", "min", "lim", "quad", "qquad",
  "leq", "geq", "neq", "approx", "sim", "infty", "cdots", "ldots", "dots", "to", "rightarrow", "leftrightarrow",
  "parallel", "odot", "sqrt", "overline", "bar", "tilde"
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
      level: normalizeEducationalLevel(entry.level || "Sin nivel"),
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
  const profile = domainProfile(record);
  const tags = deriveTags(record, formula, profile);
  const prerequisites = normalizeList(record.prerequisites || record.requisitos || profile.prerequisites);
  const learningPath = normalizeList(record.learningPath || record.ruta || profile.path);
  const units = record.units || record.unidades || profile.units;
  const dimensions = record.dimensions || record.dimensiones || profile.dimensions;
  const symbols = extractFormulaSymbols(formula);
  const sections = buildSectionIndex(record, formula, { profile, tags, prerequisites, learningPath, units, dimensions, symbols });
  const simulationSection = sections.find(section => section.type === "simulation");

  return {
    id: record.id,
    name: record.name || prettifyFileName(record.id),
    author: record.author || "",
    year: record.year ?? "",
    field: record.field || "Sin área",
    level: normalizeEducationalLevel(record.level || "Sin nivel"),
    color: record.color || "#5d5af6",
    source: "files",
    folder: record.folder,
    formula,
    formulaText,
    tags,
    prerequisites,
    learningPath,
    units,
    dimensions,
    symbols,
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

function buildSectionIndex(record, formula, derived = {}) {
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
  sections.push(generatedLearningSection(record, derived));
  sections.push(generatedUnitsSection(record, formula, derived));
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

function generatedLearningSection(record, derived) {
  return {
    key: "aprendizaje",
    label: "Aprendizaje",
    type: "markdown",
    order: 70,
    content: `# Aprendizaje\n\n## Prerrequisitos\n\n${derived.prerequisites.map(item => `- ${item}`).join("\n")}\n\n## Ruta sugerida\n\n${derived.learningPath.map((item, index) => `- ${index + 1}. ${item}`).join("\n")}\n\n## Etiquetas\n\n${derived.tags.map(tag => `- ${tag}`).join("\n")}`
  };
}

function generatedUnitsSection(record, formula, derived) {
  const variables = derived.symbols?.length ? derived.symbols.map(symbol => `- \`${symbol}\``).join("\n") : "- No se han identificado variables principales limpias.";
  return {
    key: "unidades",
    label: "Unidades",
    type: "markdown",
    order: 80,
    content: `# Unidades y dimensionalidad\n\n## Para qué sirve esta pestaña\n\nEsta sección no repite la fórmula: sirve como guía rápida para saber en qué unidades conviene trabajar y qué comprobación dimensional debe hacerse antes de usarla en clase, laboratorio, simulación o cálculo numérico.\n\n## Unidades habituales\n\n${derived.units}\n\n## Comprobación dimensional\n\n${derived.dimensions}\n\n## Variables principales detectadas\n\n${variables}\n\n## Uso recomendado\n\n- Convierte todas las magnitudes a un sistema coherente antes de sustituir valores.\n- Comprueba que los dos lados de cada igualdad tienen la misma unidad o dimensión.\n- En fórmulas estadísticas, de información o IA, revisa si las cantidades son adimensionales, probabilidades, bits, nats, logits, tensores o tasas normalizadas.\n- En fórmulas físicas, químicas o de ingeniería, documenta explícitamente las unidades usadas en la simulación o en el ejercicio.`
  };
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

function normalizeEducationalLevel(value) {
  const text = String(value || "Sin nivel").trim();
  for (const [pattern, normalized] of LEVEL_ALIASES) {
    if (pattern.test(text)) return normalized;
  }
  if (/avanzado/i.test(text)) return "Avanzado";
  return text || "Sin nivel";
}

function domainProfile(record) {
  const haystack = `${record.field || ""} ${record.name || ""} ${record.id || ""}`;
  return DOMAIN_PROFILES.find(profile => profile.match.test(haystack)) || {
    tags: ["fórmula", "modelo", "atlas"],
    prerequisites: ["Lectura de expresiones algebraicas", "identificación de variables", "manejo básico de unidades"],
    path: ["Leer la fórmula simbólica", "pasar a fórmula explicada", "revisar significado y ficha", "probar simulación si existe"],
    units: "Depende de la interpretación de las variables.",
    dimensions: "Debe comprobarse que ambos lados de la relación tengan dimensiones compatibles."
  };
}

function deriveTags(record, formula, profile) {
  const base = [record.field, record.level, ...(record.tags || []), ...profile.tags];
  const text = `${record.name || ""} ${record.id || ""} ${record.field || ""} ${formula.join(" ")}`.toLowerCase();
  if (/\\nabla|campo|vector|mathbf/.test(text)) base.push("campos", "vectores");
  if (/\\int|integral/.test(text)) base.push("integrales");
  if (/\\sum|sumatorio|sigma/.test(text)) base.push("sumatorios");
  if (/\\partial|derivada|differential|ecuacion/.test(text)) base.push("ecuaciones diferenciales");
  if (/probabilidad|softmax|entropy|entrop/.test(text)) base.push("probabilidad");
  if (/simulacion|simulation/.test(record.simulation || "")) base.push("simulación");
  return [...new Set(base.map(tag => String(tag || "").trim()).filter(Boolean))];
}

function extractFormulaSymbols(formulas) {
  const raw = normalizeFormulaList(formulas).join(" ");
  const commandSymbols = [...raw.matchAll(/\\([a-zA-Z]+)/g)]
    .map(match => latexCommandToSymbol(match[1]))
    .filter(Boolean);
  const sanitized = raw
    .replace(/\\operatorname\{[^{}]*\}/g, " ")
    .replace(/\\mathrm\{[^{}]*\}/g, " ")
    .replace(/\\mathbf\{([^{}]+)\}/g, "$1")
    .replace(/\\hat\{([^{}]+)\}/g, "$1")
    .replace(/\\mathcal\s*\{?([A-Za-z])\}?/g, "$1")
    .replace(/\\[a-zA-Z]+/g, " ")
    .replace(/_[{]?[A-Za-z0-9'.,]+[}]?/g, " ")
    .replace(/\^[{]?[A-Za-z0-9+\-*/.,]+[}]?/g, " ");
  const latin = [...sanitized.matchAll(/\b[A-Za-z]\b/g)].map(match => match[0]);
  const greek = [...sanitized.matchAll(/[α-ωΑ-Ωℏ]/g)].map(match => match[0]);
  return [...new Set([...commandSymbols, ...latin, ...greek])]
    .filter(symbol => !/[0-9]/.test(symbol))
    .filter(symbol => !["e", "i", "d", "N"].includes(symbol) || /\bN\b/.test(raw))
    .slice(0, 18);
}

function latexCommandToSymbol(command) {
  if (IGNORED_LATEX_COMMANDS.has(command)) return "";
  return LATEX_SYMBOL_MAP.get(command) || "";
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);
  if (!value) return [];
  return String(value).split(/\n|;/g).map(item => item.trim()).filter(Boolean);
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
