# Derivación

Dibuja un radio con longitud r y ángulo θ. Sus proyecciones sobre los ejes son r cosθ y r sinθ. Al sumar sus cuadrados y usar cos²θ+sin²θ=1, obtienes x²+y²=r². Toma la raíz no negativa para recuperar r. La razón y/x pierde información de cuadrante y falla en x=0: por eso se usa atan2(y,x). La equivalencia angular se expresa módulo una vuelta, con una rama principal elegida por la función.

## Comprobación

r=5 y θ=90° representan (0,5); r=5 y θ=180° representan (−5,0). En el origen r=0, todos los ángulos representan (0,0), así que no existe una dirección geométrica única.

Comprueba las hipótesis antes de trasladar el resultado a otro sistema: Plano euclídeo con origen y eje de referencia fijados. r≥0; atan2 describe la dirección solo para r>0. El ángulo es periódico.
