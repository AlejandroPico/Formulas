# Limitaciones

Definición xΦ(x), diferente de la aproximación tanh y de ReLU. La salida puede ser negativa y no está restringida entre cero y uno. El valor y la derivada mostrados son evaluaciones numéricas; la derivada usa la expresión de la función ideal.

La función de distribución normal estándar Φ convierte la entrada en un peso suave; multiplicar por x conserva signo, sin convertir la salida en probabilidad. Regla del producto da Φ+xφ. Para ciertos valores negativos la pendiente es negativa y la función no es monótona. El cálculo usa una aproximación numérica de Φ con error cercano a 10⁻⁷, no la fórmula aproximada tanh.

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
