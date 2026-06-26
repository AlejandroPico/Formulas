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
    meaning: "El teorema afirma que, en un triángulo rectángulo, las dos direcciones perpendiculares pueden combinarse mediante suma de cuadrados. No dice simplemente que c sea la suma de a y b: dice que la superficie del cuadrado construido sobre la hipotenusa equivale a la suma de las superficies de los cuadrados construidos sobre los catetos. Esa diferencia es esencial. Cuando dos desplazamientos son perpendiculares, no se suman como longitudes lineales, sino como contribuciones cuadráticas independientes. Por eso la hipotenusa siempre es menor que a+b, pero mayor que cualquiera de los dos catetos por separado. En lenguaje moderno, el teorema define la distancia euclídea: la longitud de un vector se obtiene combinando sus componentes ortogonales mediante la raíz de la suma de cuadrados. En dos dimensiones aparece como distancia en el plano; en tres dimensiones, como longitud espacial; y en dimensión n, como norma vectorial. La misma estructura aparece en gráficos por ordenador, navegación, física, estadística, aprendizaje automático y cualquier problema donde se midan distancias en coordenadas perpendiculares.",
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
    history: "El teorema de Pitágoras es uno de los resultados más antiguos y universales de la matemática. Su forma escolar se asocia a Pitágoras de Samos y a la tradición pitagórica del siglo VI a. C., pero la relación entre los lados de un triángulo rectángulo era conocida antes en contextos prácticos. La matemática babilónica ya manejaba ternas pitagóricas muchos siglos antes de la matemática griega clásica, y la tablilla Plimpton 322 suele citarse como uno de los testimonios más famosos de esa tradición. También hay indicios de usos geométricos relacionados en Egipto, India y China. La diferencia decisiva es que, en la cultura griega, el resultado se integró en un sistema deductivo: dejó de ser una regla útil para construir o medir y pasó a ser un teorema demostrable. En los Elementos de Euclides, el resultado aparece formulado geométricamente mediante áreas: el cuadrado construido sobre la hipotenusa equivale a la suma de los cuadrados construidos sobre los catetos. Esa formulación explica por qué el teorema se presta tan bien a demostraciones visuales, recortes, recomposiciones y argumentos de equivalencia de áreas. La tradición pitagórica, además, vinculaba número, proporción, música y cosmos; por eso una relación exacta entre longitudes no era solo una herramienta técnica, sino una señal de orden racional. Paradójicamente, el propio teorema conduce a uno de los grandes choques conceptuales de esa tradición: la diagonal de un cuadrado de lado 1 mide √2, una magnitud inconmensurable que no puede expresarse como razón de enteros. Así, el teorema no solo enseña a calcular distancias: también marca el paso desde la aritmética práctica hacia la demostración, la geometría deductiva y la reflexión sobre qué significa medir.",
    uses: ["Geometría", "Topografía", "Gráficos", "Distancias", "Álgebra lineal", "Física vectorial", "Informática gráfica"],
    useDetails: [
      {
        title: "Geometría",
        text: "En geometría plana se usa para calcular lados desconocidos de triángulos rectángulos, comprobar si un triángulo es rectángulo y relacionar áreas construidas sobre los lados. Por ejemplo, si los catetos miden 3 y 4, la hipotenusa mide 5 porque 3²+4²=25. También permite construir demostraciones visuales mediante cuadrados y entender por qué la perpendicularidad cambia la manera de sumar longitudes."
      },
      {
        title: "Topografía",
        text: "En topografía y medición de terrenos permite obtener distancias inaccesibles a partir de desplazamientos perpendiculares medibles. Si se avanza cierta distancia hacia el este y otra hacia el norte, la distancia directa entre origen y destino se calcula con la raíz de la suma de cuadrados. Esta idea está detrás de triangulaciones elementales, replanteos de obra y comprobaciones de ángulos rectos en campo."
      },
      {
        title: "Gráficos e informática gráfica",
        text: "En gráficos por ordenador se usa para calcular distancias entre puntos, radios de colisión, longitudes de vectores, normales y desplazamientos en pantalla. Cuando un objeto se mueve en horizontal y vertical a la vez, su velocidad real no es la suma simple de ambos movimientos: se obtiene mediante la norma euclídea. Por eso el teorema aparece continuamente en motores 2D y 3D."
      },
      {
        title: "Distancias y coordenadas",
        text: "La fórmula de distancia entre dos puntos del plano es una aplicación directa: se restan las coordenadas para formar dos catetos y se calcula la hipotenusa. Esta versión permite medir distancias en mapas, interfaces, navegación, geometría analítica y análisis de datos. La extensión a más dimensiones produce la norma euclídea de un vector."
      },
      {
        title: "Álgebra lineal",
        text: "En álgebra lineal el teorema se expresa como una propiedad de vectores ortogonales: si dos vectores son perpendiculares, el cuadrado de la norma de su suma es la suma de los cuadrados de sus normas. Esta idea conecta con producto escalar, proyecciones, bases ortonormales y descomposición de señales o datos en componentes independientes."
      },
      {
        title: "Física vectorial",
        text: "En física aparece al combinar componentes perpendiculares de desplazamientos, velocidades, aceleraciones o fuerzas. Si una fuerza tiene componente horizontal y vertical, su módulo se calcula con Pitágoras. Lo mismo ocurre con la velocidad resultante de un móvil, el campo eléctrico resultante por componentes o la descomposición de movimientos en ejes ortogonales."
      },
      {
        title: "Informática y análisis de datos",
        text: "En programación y ciencia de datos se usa para medir proximidad entre puntos. La distancia euclídea permite comparar vectores de características, detectar vecinos cercanos, calcular errores geométricos y normalizar magnitudes. Aunque en espacios muy grandes se usan también otras métricas, Pitágoras sigue siendo la base conceptual de la distancia ordinaria."
      }
    ],
    derivation: "Una derivación visual clásica parte de un cuadrado grande de lado a+b. Dentro se colocan cuatro triángulos rectángulos congruentes, cada uno con catetos a y b e hipotenusa c. Si esos cuatro triángulos se ordenan dejando en el centro un cuadrado de lado c, el área total es 4·(ab/2)+c². Si se reordenan los mismos cuatro triángulos dentro del mismo cuadrado grande, el espacio restante se separa en dos cuadrados de áreas a² y b². Como el cuadrado grande y los cuatro triángulos son exactamente los mismos en ambas configuraciones, las áreas sobrantes deben ser iguales. Por tanto, c²=a²+b². Esta demostración es potente porque no depende de números concretos: funciona para cualquier triángulo rectángulo. En formulación vectorial, si u y v son perpendiculares, entonces (u+v)·(u+v)=u·u+2u·v+v·v. Como u·v=0 por ortogonalidad, queda ‖u+v‖²=‖u‖²+‖v‖². Esa es la versión moderna del mismo principio.",
    simulation: "pythagorean"
  }
];
