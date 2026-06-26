const STRUCTURE_TOOLTIPS = {
  msqrt: ["√", "Raíz cuadrada: operación inversa de elevar al cuadrado."],
  mroot: ["ⁿ√", "Raíz de índice n: generaliza la raíz cuadrada a cualquier índice."],
  msup: ["exponente", "Potencia: indica una operación de escala, área, energía o multiplicación repetida según el contexto."],
  msub: ["subíndice", "Subíndice: distingue componentes, índices, puntos o familias de variables."],
  msubsup: ["subíndice/exponente", "Notación combinada con índice inferior y marca superior."],
  mfrac: ["fracción", "Cociente: expresa división, razón, proporción o normalización."],
  mover: ["marca superior", "Marca superior: puede indicar vector, media, operador o modificación de una variable."],
  munder: ["marca inferior", "Marca inferior: suele indicar condición, límite o índice bajo un operador."],
  munderover: ["límites", "Límites superior e inferior: aparecen en sumatorios, integrales, productos y operadores."]
};

const FALLBACK_SYMBOLS = new Map(Object.entries({
  "=": "igualdad: ambos lados representan el mismo valor o la misma relación matemática.",
  "+": "suma: agrega términos o contribuciones.",
  "-": "resta o signo negativo: diferencia entre términos o cambio de sentido.",
  "−": "resta o signo negativo: diferencia entre términos o cambio de sentido.",
  "±": "más/menos: indica dos posibilidades, una con suma y otra con resta.",
  "×": "multiplicación o producto vectorial, según el contexto.",
  "·": "producto escalar, producto entre factores o derivada temporal en notación compacta.",
  "/": "división o razón entre magnitudes.",
  "∂": "derivada parcial: variación respecto a una variable manteniendo otras constantes.",
  "∇": "operador nabla: gradiente, divergencia, rotacional o laplaciano según el uso.",
  "∑": "sumatorio: suma de una familia de términos.",
  "∫": "integral: acumulación continua de una magnitud.",
  "∏": "productorio: multiplicación de una familia de factores.",
  "∞": "infinito: límite no acotado o extensión indefinida.",
  "π": "pi: constante geométrica de la circunferencia.",
  "e": "número de Euler o variable, según el contexto de la fórmula.",
  "i": "unidad imaginaria: cumple i² = -1.",
  "ℏ": "constante de Planck reducida: h dividido por 2π.",
  "h": "constante de Planck, altura o variable auxiliar, según el contexto.",
  "c": "velocidad de la luz, hipotenusa o constante de propagación, según el contexto.",
  "G": "constante gravitatoria, tensor de Einstein o energía libre, según el contexto.",
  "R": "constante, radio, curvatura escalar o constante de los gases, según el contexto.",
  "T": "temperatura, periodo o tensor, según el contexto.",
  "S": "acción, entropía, superficie o variable de estado, según el contexto.",
  "H": "Hamiltoniano, entropía de Shannon, carga hidráulica o parámetro de Hubble, según el contexto.",
  "E": "energía o campo eléctrico, según el contexto.",
  "B": "campo magnético, radiancia o ancho de banda, según el contexto.",
  "F": "fuerza, campo vectorial o función, según el contexto.",
  "p": "presión, probabilidad o momento lineal, según el contexto.",
  "q": "carga eléctrica, coordenada generalizada o variable, según el contexto.",
  "m": "masa o índice, según el contexto.",
  "r": "distancia radial, radio o tasa, según el contexto.",
  "t": "tiempo.",
  "x": "coordenada, variable independiente o dato de entrada, según el contexto.",
  "y": "coordenada, variable dependiente, etiqueta o salida, según el contexto.",
  "z": "variable compleja, coordenada o puntuación, según el contexto.",
  "v": "velocidad o variable, según el contexto.",
  "a": "lado, aceleración, parámetro o factor de escala, según el contexto.",
  "b": "lado, coeficiente o parámetro, según el contexto.",
  "d": "diferencial, distancia o dimensión, según el contexto.",
  "f": "función, frecuencia o fuerza externa, según el contexto.",
  "k": "constante, curvatura o índice discreto, según el contexto.",
  "n": "número de elementos, índice o cantidad de sustancia, según el contexto.",
  "u": "campo escalar, temperatura o velocidad de fluido, según el contexto.",
  "λ": "lambda: longitud de onda, constante o multiplicador, según el contexto.",
  "Λ": "lambda mayúscula: constante cosmológica u operador.",
  "μ": "mu: viscosidad, media, potencial químico o constante, según el contexto.",
  "ρ": "rho: densidad, densidad de carga o matriz densidad, según el contexto.",
  "σ": "sigma: desviación típica, conductividad, volatilidad o función de activación, según el contexto.",
  "γ": "gamma: factor relativista, parámetro o índice adiabático, según el contexto.",
  "θ": "theta: ángulo, parámetro o vector de parámetros, según el contexto.",
  "τ": "tau: tiempo propio o variable temporal auxiliar.",
  "ψ": "psi: función de onda o campo cuántico.",
  "Ψ": "psi mayúscula: función de onda del sistema.",
  "Ω": "omega mayúscula: número de microestados o dominio.",
  "ω": "omega: frecuencia angular.",
  "ε": "épsilon: permitividad, energía pequeña o término de error, según el contexto.",
  "ϵ": "épsilon: permitividad, energía pequeña o término de error, según el contexto."
}));

