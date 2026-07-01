# Significado

La ecuación de Bellman expresa una idea recursiva: el valor de un estado combina la recompensa inmediata con el valor esperado de los estados futuros.

El factor `gamma` descuenta el futuro. Si `gamma` es bajo, el agente prioriza recompensas cercanas. Si es alto, las recompensas lejanas conservan más importancia.

En aprendizaje por refuerzo, esta relación permite propagar recompensas desde una meta hacia estados anteriores.

El simulador muestra una cadena de estados. La recompensa final se propaga hacia la izquierda multiplicándose por `gamma`, de modo que los estados más alejados reciben menor valor si el descuento es fuerte.
