# Derivación

La diferencia entre objetivo y Q anterior es el error temporal; multiplicar por α y sumar produce el nuevo Q. SARSA usa el par siguiente s′,a′ efectivamente elegido por la política de comportamiento. La pestaña comparativa calcula los dos objetivos con los mismos números; activar terminal elimina todo término futuro.

## Hipótesis necesarias

Es una sola transición educativa; no certifica convergencia. Una tarea terminal no hace bootstrap. Los resultados generales de convergencia exigen exploración, condiciones de pasos y otras hipótesis. En SARSA la política de comportamiento determina el objetivo; Q-learning es fuera de política.

## Comprueba con números

Una transición observada con dos valores siguientes. Se modifica una estimación Q; no se presenta una transición aislada como entrenamiento completo. Calcula nuevo valor q con los datos iniciales. Nuevo valor Q=-0,4 . Q←Q+α[r+γQ(s′,a′)−Q]; terminal elimina continuación.
