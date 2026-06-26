export const polishedEquations = [
  {
    id: "pythagorean-theorem",
    name: "Teorema de Pitágoras",
    author: "Tradición pitagórica",
    year: -500,
    field: "Geometría",
    level: "ESO",
    color: "#5d5af6",
    formula: [
      String.raw`a^2+b^2=c^2`,
      String.raw`c=\sqrt{a^2+b^2}`,
      String.raw`d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}`,
      String.raw`\lVert\mathbf{x}\rVert=\sqrt{x_1^2+x_2^2+\cdots+x_n^2}`
    ],
    summary: "Relaciona ortogonalidad, áreas, distancia euclídea y norma vectorial: la suma de los cuadrados de los catetos coincide con el cuadrado de la hipotenusa.",
    meaning: "En un triángulo rectángulo, los dos catetos son dimensiones independientes y perpendiculares. El cuadrado de la hipotenusa mide la combinación geométrica de esas dos direcciones. En coordenadas, la misma idea se convierte en distancia euclídea; en álgebra lineal, en norma de un vector; y en física, en la forma básica de muchas magnitudes resultantes por componentes ortogonales.",
    variables: [
      "a: cateto horizontal o primera componente perpendicular",
      "b: cateto vertical o segunda componente perpendicular",
      "c: hipotenusa o distancia resultante",
      "d: distancia entre dos puntos",
      "xᵢ: componentes de un vector",
      "√: raíz cuadrada, operación inversa de elevar al cuadrado",
      "²: exponente dos, cuadrado de una longitud o área asociada",
      "‖x‖: norma o longitud de un vector"
    ],
    history: "Resultado central de la geometría antigua, asociado a la tradición pitagórica, pero con antecedentes prácticos en Babilonia, Egipto, India y China. En la matemática griega pasó de regla de cálculo a teorema demostrable, y desde Euclides se convirtió en una pieza estructural de la geometría deductiva.",
    uses: ["Geometría", "Topografía", "Gráficos", "Distancias", "Álgebra lineal", "Física vectorial", "Informática gráfica"],
    derivation: "Una demostración clásica compara áreas construidas sobre los lados de un triángulo rectángulo. Otra deriva del producto escalar: si dos vectores son perpendiculares, el cuadrado de la norma de su suma es la suma de los cuadrados de sus normas.",
    simulation: "pythagorean"
  }
];
