# Significado

GELU exacta se define como xΦ(x) con Φ normal estándar. El cálculo numérico de Φ usa una aproximación de precisión cercana a 10⁻⁷, sin usar la variante tanh.

## Qué conserva y qué cambia

La función de distribución normal estándar Φ convierte la entrada en un peso suave; multiplicar por x conserva signo, sin convertir la salida en probabilidad. Regla del producto da Φ+xφ. Para ciertos valores negativos la pendiente es negativa y la función no es monótona. El cálculo usa una aproximación numérica de Φ con error cercano a 10⁻⁷, no la fórmula aproximada tanh.

## Primera predicción

GELU exacta se define como xΦ(x) con Φ normal estándar. El cálculo numérico de Φ usa una aproximación de precisión cercana a 10⁻⁷, sin usar la variante tanh. Calcula salida gelu con los datos iniciales. Salida GELU=0,8413 . GELU=xΦ(x); derivada=Φ(x)+xφ(x).
