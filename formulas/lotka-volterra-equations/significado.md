# Significado

Las ecuaciones de Lotka-Volterra modelan la interacción entre una población de presas `x` y una población de depredadores `y`.

Las presas crecen por reproducción natural, pero disminuyen cuando se encuentran con depredadores. Los depredadores, por su parte, aumentan cuando hay encuentros con presas y disminuyen por mortalidad natural.

El producto `xy` representa encuentros entre ambas especies. Por eso aparece con signo negativo en la ecuación de presas y con signo positivo en la ecuación de depredadores.

El simulador integra numéricamente las ecuaciones y muestra las oscilaciones temporales de ambas poblaciones. Al aumentar `beta`, los depredadores cazan con más eficacia y modifican la amplitud y el desfase del ciclo.
