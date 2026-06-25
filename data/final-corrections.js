export const finalCorrections = [
  {
    id: "gauss-theorem",
    name: "Teorema de Gauss",
    author: "Carl Friedrich Gauss",
    year: 1835,
    field: "Cálculo vectorial",
    level: "Universidad",
    color: "#8cf0c8",
    formula: String.raw`\iiint_V \nabla\cdot\mathbf{F}\,dV=\iint_{\partial V}\mathbf{F}\cdot\mathbf{n}\,dS`,
    summary: "Convierte una integral de divergencia en flujo por la frontera.",
    meaning: "Lo que nace o muere dentro de un volumen se mide por el flujo neto que atraviesa su superficie.",
    variables: ["F: campo vectorial", "V: volumen", "∂V: frontera", "n: normal"],
    history: "Pilar del análisis vectorial y de la física de campos.",
    uses: ["Electromagnetismo", "Fluidos", "Geometría", "Conservación"],
    derivation: "Generaliza el teorema fundamental del cálculo a tres dimensiones.",
    simulation: "field"
  }
];
