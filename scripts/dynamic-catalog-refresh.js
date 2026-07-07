const RECENT_BATCHES = [18, 19, 20, 21, 22, 23, 24];
const VERSION = "20260706a";
const loaded = new Set();
let started = false;
let refreshTimer = 0;

function normalizeFolders() {
  const items = window.FormulasAtlas && Array.isArray(window.FormulasAtlas.equations) ? window.FormulasAtlas.equations : [];
  items.forEach(eq => {
    if (eq && eq.id && !eq.folder) eq.folder = `formulas/${eq.id}`;
  });
}

function scheduleRefresh() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    refreshTimer = 0;
    normalizeFolders();
    window.FormulasAtlas?.refresh?.();
  }, 140);
}

async function loadRecentBatchesOnce() {
  if (started) return;
  if (!window.FormulasAtlas || !Array.isArray(window.FormulasAtlas.equations)) return;
  started = true;

  await Promise.allSettled(
    RECENT_BATCHES.map(async batch => {
      if (loaded.has(batch)) return;
      await import(`./latest-formula-batch-${batch}.js?v=${VERSION}`);
      loaded.add(batch);
    })
  );

  scheduleRefresh();
}

window.addEventListener("formulas:catalog-ready", loadRecentBatchesOnce, { once: true });
document.addEventListener("DOMContentLoaded", () => window.setTimeout(loadRecentBatchesOnce, 0), { once: true });
window.setTimeout(loadRecentBatchesOnce, 800);
