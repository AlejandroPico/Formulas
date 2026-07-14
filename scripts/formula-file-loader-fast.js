import { loadFormulaFiles as loadFormulaFilesSequential } from "./formula-file-loader.js";

const CATALOG_PATHS = [
  "formulas/catalog.json",
  "formulas/catalog-recent.json",
  "formulas/catalog-lorentz.json",
  "formulas/catalog-quantum.json",
  "formulas/catalog-chemistry.json",
  "formulas/catalog-statistics.json",
  "formulas/catalog-machine-learning.json",
  "formulas/catalog-applied-models.json",
  "formulas/catalog-formula-fixes.json"
];

export async function loadFormulaFiles(onProgress = () => {}) {
  onProgress({ message: "Cargando catálogos en paralelo", value: 8 });
  const snapshots = await preloadCatalogs();
  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const key = normalizeCatalogRequest(input);
    const snapshot = snapshots.get(key);
    if (!snapshot) return nativeFetch(input, init);
    return new Response(snapshot.body, {
      status: snapshot.status,
      statusText: snapshot.statusText,
      headers: snapshot.headers
    });
  };

  try {
    return await loadFormulaFilesSequential(onProgress);
  } finally {
    window.fetch = nativeFetch;
  }
}

async function preloadCatalogs() {
  const entries = await Promise.all(CATALOG_PATHS.map(async path => {
    try {
      const response = await fetch(path, { cache: "no-cache" });
      const body = await response.text();
      return [path, {
        body,
        status: response.status,
        statusText: response.statusText,
        headers: { "content-type": response.headers.get("content-type") || "application/json;charset=utf-8" }
      }];
    } catch {
      return [path, {
        body: "[]",
        status: 503,
        statusText: "Catalog unavailable",
        headers: { "content-type": "application/json;charset=utf-8" }
      }];
    }
  }));
  return new Map(entries);
}

function normalizeCatalogRequest(input) {
  const value = typeof input === "string" ? input : input?.url || "";
  try {
    const url = new URL(value, window.location.href);
    const relative = url.pathname.replace(/^\/+/, "");
    const basePath = new URL(".", window.location.href).pathname.replace(/^\/+|\/+$/g, "");
    return basePath && relative.startsWith(`${basePath}/`)
      ? relative.slice(basePath.length + 1)
      : relative;
  } catch {
    return String(value).replace(/^\.\//, "");
  }
}
