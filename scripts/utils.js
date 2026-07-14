export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let mathChain = Promise.resolve();

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
  const requested = collectMathTargets(target);
  const task = async () => {
    const mathJax = await waitForMathJax();
    const targets = requested.filter(node => node?.isConnected);
    if (!targets.length || !mathJax?.typesetPromise) return targets;

    await mathJax.typesetPromise(targets);
    window.dispatchEvent(new CustomEvent("formulas:math-typeset", { detail: { targets } }));
    return targets;
  };

  mathChain = mathChain.then(task, task);
  return mathChain;
}

async function waitForMathJax() {
  if (window.MathJax?.startup?.promise) {
    try { await window.MathJax.startup.promise; } catch { /* MathJax informará después */ }
  }
  if (window.MathJax?.typesetPromise) return window.MathJax;

  return new Promise(resolve => {
    const startedAt = performance.now();
    const poll = () => {
      if (window.MathJax?.typesetPromise) {
        resolve(window.MathJax);
        return;
      }
      if (performance.now() - startedAt > 10000) {
        resolve(window.MathJax || null);
        return;
      }
      window.setTimeout(poll, 40);
    };
    poll();
  });
}

function collectMathTargets(target) {
  if (!target) return [];
  if (Array.isArray(target)) return [...new Set(target.filter(Boolean))];
  if (target instanceof NodeList || target instanceof HTMLCollection) return [...new Set([...target].filter(Boolean))];
  return [target];
}
