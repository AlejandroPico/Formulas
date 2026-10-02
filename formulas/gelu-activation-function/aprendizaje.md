# Aprendizaje

## Tres formas de aprender

**Activación · Explorar · Pendiente**

GELU exacta se define como xΦ(x) con Φ normal estándar. El cálculo numérico de Φ usa una aproximación de precisión cercana a 10⁻⁷, sin usar la variante tanh.

## Predice, prueba y justifica

1. **Predice antes de medir.** GELU exacta se define como xΦ(x) con Φ normal estándar. El cálculo numérico de Φ usa una aproximación de precisión cercana a 10⁻⁷, sin usar la variante tanh. Calcula salida gelu con los datos iniciales.

2. **Construye el objetivo.** Ajusta entrada x hasta obtener salida gelu=1,9545 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora entrada x=2 . Calcula salida gelu y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

GELU puede producir salidas negativas y su pendiente también puede ser negativa

Definición xΦ(x), diferente de la aproximación tanh y de ReLU. La salida puede ser negativa y no está restringida entre cero y uno. El valor y la derivada mostrados son evaluaciones numéricas; la derivada usa la expresión de la función ideal.
