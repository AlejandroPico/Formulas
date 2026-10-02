# Significado

Una transición observada con dos valores siguientes. Se modifica una estimación Q; no se presenta una transición aislada como entrenamiento completo.

## Qué conserva y qué cambia

La diferencia entre objetivo y Q anterior es el error temporal; multiplicar por α y sumar produce el nuevo Q. SARSA usa el par siguiente s′,a′ efectivamente elegido por la política de comportamiento. La pestaña comparativa calcula los dos objetivos con los mismos números; activar terminal elimina todo término futuro.

## Primera predicción

Una transición observada con dos valores siguientes. Se modifica una estimación Q; no se presenta una transición aislada como entrenamiento completo. Calcula nuevo valor q con los datos iniciales. Nuevo valor Q=-0,4 . Q←Q+α[r+γQ(s′,a′)−Q]; terminal elimina continuación.
