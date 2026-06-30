# Significado

La divergencia de Kullback-Leibler mide cuánto se pierde al representar una distribución real `P` mediante una distribución aproximada `Q`.

No es una distancia simétrica: cambiar el orden de `P` y `Q` puede dar otro valor. Por eso se escribe `D_KL(P||Q)` y no debe interpretarse como una distancia euclídea.

Si `P` y `Q` coinciden, la divergencia es cero. Si se separan, aumenta la penalización informativa.

El simulador compara dos campanas: `P` queda fija y `Q` se desplaza. La lectura muestra cómo la divergencia crece al separar la aproximación de la distribución objetivo.
