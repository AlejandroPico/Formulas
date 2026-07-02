# Significado

La descomposicion espectral expresa una matriz simetrica como combinacion de sus direcciones propias. En vez de estudiar la matriz entrada por entrada, se separa su accion en ejes privilegiados.

Si los autovectores forman una base ortonormal, la matriz puede escribirse como `A=Q Lambda Q^T`, o como suma de proyecciones `lambda_i v_i v_i^T`.

Cada termino espectral dice: proyecta sobre la direccion `v_i` y escala por `lambda_i`. La matriz completa es la suma de esas acciones independientes.

El simulador reconstruye una matriz `2x2` simetrica a partir de dos autovalores y una rotacion de los autovectores.
