export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let mathRenderQueued = false;
let mathRenderRunning = false;
let mathQueue = new Set();

export function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function unique(values) {
  return [...new Set(values)].filter(Boolean);
}

export function requestMathTypeset(target = document.body) {
  collectMathTargets(target).forEach(node => mathQueue.add(node));
  if (mathRenderQueued) return;
  mathRenderQueued = true;

  const run = () => {
    mathRenderQueued = false;
    if (mathRenderRunning || !window.MathJax?.typesetPromise) return;
    const targets = [...mathQueue].filter(node => node?.isConnected);
    mathQueue.clear();
    if (!targets.length) return;
    mathRenderRunning = true;
    window.MathJax.typesetPromise(targets)
      .catch(() => {})
      .finally(() => {
        mathRenderRunning = false;
        if (mathQueue.size) requestMathTypeset([]);
      });
  };

  if (window.MathJax?.typesetPromise) {
    window.requestAnimationFrame(run);
    return;
  }

  window.addEventListener("load", () => window.setTimeout(run, 80), { once: true });
}

function collectMathTargets(target) {
  if (!target) return [];
  if (Array.isArray(target)) return target.filter(Boolean);
  if (target instanceof NodeList || target instanceof HTMLCollection) return [...target].filter(Boolean);
  return [target];
}
