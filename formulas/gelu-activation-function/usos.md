# Usos

La función de distribución normal estándar Φ convierte la entrada en un peso suave; multiplicar por x conserva signo, sin convertir la salida en probabilidad. Regla del producto da Φ+xφ. Para ciertos valores negativos la pendiente es negativa y la función no es monótona. El cálculo usa una aproximación numérica de Φ con error cercano a 10⁻⁷, no la fórmula aproximada tanh. En aplicaciones, verifica dimensión, máscara y procedencia de datos antes de trasladar el ejemplo a un modelo real.

## Del experimento al contexto

GELU exacta se define como xΦ(x) con Φ normal estándar. El cálculo numérico de Φ usa una aproximación de precisión cercana a 10⁻⁷, sin usar la variante tanh.

## Condiciones antes de aplicar

Definición xΦ(x), diferente de la aproximación tanh y de ReLU. La salida puede ser negativa y no está restringida entre cero y uno. El valor y la derivada mostrados son evaluaciones numéricas; la derivada usa la expresión de la función ideal.
