# Significado

La integral de Gauss afirma que el área total bajo la curva `e^{-x²}` en toda la recta real es exactamente `√π`:

`∫₋∞∞ e^{-x²}dx=√π`.

La identidad es sorprendente porque la función `e^{-x²}` no tiene una primitiva elemental expresable con las funciones habituales. Aun así, su área total sí tiene un valor cerrado y muy limpio. Esta separación entre “no puedo escribir una primitiva simple” y “sí puedo conocer el área total” es una de las primeras grandes lecciones del análisis.

La curva tiene forma de campana: es positiva, simétrica respecto del eje vertical, alcanza su máximo en `x=0` y decrece muy rápido cuando `|x|` aumenta. Por eso, en el simulador, al ampliar el intervalo `[-b,b]`, el área acumulada se acerca rápidamente a `√π`.

Esta integral es el corazón matemático de la distribución normal. Al normalizar la campana se obtiene la densidad gaussiana, fundamental en estadística, errores de medida, difusión, mecánica estadística, procesamiento de señales y aprendizaje automático.