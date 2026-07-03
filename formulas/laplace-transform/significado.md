# Significado

La transformada de Laplace convierte una función temporal `f(t)` en una nueva función `F(s)`. La operación no mira la señal de forma uniforme: la pesa con el factor exponencial `e^{-st}`. Ese factor actúa como una ventana de decaimiento: para valores grandes de `s`, los tiempos lejanos pesan muy poco; para valores pequeños de `s`, la cola temporal conserva más influencia.

Intuitivamente, `F(s)` mide cuánta área queda de la señal cuando se observa bajo un filtro exponencial. Por eso, en el simulador se usa el caso básico `f(t)=1`: la transformada se reduce al área bajo `e^{-st}`, que vale `1/s` cuando `s>0`.

Su gran potencia aparece en ecuaciones diferenciales. Muchas operaciones difíciles en el tiempo, como derivar, integrar o convolucionar, se convierten en operaciones algebraicas en el dominio de Laplace. Esto permite resolver sistemas dinámicos, circuitos, vibraciones, modelos de control o respuestas transitorias de una forma mucho más estructurada.

La lectura conceptual es: el tiempo describe la evolución; Laplace describe cómo esa evolución responde a distintas escalas de amortiguamiento o frecuencia compleja.