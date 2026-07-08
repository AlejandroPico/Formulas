export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let mathRenderQueued = false;
let queuedTargets = new Set();

export function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function unique(values) {
  return [...new Set(values)].filter(Boolean);
}

export function requestMathTypeset(targets = document.body) {
  const list = Array.isArray(targets) ? targets : [targets];
  list.filter(Boolean).forEach(target => queuedTargets.add(target));

  const run = () => {
    if (!window.MathJax?.typesetPromise) return false;
    const batch = [...queuedTargets];
    queuedTargets.clear();
    mathRenderQueued = false;
    window.MathJax.typesetPromise(batch.length ? batch : undefined)
      .then(() => {
        window.dispatchEvent(new CustomEvent("formulas:math-typeset", { detail: { targets: batch } }));
      })
      .catch(() => {});
    return true;
  };

  if (run()) return;
  if (!mathRenderQueued) {
    mathRenderQueued = true;
    window.addEventListener("load", () => setTimeout(run, 80), { once: true });
  }
}
