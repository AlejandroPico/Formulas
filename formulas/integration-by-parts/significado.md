# Significado

La integración por partes es la regla del producto escrita al revés. Si al derivar un producto aparece `d(uv)=u dv+v du`, entonces al integrar se obtiene una relación entre esas dos áreas diferenciales:

`∫u dv = uv − ∫v du`.

La fórmula permite cambiar una integral difícil por otra potencialmente más sencilla. La elección de `u` y `dv` es la parte estratégica: conviene escoger como `u` una función que se simplifique al derivar, y como `dv` una parte que pueda integrarse sin complicarse.

Geométricamente, puede interpretarse como una descomposición de un rectángulo variable. El producto `uv` representa un área total; las dos integrales `∫u dv` y `∫v du` representan formas complementarias de acumular los incrementos de esa área.

El simulador muestra esta intuición mediante bloques de área: una parte asociada a `u dv` y otra a `v du`, ambas relacionadas por el rectángulo `uv`.