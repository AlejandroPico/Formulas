# Limitaciones

Un único horizonte, retorno normal simple, posición lineal y parámetros hipotéticos fijos. No aplicar mecánicamente a opciones, retornos con colas pesadas o posiciones no lineales. VaR no es pérdida máxima ni limita la pérdida condicional. No se usa una anualización √tiempo sin justificar dependencia y horizonte.

Si el retorno simple del horizonte es normal, la pérdida L=−VR tiene media −Vμ y desviación Vσ. Su cuantil de nivel α es V(zασ−μ). La media de la cola normal por encima de ese cuantil da ES=V[σφ(zα)/(1−α)−μ]. Un VaR negativo es un cuantil de ganancia en esa convención, no un motivo para imponer cero sin explicarlo. La cola restante puede contener pérdidas mucho mayores.

μ y σ se introducen en porcentajes del mismo horizonte y se convierten a fracciones. V,L,VaR y ES en u.m. α es probabilidad de confianza, zα cuantil normal y φ densidad estándar adimensional. El eje de pérdida tiene signo positivo para pérdidas y negativo para ganancias.
