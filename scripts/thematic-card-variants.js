const BOARDS = [
  { id: "green", surface: "#153c31", text: "#fbf4df" },
  { id: "blue", surface: "#102f46", text: "#fbf4df" },
  { id: "black", surface: "#242527", text: "#fbf4df" },
  { id: "green", surface: "#153c31", text: "#fbf4df" },
  { id: "blue", surface: "#102f46", text: "#fbf4df" }
];

const MARKERS = [
  { id: "blue", color: "#1f63c7" },
  { id: "green", color: "#14885f" },
  { id: "red", color: "#c4314b" },
  { id: "teal", color: "#087c87" },
  { id: "violet", color: "#7650b4" },
  { id: "orange", color: "#b35b14" },
  { id: "brown", color: "#7f5638" },
  { id: "indigo", color: "#3d58b8" },
  { id: "emerald", color: "#0f7b53" },
  { id: "black", color: "#1d252a" }
];

const NOTES = [
  ["butter", "#fff2a4"], ["lemon", "#fff7bf"], ["cream", "#fff1cf"], ["vanilla", "#fff6dc"], ["sand", "#eadfbe"],
  ["oat", "#eee3cc"], ["linen", "#f5ead7"], ["wheat", "#f4dda6"], ["honey", "#ffe0a3"], ["apricot", "#ffd7a8"],
  ["peach", "#ffd8aa"], ["melon", "#ffe1c7"], ["coral", "#ffd0c4"], ["salmon", "#ffc1b5"], ["rose", "#ffd7ec"],
  ["blush", "#ffe3ed"], ["pink", "#ffd8f1"], ["orchid", "#efd8ff"], ["lavender", "#e6ddff"], ["lilac", "#ddd8ff"],
  ["periwinkle", "#d7e0ff"], ["sky", "#d3ecff"], ["ice", "#e2f5ff"], ["blue", "#b9dcff"], ["powder", "#cfe7ff"],
  ["aqua", "#c6f3f0"], ["cyan", "#d5fbff"], ["mint", "#d6f5dc"], ["seafoam", "#c9f1df"], ["green", "#d9f5c8"],
  ["sage", "#cbd8bd"], ["olive", "#dce0a9"], ["pistachio", "#edf4c2"], ["lime", "#ecf8b8"], ["spring", "#dff7cf"],
  ["fog", "#dfe6e8"], ["mist", "#edf2f3"], ["chalk", "#f4f1df"], ["paper", "#fffaf0"], ["clay", "#e9b9a5"],
  ["terracotta", "#efc1a7"], ["cedar", "#e6c5ad"], ["coffee", "#dcc8ad"], ["mauve", "#ead6df"], ["plum-light", "#e1d1ea"],
  ["grape", "#d8c7ef"], ["azure", "#c8e4ff"], ["teal-light", "#c8eee9"], ["fern", "#d2e6bd"], ["pearl", "#f0eee9"]
].map(([id, surface]) => ({ id, surface, text: "#2d2a1f" }));

const TILTS = ["-.7deg", ".45deg", "-.25deg", ".65deg", "-.45deg", ".2deg", "-.12deg", ".35deg"];

const grid = document.querySelector("#equationGrid");

if (grid) {
  const observer = new MutationObserver(assignThematicVariants);
  observer.observe(grid, { childList: true, subtree: true });
  document.addEventListener("formula-theme-change", assignThematicVariants);
  document.addEventListener("click", event => {
    const card = event.target.closest?.(".equation-card");
    if (card) setActiveCardStyle(card);
  }, true);
  document.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest?.(".equation-card");
    if (card) setActiveCardStyle(card);
  }, true);
  window.addEventListener("resize", assignThematicVariants);
  assignThematicVariants();
}

function assignThematicVariants() {
  const cards = [...document.querySelectorAll(".equation-card")];
  cards.forEach((card, index) => {
    const title = card.querySelector("h3")?.textContent || String(index);
    const hash = stableHash(`${title}-${index}`);
    const board = BOARDS[hash % BOARDS.length];
    const marker = MARKERS[(hash >> 2) % MARKERS.length];
    const note = NOTES[(hash >> 4) % NOTES.length];

    card.dataset.board = board.id;
    card.dataset.marker = marker.id;
    card.dataset.note = note.id;
    card.style.setProperty("--board-surface", board.surface);
    card.style.setProperty("--board-text", board.text);
    card.style.setProperty("--marker-color", marker.color);
    card.style.setProperty("--note-surface", note.surface);
    card.style.setProperty("--note-text", note.text);
    card.style.setProperty("--card-tilt", TILTS[(hash >> 6) % TILTS.length]);
  });
}

function setActiveCardStyle(card) {
  const body = document.body;
  body.dataset.activeBoard = card.dataset.board || "green";
  body.dataset.activeNote = card.dataset.note || "butter";
  body.dataset.activeMarker = card.dataset.marker || "blue";
  body.style.setProperty("--active-board-surface", getCardVar(card, "--board-surface", "#153c31"));
  body.style.setProperty("--active-board-text", getCardVar(card, "--board-text", "#fbf4df"));
  body.style.setProperty("--active-note-surface", getCardVar(card, "--note-surface", "#fff2a4"));
  body.style.setProperty("--active-note-text", getCardVar(card, "--note-text", "#2d2a1f"));
  body.style.setProperty("--active-marker-color", getCardVar(card, "--marker-color", "#1f63c7"));
}

function getCardVar(card, name, fallback) {
  return card.style.getPropertyValue(name).trim() || getComputedStyle(card).getPropertyValue(name).trim() || fallback;
}

function stableHash(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
