# Significado

Las ecuaciones de Cauchy-Riemann son el criterio local que conecta una función compleja con dos funciones reales. Si se escribe `f(z)=u(x,y)+iv(x,y)`, la función compleja queda descompuesta en una parte real `u` y una parte imaginaria `v`. Las ecuaciones dicen que esas dos partes no pueden variar de cualquier manera: sus derivadas parciales deben estar sincronizadas.

La razón profunda es que la derivada compleja debe ser independiente de la dirección desde la que se calcula el incremento. En el plano real ordinario hay muchas direcciones posibles para acercarse a un punto. Si la función fuera solo una función de dos variables reales, cada dirección podría dar una razón de cambio distinta. En cambio, una función holomorfa exige una coherencia mucho más fuerte: acercarse horizontalmente, verticalmente o por cualquier dirección debe producir la misma derivada compleja.

Las dos igualdades fuerzan esa coherencia. La primera, `u_x=v_y`, conecta la variación horizontal de la parte real con la variación vertical de la parte imaginaria. La segunda, `u_y=-v_x`, conecta la variación vertical de la parte real con la variación horizontal de la parte imaginaria con signo opuesto. Cuando ambas se cumplen, y las derivadas tienen regularidad suficiente, la función es diferenciable en el sentido complejo.

Geométricamente, estas ecuaciones explican por qué las funciones holomorfas preservan ángulos localmente, salvo en puntos críticos. Ese comportamiento se llama conformidad. Por eso aparecen en mapas conformes, fluidos potenciales, electrostática bidimensional y transformaciones geométricas del plano complejo.
