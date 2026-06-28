import { normalizeText } from "./utils.js";

const levelOrder = {
  "ESO": 0,
  "Bachillerato": 1,
  "Universidad inicial": 2,
  "Universidad": 3,
  "Avanzado": 4
};

const GREEK_ALIASES = {
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  zeta: "ζ",
  eta: "η",
  theta: "θ",
  lambda: "λ",
  mu: "μ",
  pi: "π",
  rho: "ρ",
  sigma: "σ",
  tau: "τ",
  phi: "φ",
  psi: "ψ",
  omega: "ω",
  nabla: "∇",
  sumatorio: "∑",
  integral: "∫",
  infinito: "∞",
  raiz: "√"
};

export function filterEquations(equations, state) {
  const terms = parseSearchTerms(state.query);
  const hasSearch = terms.length > 0;

  return equations
    .filter((eq) => state.field === "Todas" || eq.field === state.field)
    .filter((eq) => state.level === "Todos" || eq.level === state.level)
    .map((eq) => ({ eq, score: hasSearch ? scoreEquation(eq, terms) : 0 }))
    .filter((item) => !hasSearch || item.score > 0)
    .sort((a, b) => hasSearch ? b.score - a.score || sortEquations(a.eq, b.eq, state.sort) : sortEquations(a.eq, b.eq, state.sort))
    .map((item) => item.eq);
}

function parseSearchTerms(query) {
  const normalized = normalizeQuery(query);
  if (!normalized) return [];
  const terms = normalized
    .split(/\s+/)
    .map(term => term.trim())
    .filter(Boolean);
  return [...new Set(terms.flatMap(expandTerm))];
}

function expandTerm(term) {
  const expanded = [term];
  if (GREEK_ALIASES[term]) expanded.push(normalizeQuery(GREEK_ALIASES[term]));
  if (term === "pitagoras" || term === "pythagoras") expanded.push("pitagoras", "pythagoras", "pitagorico", "pythagorean");
  if (term === "einstein") expanded.push("relatividad", "relativity");
  if (term === "maxwell") expanded.push("electromagnetismo", "electromagnetic");
  if (term === "schrodinger" || term === "schroedinger") expanded.push("cuantica", "quantum", "onda");
  if (term === "ia" || term === "ai") expanded.push("inteligencia", "artificial", "machine", "learning", "aprendizaje");
  if (term === "distancia") expanded.push("euclidea", "norma", "vector");
  if (term === "energia") expanded.push("energy", "e=mc2", "emc2");
  return expanded;
}

function scoreEquation(eq, terms) {
  const index = buildSearchIndex(eq);
  let score = 0;
  let matchedTerms = 0;

  terms.forEach(term => {
    const termScore = scoreTerm(term, index);
    if (termScore > 0) {
      matchedTerms += 1;
      score += termScore;
    }
  });

  if (!matchedTerms) return 0;
  score += matchedTerms * 12;
  if (matchedTerms === terms.length) score += 28;
  return score;
}

function scoreTerm(term, index) {
  let score = 0;
  if (index.id.includes(term)) score += 70;
  if (index.name === term) score += 220;
  else if (index.name.startsWith(term)) score += 160;
  else if (wordStarts(index.name, term)) score += 130;
  else if (index.name.includes(term)) score += 95;

  if (index.formulaCompact.includes(term)) score += 120;
  if (index.formulaText.includes(term)) score += 80;
  if (index.formulaWords.includes(term)) score += 76;
  if (index.author.includes(term)) score += 65;
  if (index.field.includes(term)) score += 54;
  if (index.level.includes(term)) score += 42;
  if (index.uses.includes(term)) score += 62;
  if (index.variables.includes(term)) score += 58;
  if (index.summary.includes(term)) score += 44;
  if (index.meaning.includes(term)) score += 34;
  if (index.history.includes(term)) score += 26;
  if (index.derivation.includes(term)) score += 30;
  if (index.full.includes(term)) score += 12;
  return score;
}

function buildSearchIndex(eq) {
  const formulas = Array.isArray(eq.formula) ? eq.formula : [eq.formula];
  const formulaWords = Array.isArray(eq.formulaText) ? eq.formulaText : [eq.formulaText || eq.formula_text || eq.explainedFormula || ""];
  const uses = [
    ...(eq.uses ?? []),
    ...(eq.useDetails ?? []).flatMap(item => [item.title, item.text])
  ];
  const fields = {
    id: normalizeQuery(eq.id),
    name: normalizeQuery(eq.name),
    author: normalizeQuery(eq.author),
    field: normalizeQuery(eq.field),
    level: normalizeQuery(eq.level),
    summary: normalizeQuery(eq.summary),
    meaning: normalizeQuery(eq.meaning),
    history: normalizeQuery(eq.history),
    derivation: normalizeQuery(eq.derivation),
    variables: normalizeQuery((eq.variables ?? []).join(" ")),
    uses: normalizeQuery(uses.join(" ")),
    formulaText: normalizeQuery(formulas.join(" ")),
    formulaWords: normalizeQuery(formulaWords.join(" ")),
    formulaCompact: normalizeFormulaSearch(formulas.join(" "))
  };
  fields.full = Object.values(fields).join(" ");
  return fields;
}

function wordStarts(text, term) {
  return text.split(/\s+/).some(word => word.startsWith(term));
}

function normalizeQuery(value) {
  return normalizeText(value)
    .replace(/schrödinger/g, "schrodinger")
    .replace(/schroedinger/g, "schrodinger")
    .replace(/pitágoras/g, "pitagoras")
    .replace(/pythágoras/g, "pythagoras")
    .replace(/[·⋅×]/g, " ")
    .replace(/[²]/g, "2")
    .replace(/[³]/g, "3")
    .replace(/\^/g, "")
    .replace(/[_{}()[\],.;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeFormulaSearch(value) {
  return normalizeText(value)
    .replace(/\\sqrt/g, "raiz sqrt ")
    .replace(/\\frac/g, "fraccion division ")
    .replace(/\\partial/g, "derivada parcial ")
    .replace(/\\nabla/g, "nabla gradiente divergencia ")
    .replace(/\\sum/g, "sumatorio suma ")
    .replace(/\\int/g, "integral ")
    .replace(/\\mathbf/g, " vector ")
    .replace(/\\lVert|\\rVert/g, " norma ")
    .replace(/[²]/g, "2")
    .replace(/[³]/g, "3")
    .replace(/[^a-z0-9α-ωΑ-Ωπ∞∫∑√=+\-]/gi, "")
    .replace(/\s+/g, "")
    .trim();
}

function sortEquations(a, b, sort) {
  if (sort === "name") return a.name.localeCompare(b.name, "es");
  if (sort === "field") return a.field.localeCompare(b.field, "es") || a.year - b.year;
  if (sort === "level") return (levelOrder[a.level] ?? 99) - (levelOrder[b.level] ?? 99) || a.year - b.year;
  return a.year - b.year;
}
