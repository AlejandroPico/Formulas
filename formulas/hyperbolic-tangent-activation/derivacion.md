# Derivación

Deriva el cociente de exponenciales y simplifica para obtener 1−tanh²z. En z=0 la derivada vale uno. En z=wx+b aplica la regla de la cadena: dy/dx=w(1−y²), que puede ser negativa si w<0. La implementación usa Math.tanh en lugar de evaluar exponenciales grandes de forma inestable.

## Comprueba el resultado

¿Cuánto vale tanh(0)? El numerador e⁰−e⁰ se anula.

Argumentos reales y adimensionales. Saturación no equivale a un corte discontinuo; para valores finitos la función matemática sigue dentro del intervalo abierto (−1,1), aunque el redondeo pueda dar ±1.
