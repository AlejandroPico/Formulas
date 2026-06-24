import { normalizeText } from "./utils.js";

const levelOrder = {
  "ESO": 0,
  "Bachillerato": 1,
  "Universidad inicial": 2,
  "Universidad": 3,
  "Avanzado": 4
};

export function filterEquations(equations, state) {
  const query = normalizeText(state.query);

  return equations
    .filter((eq) => state.field === "Todas" || eq.field === state.field)
    .filter((eq) => state.level === "Todos" || eq.level === state.level)
    .filter((eq) => {
      if (!query) return true;
      const haystack = normalizeText([
        eq.name,
        eq.author,
        eq.field,
        eq.level,
        eq.summary,
        eq.meaning,
        eq.formula,
        ...(eq.uses ?? []),
        ...(eq.variables ?? [])
      ].join(" "));
      return haystack.includes(query);
    })
    .sort((a, b) => sortEquations(a, b, state.sort));
}

function sortEquations(a, b, sort) {
  if (sort === "name") return a.name.localeCompare(b.name, "es");
  if (sort === "field") return a.field.localeCompare(b.field, "es") || a.year - b.year;
  if (sort === "level") return (levelOrder[a.level] ?? 99) - (levelOrder[b.level] ?? 99) || a.year - b.year;
  return a.year - b.year;
}
