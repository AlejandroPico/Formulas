export const state = {
  query: "",
  field: "Todas",
  level: "Todos",
  sort: "chronology",
  selectedEquationId: null
};

export function setState(patch) {
  Object.assign(state, patch);
}
