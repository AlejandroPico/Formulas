# Diez fórmulas revisadas · 1 de octubre de 2026

Se revisan todas las pestañas, los símbolos, las condiciones de validez y los simuladores de las diez fórmulas solicitadas. Se conservan las fechas de creación de Git. Cada fórmula recibe la revisión 1 y la versión 2 de su simulador en `formulas/revisions.json`; junto a Pitágoras hay 11 fórmulas revisadas de 282.

| Fórmula | Juego | Exploración y explicación visual |
| --- | --- | --- |
| Área del círculo | Jardines | Radio arrastrable; sectores que conservan área al reordenarse |
| Longitud de una circunferencia | Ruta | Rueda sin deslizar, vueltas fraccionarias y cotas con polígonos |
| Identidad pitagórica trigonométrica | Señales | Punto arrastrable, componentes con signo y ondas conectadas al ángulo |
| Identidades notables | Taller | Tres identidades, piezas de área y productos algebraicos con signo |
| Norma euclídea | Navegación | Escenas 2D y 3D, camino por ejes, diagonal y dirección unitaria |
| Suma de progresión aritmética | Gradas | Barras con signo, términos frente a acumulado y parejas de extremos |
| Suma de progresión geométrica | Cosecha | Sumas parciales, razones negativas, convergencia y resto exacto |
| Determinantes 2×2 y 3×3 | Taller | Área orientada, volumen 3D y contribuciones numéricas de Sarrus |
| Fórmula de Herón | Parcelas | Lados posibles, degeneración, altura y vértice arrastrable |
| Fórmula cuadrática | Dianas | Raíces, discriminante, vértice arrastrable y cambios de tipo de ecuación |

Cada juego tiene cuatro misiones con pistas, reintentos, puntuación y explicación del resultado. Hay retos de respuesta, de clasificación y de ajuste de la escena. Las tres opciones de cada laboratorio tienen la misma presencia visual; la activa se distingue con una base y un texto más marcado. Pitágoras recibe esa mejora de visibilidad sin sumar una nueva revisión de contenido.

## Correcciones de contenido y comportamiento

- Herón utiliza LaTeX real, distingue lados imposibles de una figura degenerada y calcula el área mediante la factorización ordenada de Kahan. No se transforma un radicando inválido en un área cero.
- La progresión geométrica contempla r = 0, r = 1, razones negativas, el criterio |r| < 1 y el caso trivial a₁ = 0. El acumulado finito utiliza suma compensada en el rango del laboratorio.
- La cuadrática conserva los coeficientes introducidos: a = 0 genera una recta o un caso constante. Las raíces reales usan un cálculo estable y las complejas se presentan como conjugadas.
- El vector cero tiene norma cero, pero no dirección unitaria. Girar la cámara 3D no altera coordenadas ni norma.
- La geometría de determinantes usa las columnas de la matriz; el valor absoluto es el área o volumen, mientras que el signo expresa orientación. Se corrige la fecha histórica incorrecta de −200 a 1683, con la referencia de MacTutor sobre Seki.
- Las identidades notables distinguen los dominios de sus construcciones geométricas y los cálculos algebraicos con valores negativos. No se dibujan longitudes negativas como áreas literales.
- Las dos derivaciones aritméticas tienen funciones distintas y pestañas distintas. El cargador genera identificadores únicos aunque dos nombres de archivo se normalicen igual.
- Los glosarios distinguen valores de función, exponentes, índices de componentes, tipo de norma, vectores completos y entradas de matrices. Los delimitadores altos de MathJax se reconocen como paréntesis.

## Arquitectura y carga

Cada fórmula conserva sus archivos de texto y su punto de entrada en su carpeta. Las diez comparten un motor pequeño en `formulas/shared/learning-lab.js`, cálculos puros en `learning-math.js`, escenas en `learning-draw.js` y misiones en `learning-configs.js`. Se importa únicamente al abrir Simulación. Las escenas 3D proyectan coordenadas tridimensionales sobre canvas y permiten girar la cámara, sin añadir una biblioteca gráfica pesada.

El dibujo se actualiza por cambios de controles, arrastre, tamaño o tema. Las animaciones duran un tiempo limitado. Al salir se liberan eventos, observadores y fotogramas pendientes. Durante un arrastre se conserva la escala hasta soltar, para que el ajuste automático del dibujo no cambie el significado del gesto.

La caché del service worker pasa a la versión 3 para evitar servir versiones anteriores de los módulos y estilos. El modo sin conexión conserva los recursos que ya se han visitado; la primera visita necesita conexión.

## Comprobaciones

- `node tools/check-atlas.mjs`: inventario de 282 entradas, procedencia de fechas, archivos e índices, Pitágoras y los cálculos de las diez fórmulas.
- `node tools/check-learning-labs.mjs`: 4.104 casos de progresiones, identidades con signos, normas, determinantes comparados con una expansión independiente, áreas verificadas con base y altura, raíces por sustitución y las respuestas de las 40 misiones.
- `node tools/check-learning-browser.mjs`: todas las pestañas, símbolos con ratón y foco, 40 misiones, respuestas incorrectas, pistas, controles, casos especiales, tres modos en móvil y limpieza al salir durante una animación.
- `node tools/check-learning-inputs.mjs`: arrastre de radio, ángulo, vértice de triángulo y vértice de parábola; teclado; giro 3D con eventos táctiles reales.
- `node tools/check-learning-offline.mjs`: recarga sin conexión, resolución de una misión y apertura de la demostración después de almacenar sus recursos.
- `node tools/check-browser.mjs`: regresión de la carga por lotes, búsqueda, Pitágoras, inventario de revisiones, móvil, importación de los 282 simuladores y representación de todas las expresiones con MathJax.

Las capturas y los informes se guardan en `artifacts/`, que está excluido de Git. Las fuentes históricas están enlazadas en la pestaña Historia de cada fórmula. Las 271 fórmulas restantes siguen pendientes de revisión completa.
