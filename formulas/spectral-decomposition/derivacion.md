# Derivacion

Si `A` es una matriz simetrica real, sus autovectores pueden elegirse ortonormales. Colocamos esos autovectores como columnas de una matriz `Q` y los autovalores en una matriz diagonal `Lambda`.

Entonces la accion de `A` sobre cada autovector cumple:

`A v_i = lambda_i v_i`.

Agrupando todas esas relaciones:

`A Q = Q Lambda`.

Multiplicando a la derecha por `Q^T`, y usando que `Q^T Q = I`, obtenemos:

`A = Q Lambda Q^T`.

De forma equivalente:

`A = sum lambda_i v_i v_i^T`.

Cada matriz `v_i v_i^T` representa una proyeccion sobre la direccion propia `v_i`.
