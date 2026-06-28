const MODES = [
  { id: "auto", label: "◐ Auto" },
  { id: "day", label: "☀ Día" },
  { id: "afternoon", label: "◒ Tarde" },
  { id: "night", label: "☾ Noche" },
  { id: "chalkboard", label: "▣ Colegio" },
  { id: "whiteboard", label: "▭ Rotulador" },
  { id: "postit", label: "◨ Post-it" },
  { id: "notebook", label: "▦ Cuaderno" },
  { id: "blueprint", label: "◇ Plano" },
  { id: "parchment", label: "☷ Pergamino" },
  { id: "terminal", label: "▤ Terminal" },
  { id: "terminal-amber", label: "▤ Ámbar" },
  { id: "terminal-cyan", label: "▤ Cian" },
  { id: "laboratory", label: "⌬ Laboratorio" },
  { id: "cosmos", label: "✦ Cosmos" },
  { id: "microfilm", label: "▥ Microfilm" }
];

let currentIndex = 0;
let timer = null;
let themeMenu = null;
let activeButton = null;

export function initTheme(button) {
  activeButton = button;
  const stored = localStorage.getItem("formula-theme-mode") || "auto";
  currentIndex = Math.max(0, MODES.findIndex(mode => mode.id === stored));
  applyMode(MODES[currentIndex], button);

  button.addEventListener("click", event => {
    if (event.altKey) {
      event.preventDefault();
      toggleThemeMenu(button);
      return;
    }
    closeThemeMenu();
    currentIndex = (currentIndex + 1) % MODES.length;
    localStorage.setItem("formula-theme-mode", MODES[currentIndex].id);
    applyMode(MODES[currentIndex], button);
  });

  document.addEventListener("click", event => {
    if (!themeMenu || themeMenu.hidden) return;
    if (event.target === button || themeMenu.contains(event.target)) return;
    closeThemeMenu();
  }, true);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeThemeMenu();
  });
}

function applyMode(mode, button = activeButton) {
  if (!button) return;
  button.textContent = mode.label;
  button.title = `Tema visual: ${mode.label.replace(/^[^\p{L}\p{N}]+/u, "")}. Alt + clic para elegir directamente.`;
  document.body.dataset.theme = mode.id === "auto" ? resolveAutoTheme() : mode.id;
  document.body.dataset.themeMode = mode.id;
  document.dispatchEvent(new CustomEvent("formula-theme-change", { detail: { mode: mode.id, resolved: document.body.dataset.theme } }));
  updateThemeMenuSelection();

  if (timer) clearInterval(timer);
  if (mode.id === "auto") {
    timer = setInterval(() => {
      document.body.dataset.theme = resolveAutoTheme();
      document.dispatchEvent(new CustomEvent("formula-theme-change", { detail: { mode: "auto", resolved: document.body.dataset.theme } }));
    }, 60_000);
  }
}

function toggleThemeMenu(button) {
  const menu = getThemeMenu(button);
  if (!menu.hidden) {
    closeThemeMenu();
    return;
  }
  positionThemeMenu(menu, button);
  menu.hidden = false;
  updateThemeMenuSelection();
  menu.querySelector("button.active")?.focus({ preventScroll: true });
}

function getThemeMenu(button) {
  if (themeMenu) return themeMenu;
  themeMenu = document.createElement("div");
  themeMenu.className = "theme-mode-menu";
  themeMenu.hidden = true;
  themeMenu.setAttribute("role", "menu");
  themeMenu.setAttribute("aria-label", "Seleccionar tema visual");
  themeMenu.innerHTML = MODES.map(mode => `<button type="button" role="menuitem" data-theme-mode="${mode.id}">${mode.label}</button>`).join("");
  themeMenu.addEventListener("click", event => {
    const option = event.target.closest("button[data-theme-mode]");
    if (!option) return;
    const index = MODES.findIndex(mode => mode.id === option.dataset.themeMode);
    if (index < 0) return;
    currentIndex = index;
    localStorage.setItem("formula-theme-mode", MODES[currentIndex].id);
    applyMode(MODES[currentIndex], button);
    closeThemeMenu();
  });
  document.body.appendChild(themeMenu);
  return themeMenu;
}

function positionThemeMenu(menu, button) {
  const rect = button.getBoundingClientRect();
  menu.style.right = `${Math.max(16, window.innerWidth - rect.right)}px`;
  menu.style.top = `${Math.min(window.innerHeight - 20, rect.bottom + 10)}px`;
}

function closeThemeMenu() {
  if (themeMenu) themeMenu.hidden = true;
}

function updateThemeMenuSelection() {
  if (!themeMenu) return;
  themeMenu.querySelectorAll("button[data-theme-mode]").forEach(button => {
    const active = button.dataset.themeMode === MODES[currentIndex]?.id;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", String(active));
  });
}

function resolveAutoTheme(date = new Date()) {
  const minutes = date.getHours() * 60 + date.getMinutes();
  if (minutes >= 420 && minutes < 1020) return "day";
  if (minutes >= 1020 && minutes < 1260) return "afternoon";
  return "night";
}
