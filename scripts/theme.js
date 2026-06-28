const MODES = [
  { id: "auto", label: "◐ Auto" },
  { id: "day", label: "☀ Día" },
  { id: "afternoon", label: "◒ Tarde" },
  { id: "night", label: "☾ Noche" },
  { id: "chalkboard", label: "▣ Pizarras" },
  { id: "whiteboard", label: "▭ Pizarra" },
  { id: "postit", label: "◨ Post-it" }
];

let currentIndex = 0;
let timer = null;

export function initTheme(button) {
  const stored = localStorage.getItem("formula-theme-mode") || "auto";
  currentIndex = Math.max(0, MODES.findIndex(mode => mode.id === stored));
  applyMode(MODES[currentIndex], button);

  button.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % MODES.length;
    localStorage.setItem("formula-theme-mode", MODES[currentIndex].id);
    applyMode(MODES[currentIndex], button);
  });
}

function applyMode(mode, button) {
  button.textContent = mode.label;
  button.title = `Tema visual: ${mode.label.replace(/^[^\p{L}\p{N}]+/u, "")}`;
  document.body.dataset.theme = mode.id === "auto" ? resolveAutoTheme() : mode.id;
  document.body.dataset.themeMode = mode.id;
  document.dispatchEvent(new CustomEvent("formula-theme-change", { detail: { mode: mode.id, resolved: document.body.dataset.theme } }));

  if (timer) clearInterval(timer);
  if (mode.id === "auto") {
    timer = setInterval(() => {
      document.body.dataset.theme = resolveAutoTheme();
      document.dispatchEvent(new CustomEvent("formula-theme-change", { detail: { mode: "auto", resolved: document.body.dataset.theme } }));
    }, 60_000);
  }
}

function resolveAutoTheme(date = new Date()) {
  const minutes = date.getHours() * 60 + date.getMinutes();
  if (minutes >= 420 && minutes < 1020) return "day";
  if (minutes >= 1020 && minutes < 1260) return "afternoon";
  return "night";
}
