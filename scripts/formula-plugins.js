const modalContent = document.querySelector("#modalContent");
const mounted = new WeakMap();
const moduleCache = new Map();

if (modalContent) {
  const observer = new MutationObserver(scheduleMount);
  observer.observe(modalContent, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden", "data-simulation-module"] });
  document.addEventListener("click", event => {
    if (event.target.closest?.(".detail-tabs button, .equation-card")) scheduleMount();
  });
  window.addEventListener("resize", scheduleMount);
}

function scheduleMount() {
  window.setTimeout(mountActivePlugin, 80);
  window.setTimeout(mountActivePlugin, 260);
  window.setTimeout(mountActivePlugin, 620);
}

async function mountActivePlugin() {
  const panel = modalContent?.querySelector(".detail-panel.simulation-view.active");
  if (!panel || panel.hidden) return;
  const modulePath = panel.dataset.simulationModule;
  if (!modulePath) return;

  const current = mounted.get(panel);
  if (current?.modulePath === modulePath) return;
  current?.dispose?.();

  panel.classList.add("has-formula-plugin");
  panel.querySelector("#simulationCanvas")?.classList.add("plugin-hidden-original");
  panel.querySelector("#simulationControls")?.classList.add("plugin-hidden-original");
  panel.querySelector(".formula-plugin-host")?.remove();

  const host = document.createElement("section");
  host.className = "formula-plugin-host";
  host.innerHTML = `
    <canvas class="formula-plugin-canvas" aria-label="Simulación interactiva de la fórmula"></canvas>
    <div class="formula-plugin-controls"></div>
    <div class="formula-plugin-readout" aria-live="polite"></div>
  `;
  panel.appendChild(host);

  loadSimulationStyles(panel.dataset.simulationStyle);

  try {
    const module = await importSimulationModule(modulePath);
    const mount = resolveMountFunction(module);
    if (!mount) throw new Error(`El módulo ${modulePath} no exporta una función de montaje.`);
    const dispose = mount({
      root: host,
      canvas: host.querySelector("canvas"),
      controls: host.querySelector(".formula-plugin-controls"),
      readout: host.querySelector(".formula-plugin-readout")
    });
    mounted.set(panel, { modulePath, dispose });
  } catch (error) {
    console.error(error);
    host.innerHTML = `<div class="formula-plugin-error"><strong>No se pudo cargar la simulación.</strong><span>${escapeHtml(error.message || String(error))}</span></div>`;
    mounted.set(panel, { modulePath, dispose: null });
  }
}

async function importSimulationModule(modulePath) {
  const url = new URL(`../${modulePath}`, import.meta.url).href;
  if (!moduleCache.has(url)) moduleCache.set(url, import(url));
  return moduleCache.get(url);
}

function resolveMountFunction(module) {
  if (typeof module.default === "function") return module.default;
  if (typeof module.mountSimulation === "function") return module.mountSimulation;
  const named = Object.entries(module).find(([name, value]) => /^mount.*Plugin$/.test(name) && typeof value === "function");
  if (named) return named[1];
  const anyFunction = Object.values(module).find(value => typeof value === "function");
  return anyFunction || null;
}

function loadSimulationStyles(stylePath) {
  if (!stylePath) return;
  const id = `formula-style-${stylePath.replace(/[^a-z0-9_-]+/gi, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = stylePath;
  document.head.appendChild(link);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
