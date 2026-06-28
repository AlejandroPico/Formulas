const BOARDS = ["green", "blue", "black", "green", "blue"];
const MARKERS = ["blue", "green", "red", "teal", "violet", "orange", "black", "blue", "green", "red"];
const NOTES = [
  "yellow", "coral", "peach", "sand", "mint", "sage", "fog", "sky",
  "blue", "navy", "purple", "lavender", "salmon", "clay", "chalk", "rose",
  "lemon", "aqua", "olive", "plum"
];
const TILTS = ["-.7deg", ".45deg", "-.25deg", ".65deg", "-.45deg", ".2deg", "-.12deg", ".35deg"];

const grid = document.querySelector("#equationGrid");

if (grid) {
  const observer = new MutationObserver(assignThematicVariants);
  observer.observe(grid, { childList: true, subtree: true });
  document.addEventListener("formula-theme-change", assignThematicVariants);
  window.addEventListener("resize", assignThematicVariants);
  assignThematicVariants();
}

function assignThematicVariants() {
  const cards = [...document.querySelectorAll(".equation-card")];
  cards.forEach((card, index) => {
    const title = card.querySelector("h3")?.textContent || String(index);
    const hash = stableHash(`${title}-${index}`);
    card.dataset.board = BOARDS[hash % BOARDS.length];
    card.dataset.marker = MARKERS[(hash >> 2) % MARKERS.length];
    card.dataset.note = NOTES[(hash >> 4) % NOTES.length];
    card.style.setProperty("--card-tilt", TILTS[(hash >> 6) % TILTS.length]);
  });
}

function stableHash(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
