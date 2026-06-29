# Significado

La ecuacion del calor describe como se reparte la temperatura en un medio cuando existe conduccion termica. Si una zona esta mas caliente que sus vecinas, el calor tiende a difundirse hacia regiones mas frias hasta suavizar el perfil.

La cantidad `u(x,t)` representa la temperatura en la posicion `x` y en el instante `t`. La derivada temporal indica como cambia esa temperatura. La segunda derivada espacial mide la curvatura del perfil: un pico estrecho de calor tiene mucha curvatura y se suaviza rapidamente.

El parametro `alpha` es la difusividad termica. Un valor alto indica que el material reparte el calor con rapidez. Un valor bajo indica que el calor permanece mas localizado durante mas tiempo.

El simulador representa una barra unidimensional. Al hacer clic o arrastrar se inyecta calor local. La curva muestra la temperatura y la barra de color muestra el mismo perfil como mapa termico. La difusividad controla la velocidad de aplanamiento del perfil.
