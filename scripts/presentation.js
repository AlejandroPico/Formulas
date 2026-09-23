const INTRO_LEAVE_MS = 1200;
const INTRO_REMOVE_MS = 1850;

const intro = document.querySelector("#projectIntro");
const aboutToggle = document.querySelector("#aboutToggle");
const aboutDialog = document.querySelector("#aboutDialog");
const aboutClose = document.querySelector("#aboutClose");

initIntro();
initAbout();

function initIntro() {
  if (!intro) return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
    intro.remove();
    return;
  }

  window.setTimeout(() => intro.classList.add("is-leaving"), INTRO_LEAVE_MS);
  window.setTimeout(() => intro.remove(), INTRO_REMOVE_MS);
}

function initAbout() {
  if (!aboutToggle || !aboutDialog) return;

  aboutToggle.addEventListener("click", () => {
    if (typeof aboutDialog.showModal === "function") aboutDialog.showModal();
    else aboutDialog.setAttribute("open", "");
    document.body.classList.add("about-open");
  });

  aboutClose?.addEventListener("click", closeAbout);

  aboutDialog.addEventListener("click", event => {
    if (event.target === aboutDialog) closeAbout();
  });

  aboutDialog.addEventListener("close", () => {
    document.body.classList.remove("about-open");
    const focusTarget = window.matchMedia("(max-width: 900px)").matches
      ? document.querySelector("#mobileMenuToggle")
      : aboutToggle;
    focusTarget?.focus({ preventScroll: true });
  });

  aboutDialog.addEventListener("cancel", event => {
    event.preventDefault();
    closeAbout();
  });
}

function closeAbout() {
  if (!aboutDialog) return;
  if (typeof aboutDialog.close === "function" && aboutDialog.open) aboutDialog.close();
  else {
    aboutDialog.removeAttribute("open");
    document.body.classList.remove("about-open");
  }
}
