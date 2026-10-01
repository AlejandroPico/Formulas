# Tercera revisión · 1 de octubre de 2026

Quince fórmulas reciben una revisión completa de contenido, notación, glosarios y simuladores. Cada laboratorio tiene cuatro misiones, pistas, reintentos, puntuación y tres modos igualmente visibles. Se conservan las pestañas adicionales de Viète y tensión plana, con contenido específico actualizado.

| Fórmula | Juego | Exploración y demostración |
| :-- | :-- | :-- |
| Ley de los cosenos | Rescate | Vértice arrastrable y proyección con signo |
| Ley de los senos | Balizas | Circunferencia y cero, una o dos soluciones SSA |
| Ley de tangentes | Equilibrio | Diferencias normalizadas y semiángulos |
| Fórmulas de Viète | Cerraduras | Raíces arrastrables, escala y conjugadas complejas |
| Ángulo doble | Frecuencias | Radios y ondas de frecuencia doble |
| Suma de ángulos | Rumbos | Giros y dos contribuciones vectoriales |
| Movimiento armónico simple | Sintonía | Reproducción, fase, espacio de fases y energía |
| Péndulo pequeño | Relojes | Modelo lineal frente a trayectoria no lineal |
| Binomio de Newton | Combinaciones | Términos con signo y triángulo de Pascal |
| Teorema fundamental del cálculo | Depósitos | Integral orientada, rectángulos y secante |
| Regla de la cadena | Engranajes | Tres composiciones y sensibilidades locales |
| Regla del cociente | Razones | Polo, dominio y dos contribuciones con signo |
| Regla del producto | Superficies | Gráfico, bandas finitas y esquina de segundo orden |
| Ley de Hooke | Calibración | Fuerza restauradora, fuerza externa y trabajo |
| Hooke en tensión plana | Materiales | Malla afín y placa 3D con espesor variable |

## Precisión y límites

La ley de senos distingue las dos soluciones suplementarias, elimina ángulos que no dejan un tercer ángulo positivo y cuenta una sola vez la coincidencia en 90°. La ley de tangentes usa una forma válida para el caso isósceles. Las tangentes de suma y ángulo doble avisan cuando el resultado no está definido.

Viète admite raíces reales repetidas y pares conjugados. En móvil también se muestra el plano complejo. El binomio usa exponentes enteros no negativos y contempla n = 0, signos alternos y k fuera de la fila.

El oscilador armónico usa una solución analítica sin pérdidas. El péndulo compara la solución lineal con una trayectoria Runge–Kutta de la ecuación con seno, calculada en 4096 pasos por periodo y reutilizada para cada configuración. Su periodo no lineal se obtiene por media aritmético-geométrica, con una convención explícita para el parámetro de la integral elíptica. La gráfica de error calcula periodos directamente y no integra cientos de trayectorias por fotograma.

Las integrales conservan áreas negativas y límites invertidos. Las reglas de derivación comparan tangentes y secantes y mantienen el dominio del cociente. Las bandas del producto usan incrementos reales, incluidos sus términos de orden superior.

Hooke distingue fuerza del resorte y fuerza externa, y avisa fuera del rango lineal calibrado. La placa emplea tensión plana isotrópica, con σz = 0 pero εz generalmente no nula. El cortante ingenieril es γxy = 2εxy. E y las tensiones usan MPa. La amplificación afecta solo al dibujo y se limita si provocaría una inversión artificial de la malla. No se simulan plasticidad ni rotura.

## Carga y ciclo de vida

Los módulos `discovery-math.js`, `discovery-configs.js` y `discovery-draw.js` se cargan al abrir un simulador de esta tanda. No se añaden peticiones de simuladores al arranque. El motor común conserva estilos, accesibilidad y estado de juego, y acepta configuración y dibujo específicos sin alterar los diez laboratorios anteriores.

La reproducción avanza hasta 20 segundos y puede pausarse o reiniciarse. Se detiene al ocultar la página y se liberan fotogramas, eventos y observadores al cambiar de pestaña o cerrar. Los arrastres conservan su escala hasta soltar; la raíz seleccionada se mantiene aunque cruce la otra raíz.

La caché pasa a la versión 4 para renovar los recursos modificados. Los laboratorios visitados siguen funcionando sin conexión; la primera descarga necesita conexión.

## Comprobaciones y registro

- `check-discovery-labs.mjs`: 10 398 casos independientes, invariantes, energías, dominios, contenido y respuestas de las 60 misiones; se ejecuta también desde `check-atlas.mjs`.
- `check-discovery-browser.mjs`: quince fichas completas, símbolos con ratón y foco, sesenta misiones, casos especiales, tres modos en escritorio y móvil, reproducción y limpieza, giro 3D con ratón, teclado y eventos táctiles.
- `check-discovery-inputs.mjs`: arrastres reales de triángulo, raíces cruzadas, límite de integral, resorte y giro compuesto.
- Regresión de los diez laboratorios anteriores, Pitágoras, búsqueda, carga progresiva, inventario, las 282 importaciones de simuladores y todas las expresiones MathJax.
- Recarga y juego sin conexión, incluidos péndulo animado y giro de la placa 3D.

Cada entrada de revisión conserva su historial y registra fecha, alcance y versión 2 del simulador. Las fechas de creación se mantienen desde Git. Tras esta tanda quedan **26 fórmulas revisadas y 256 pendientes**, de un total de 282. Las fuentes se enlazan dentro de las fichas; capturas e informes de pruebas permanecen en `artifacts/`, excluido de Git.
