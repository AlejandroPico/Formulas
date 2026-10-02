# Derivación

Escalar cada población por su capacidad propia transforma el crecimiento logístico en r1x(1−x) y r2y(1−y). La competencia cruzada añade pérdidas r1αxy y r2βxy. Las nulclinas no triviales son x+αy=1 e y+βx=1. Resolver el sistema da la intersección escrita; solo representa coexistencia si ambas coordenadas son positivas. α,β<1 favorecen coexistencia estable; α,β>1 permiten un equilibrio interior inestable y dependencia de condiciones iniciales.

## Hipótesis necesarias

Dos especies y competencia no negativa, sin depredación ni mutación. αβ=1 exige analizar nulclinas paralelas o coincidentes, sin dividir por cero. Poblaciones normalizadas por capacidades diferentes; una intersección negativa es algebraica y no una población realizable. Integración RK4 de condiciones iniciales x0=0,4 e y0=0,6.

## Comprueba con números

Dos especies con crecimiento logístico y competencia cruzada, escaladas por sus capacidades propias. Las nulclinas muestran cuándo el equilibrio interior es físicamente admisible. Calcula tasa inicial de especie 1 con los datos iniciales. Tasa inicial de especie 1=0,12 . dx/dt=r1 x(1−x−αy), con x0=0,4,y0=0,6.
