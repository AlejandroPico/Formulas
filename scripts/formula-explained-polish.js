const COMMANDS = new Map(Object.entries({
  "\\alpha": "α",
  "\\beta": "β",
  "\\gamma": "γ",
  "\\delta": "δ",
  "\\Delta": "Δ",
  "\\epsilon": "ε",
  "\\theta": "θ",
  "\\lambda": "λ",
  "\\mu": "μ",
  "\\pi": "π",
  "\\rho": "ρ",
  "\\sigma": "σ",
  "\\Phi": "Φ",
  "\\phi": "φ",
  "\\omega": "ω",
  "\\nabla": "∇",
  "\\infty": "∞",
  "\\pm": "±",
  "\\cdot": "·",
  "\\times": "×",
  "\\sin": "sin",
  "\\cos": "cos",
  "\\tan": "tan",
  "\\ln": "ln",
  "\\log": "log"
}));

const observer = new MutationObserver(() => polishExplainedRows());
observer.observe(document.documentElement, { childList: true, subtree: true });
document.addEventListener("DOMContentLoaded", polishExplainedRows);

function polishExplainedRows() {
  document.querySelectorAll(".formula-words-row:not([data-polished])").forEach(row => {
    row.textContent = polishFormulaText(row.textContent || "");
    row.dataset.polished = "true";
  });
}

function polishFormulaText(value) {
  let text = String(value);
  text = replaceFractions(text);
  text = replaceSquareRoots(text);
  text = text
    .replace(/\\mathbf\{([^{}]+)\}/g, "$1")
    .replace(/\\hat\{([^{}]+)\}/g, "$1")
    .replace(/\\mathrm\{([^{}]+)\}/g, "$1")
    .replace(/\\left|\\right/g, "")
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/\^\{2\}/g, "²")
    .replace(/\^\{3\}/g, "³")
    .replace(/\bes igual a\b/gi, "=")
    .replace(/\bdividida por\b/gi, "/")
    .replace(/\bdividido por\b/gi, "/")
    .replace(/\bpor\b/gi, "·")
    .replace(/\bmás\b/gi, "+")
    .replace(/\bmenos\b/gi, "−");
  COMMANDS.forEach((replacement, command) => {
    text = text.replaceAll(command, replacement);
  });
  return text
    .replace(/[{}]/g, "")
    .replace(/\s*([=+−±/·×])\s*/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
}

function replaceFractions(value) {
  let text = value;
  const pattern = /\\frac\{([^{}]+)\}\{([^{}]+)\}/g;
  let previous = "";
  while (previous !== text) {
    previous = text;
    text = text.replace(pattern, "($1) / ($2)");
  }
  return text;
}

function replaceSquareRoots(value) {
  let text = value;
  const pattern = /\\sqrt\{([^{}]+)\}/g;
  let previous = "";
  while (previous !== text) {
    previous = text;
    text = text.replace(pattern, "√($1)");
  }
  return text;
}
