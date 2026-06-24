export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let mathRenderQueued = false;

export function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function unique(values) {
  return [...new Set(values)].filter(Boolean);
}

export function requestMathTypeset() {
  const run = () => window.MathJax?.typesetPromise?.().catch(() => {});
  if (window.MathJax?.typesetPromise) {
    run();
    return;
  }
  if (!mathRenderQueued) {
    mathRenderQueued = true;
    window.addEventListener("load", () => setTimeout(run, 80), { once: true });
  }
}
