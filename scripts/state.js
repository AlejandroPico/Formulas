export const state = {
  query: "",
  field: "Todas",
  level: "Todos",
  sort: "chronology",
  cardLabelMode: "none",
  formulaDisplay: "symbolic",
  showMigratedTitles: false,
  selectedEquationId: null
};

export function setState(patch) {
  Object.assign(state, patch);
}
