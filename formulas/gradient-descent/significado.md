# Significado

El descenso del gradiente es un método para minimizar una función de pérdida. En cada paso calcula la pendiente local y se mueve en sentido contrario.

La tasa de aprendizaje `eta` controla el tamaño de cada salto. Si es demasiado pequeña, el avance es lento. Si es demasiado grande, el algoritmo puede oscilar o divergir.

En aprendizaje automático, el mismo principio se aplica a muchos parámetros a la vez: pesos, sesgos y matrices completas.

El simulador muestra una parábola `L(w)=w²`. El punto rojo representa el peso actual. Al pulsar optimizar, el punto desciende hacia el mínimo global; con una tasa demasiado alta puede rebotar y salir de la zona estable.
