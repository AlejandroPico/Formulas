import { mountBernoulliPlugin } from "./plugins/bernoulli-plugin.js";
import { mountGravityPlugin } from "./plugins/gravity-plugin.js";
import { mountEulerPlugin } from "./plugins/euler-plugin.js";
import { mountQuadraticPlugin } from "./plugins/quadratic-plugin.js";
import { mountSinesPlugin } from "./plugins/sines-plugin.js";
import { mountCosinesPlugin } from "./plugins/cosines-plugin.js";
import { mountPythagoreanPlugin } from "./plugins/pythagorean-plugin.js";

const PLUGINS = new Map([
  ["ecuacion de bernoulli", mountBernoulliPlugin],
  ["ley de gravitacion universal", mountGravityPlugin],
  ["identidad de euler", mountEulerPlugin],
  ["formula cuadratica", mountQuadraticPlugin],
  ["ley de los senos", mountSinesPlugin],
  ["ley de los cosenos", mountCosinesPlugin],
  ["teorema de pitagoras", mountPythagoreanPlugin]
]);

const modalContent = document.querySelector("#modalContent");
const mounted = new WeakMap();

if (modalContent) {
  const observer = new MutationObserver(scheduleMount);
  observer.observe(modalContent, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden"] });
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

function mountActivePlugin() {
  const panel = modalContent?.querySelector(".detail-panel.simulation-view.active");
  if (!panel || panel.hidden) return;
  const title = normalize(modalContent.querySelector(".detail-header h2")?.textContent || "");
  const mount = PLUGINS.get(title);
  if (!mount) return;

  const current = mounted.get(panel);
  if (current?.title === title) return;
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

  const dispose = mount({
    root: host,
    canvas: host.querySelector("canvas"),
    controls: host.querySelector(".formula-plugin-controls"),
    readout: host.querySelector(".formula-plugin-readout")
  });
  mounted.set(panel, { title, dispose });
}

function normalize(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