let hideTimer = null;

export function mountFormulaTooltips(formulaBox, equation) {
  if (!formulaBox || formulaBox.closest("[hidden]")) return;
  const mathSvg = formulaBox.querySelector("mjx-container svg");
  if (!mathSvg) return;

  formulaBox.classList.add("has-formula-tooltips");
  const glossary = buildGlossary(equation);
  const layer = getOverlayLayer(formulaBox);
  layer.innerHTML = "";

  const formulaRect = formulaBox.getBoundingClientRect();
  const symbolZones = buildSymbolZones(formulaBox, formulaRect, glossary);
  const structureZones = buildStructureZones(formulaBox, formulaRect);
  const zones = [...structureZones, ...symbolZones];

  zones.forEach(zone => layer.appendChild(createZone(zone)));
  formulaBox.dataset.tooltipZones = String(zones.length);
}

function buildSymbolZones(formulaBox, formulaRect, glossary) {
  const nodes = [...formulaBox.querySelectorAll("svg g[data-mml-node='mi'], svg g[data-mml-node='mo'], svg g[data-mml-node='mn']")];
  return nodes.flatMap((node, index) => {
    const symbol = extractMathSymbol(node);
    const description = lookupSymbolDescription(symbol, glossary);
    if (!symbol || !description) return [];
    const rect = node.getBoundingClientRect();
    if (!isUsableRect(rect)) return [];
    return [{
      kind: "symbol",
      symbol,
      description,
      rect: toLocalRect(rect, formulaRect, formulaBox),
      order: index
    }];
  });
}

function buildStructureZones(formulaBox, formulaRect) {
  const selector = Object.keys(STRUCTURE_TOOLTIPS).map(name => `svg g[data-mml-node='${name}']`).join(",");
  return [...formulaBox.querySelectorAll(selector)].flatMap((node, index) => {
    const [symbol, description] = STRUCTURE_TOOLTIPS[node.dataset.mmlNode] || [];
    if (!symbol || !description) return [];
    const rect = node.getBoundingClientRect();
    if (!isUsableRect(rect)) return [];
    return [{
      kind: "structure",
      symbol,
      description,
      rect: toLocalRect(rect, formulaRect, formulaBox, 4),
      order: index
    }];
  });
}

function createZone(zone) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `formula-tooltip-zone is-${zone.kind}`;
  button.style.left = `${zone.rect.left}px`;
  button.style.top = `${zone.rect.top}px`;
  button.style.width = `${zone.rect.width}px`;
  button.style.height = `${zone.rect.height}px`;
  button.dataset.symbol = zone.symbol;
  button.dataset.description = zone.description;
  button.setAttribute("aria-label", `${zone.symbol}: ${zone.description}`);

  button.addEventListener("pointerenter", event => showPopover(event, zone.symbol, zone.description));
  button.addEventListener("pointermove", event => showPopover(event, zone.symbol, zone.description));
  button.addEventListener("pointerleave", () => hidePopover());
  button.addEventListener("focus", () => showPopoverAtElement(button, zone.symbol, zone.description));
  button.addEventListener("blur", () => hidePopover());
  button.addEventListener("click", event => showPopover(event, zone.symbol, zone.description));
  return button;
}

function getOverlayLayer(formulaBox) {
  let layer = formulaBox.querySelector(":scope > .formula-tooltip-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "formula-tooltip-layer";
    formulaBox.appendChild(layer);
  }
  return layer;
}

function buildGlossary(eq) {
  const glossary = new Map(FALLBACK_SYMBOLS);
  eq?.variables?.forEach(entry => {
    const separator = String(entry).indexOf(":");
    if (separator < 0) return;
    const rawKeys = String(entry).slice(0, separator);
    const description = String(entry).slice(separator + 1).trim();
    extractVariableKeys(rawKeys).forEach(key => {
      if (key && description) glossary.set(key, description);
    });
  });
  return glossary;
}

