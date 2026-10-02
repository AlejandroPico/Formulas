# Aprendizaje

## Tres formas de aprender

**Paisaje · Explorar · Memoria y pasos**

Optimización de F=(x²+κy²)/2, con gradientes exactos y memoria inicial cero. Los pasos son iteraciones reales del algoritmo seleccionado.

## Predice, prueba y justifica

1. **Predice antes de medir.** Optimización de F=(x²+κy²)/2, con gradientes exactos y memoria inicial cero. Los pasos son iteraciones reales del algoritmo seleccionado. Calcula pérdida tras los pasos con los datos iniciales.

2. **Construye el objetivo.** Ajusta tamaño de paso η hasta obtener pérdida tras los pasos=6,543 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora tamaño de paso η=0.2 . Calcula pérdida tras los pasos y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

Los hiperparámetros y el paisaje influyen en estabilidad y velocidad

η>0, β y β2 menores que uno, ε=10⁻⁸; operaciones componente a componente. La escala del paso y memoria afectan estabilidad y no garantizan descenso en cada iteración. Parámetros, gradientes y pérdida usan unidades reducidas; en RMSProp el control β de primera memoria no interviene.
