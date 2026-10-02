# Derivación

Si el retorno simple del horizonte es normal, la pérdida L=−VR tiene media −Vμ y desviación Vσ. Su cuantil de nivel α es V(zασ−μ). La media de la cola normal por encima de ese cuantil da ES=V[σφ(zα)/(1−α)−μ]. Un VaR negativo es un cuantil de ganancia en esa convención, no un motivo para imponer cero sin explicarlo. La cola restante puede contener pérdidas mucho mayores.

## Hipótesis necesarias

Un único horizonte, retorno normal simple, posición lineal y parámetros hipotéticos fijos. No aplicar mecánicamente a opciones, retornos con colas pesadas o posiciones no lineales. VaR no es pérdida máxima ni limita la pérdida condicional. No se usa una anualización √tiempo sin justificar dependencia y horizonte.

## Comprueba con números

VaR de una cartera hipotética con retorno simple normal en un único horizonte. La pérdida monetaria es −V·R; se muestran cuantil VaR y media de la cola ES bajo esa misma hipótesis. Calcula var paramétrico con los datos iniciales en u.m.. VaR paramétrico=22,8971 u.m.. VaRα=V(zα σ−μ); retornos en fracción, no porcentaje bruto.
