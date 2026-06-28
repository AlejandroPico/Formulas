const MATH_PATTERN = /\\[a-zA-Z]+|[_^=+\-*/]|\b(?:sqrt|frac|Delta|Phi|rho|lambda|alpha|beta|gamma)\b/;

const observer = new MutationObserver(() => scheduleFix());
observer.observe(document.documentElement, { childList: true, subtree: true });
document.addEventListener("DOMContentLoaded", scheduleFix);
window.addEventListener("load", scheduleFix);

let pending = false;

function scheduleFix() {
  if (pending) return;
  pending = true;
  window.setTimeout(() => {
    pending = false;
    fixRawSymbolicFormulae();
  }, 80);
}

function fixRawSymbolicFormulae() {
  const targets = document.querySelectorAll(".formula-box:not(.is-explained)");
  let changed = false;

  targets.forEach(box => {
    if (box.closest(".formula-explained-mode")) return;
    if (box.querySelector(".formula-words-stack, .formula-words-row")) return;
    if (box.querySelector("mjx-container")) return;

    const stackRows = box.querySelectorAll(".formula-stack > div");
    if (stackRows.length) {
      stackRows.forEach(row => {
        if (row.dataset.mathjaxFixed === "true") return;
        const text = cleanMathText(row.textContent || "");
        if (!shouldWrap(text)) return;
        row.textContent = "";
        row.appendChild(mathSpan(text));
        row.dataset.mathjaxFixed = "true";
        changed = true;
      });
      return;
    }

    if (box.dataset.mathjaxFixed === "true") return;
    const text = cleanMathText(box.textContent || "");
    if (!shouldWrap(text)) return;
    box.textContent = "";
    box.appendChild(mathSpan(text));
    box.dataset.mathjaxFixed = "true";
    changed = true;
  });

  if (changed) requestTypeset();
}

function shouldWrap(text) {
  if (!text || text.includes("\\(") || text.includes("\\)")) return false;
  if (text.includes("es igual a") || text.includes("fuerza = masa")) return false;
  return MATH_PATTERN.test(text);
}

function cleanMathText(value) {
  return String(value)
    .replace(/^\(+|\)+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function mathSpan(formula) {
  const span = document.createElement("span");
  span.className = "mathjax-inline-formula";
  span.textContent = `\\(${formula}\\)`;
  return span;
}

function requestTypeset() {
  const run = () => {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise().catch(error => console.warn("MathJax safety typeset failed", error));
      return true;
    }
    return false;
  };
  if (run()) return;
  window.setTimeout(run, 250);
  window.setTimeout(run, 700);
}