function extractVariableKeys(rawKeys) {
  const clean = String(rawKeys ?? "")
    .replace(/\s+(?:y|e)\s+/gi, ",")
    .replace(/[\/|]/g, ",");
  return clean
    .split(/[,;]+/)
    .map(part => part.trim())
    .filter(Boolean)
    .flatMap(part => {
      const direct = normalizeSymbolKey(part);
      const singleSymbols = [...part].map(normalizeSymbolKey).filter(Boolean);
      return [direct, ...singleSymbols];
    })
    .filter(Boolean);
}

function extractMathSymbol(node) {
  const codes = [...node.querySelectorAll(":scope use[data-c]")]
    .map(use => use.getAttribute("data-c"))
    .filter(Boolean);
  if (codes.length) return codes.map(code => codePointToSymbol(code)).join("").normalize("NFKC");
  return (node.textContent || "").normalize("NFKC").trim();
}

function codePointToSymbol(hex) {
  const value = Number.parseInt(hex, 16);
  if (!Number.isFinite(value)) return "";
  return String.fromCodePoint(value).normalize("NFKC");
}

function lookupSymbolDescription(symbol, glossary) {
  const key = normalizeSymbolKey(symbol);
  if (!key) return "";
  return glossary.get(key) || FALLBACK_SYMBOLS.get(key) || "";
}

function normalizeSymbolKey(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹0-9]/g, "")
    .replace(/[{}()[\]^_\\]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function isUsableRect(rect) {
  return rect && rect.width > 1 && rect.height > 1;
}

function toLocalRect(rect, parentRect, formulaBox, padding = 6) {
  const left = rect.left - parentRect.left + formulaBox.scrollLeft - padding;
  const top = rect.top - parentRect.top + formulaBox.scrollTop - padding;
  return {
    left: Math.max(0, left),
    top: Math.max(0, top),
    width: Math.max(12, rect.width + padding * 2),
    height: Math.max(14, rect.height + padding * 2)
  };
}

function showPopover(event, symbol, description) {
  const popover = getPopover();
  popover.innerHTML = `<strong>${escapeHtml(symbol)}</strong><span>${escapeHtml(description)}</span>`;
  popover.classList.add("visible");
  positionPopover(popover, event.clientX, event.clientY);
  scheduleAutoHide();
}

function showPopoverAtElement(element, symbol, description) {
  const rect = element.getBoundingClientRect();
  const popover = getPopover();
  popover.innerHTML = `<strong>${escapeHtml(symbol)}</strong><span>${escapeHtml(description)}</span>`;
  popover.classList.add("visible");
  positionPopover(popover, rect.right, rect.top + rect.height / 2);
  scheduleAutoHide();
}

function positionPopover(popover, clientX, clientY) {
  const offset = 8;
  const host = popover.parentElement;
  const insideDialog = host?.matches?.("#equationModal");
  const width = popover.offsetWidth || 0;
  const height = popover.offsetHeight || 0;

  if (insideDialog) {
    const hostRect = host.getBoundingClientRect();
    const localX = clientX - hostRect.left;
    const localY = clientY - hostRect.top;
    const maxLeft = Math.max(8, hostRect.width - width - 8);
    const maxTop = Math.max(8, hostRect.height - height - 8);
    popover.style.left = `${clamp(localX + offset, 8, maxLeft)}px`;
    popover.style.top = `${clamp(localY + offset, 8, maxTop)}px`;
    return;
  }

  const maxLeft = Math.max(8, window.innerWidth - width - 8);
  const maxTop = Math.max(8, window.innerHeight - height - 8);
  popover.style.left = `${clamp(clientX + offset, 8, maxLeft)}px`;
  popover.style.top = `${clamp(clientY + offset, 8, maxTop)}px`;
}

function getPopover() {
  const host = getPopoverHost();
  document.querySelectorAll(".formula-symbol-popover").forEach(popover => {
    if (popover.parentElement !== host) popover.remove();
  });

  let popover = host.querySelector(":scope > .formula-symbol-popover");
  if (!popover) {
    popover = document.createElement("div");
    popover.className = "formula-symbol-popover";
    host.appendChild(popover);
  }
  return popover;
}

function getPopoverHost() {
  return document.querySelector("#equationModal[open]") || document.body;
}

function scheduleAutoHide() {
  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(hidePopover, 3600);
}

function hidePopover() {
  window.clearTimeout(hideTimer);
  document.querySelectorAll(".formula-symbol-popover").forEach(popover => popover.classList.remove("visible"));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
