# Derivación

El ejemplo más sencillo toma:

`-y''=λy`, con `y(0)=0` y `y(1)=0`.

Si `λ>0`, escribimos `λ=μ²`. La ecuación queda:

`y''+μ²y=0`.

La solución general es:

`y(x)=A sin(μx)+B cos(μx)`.

La condición `y(0)=0` obliga a `B=0`. La condición `y(1)=0` exige:

`A sin(μ)=0`.

Para una solución no trivial, `A≠0`, por lo que `sin(μ)=0`. Entonces `μ=nπ`, con `n=1,2,3,...`.

Así se obtienen las autofunciones y autovalores:

`y_n(x)=sin(nπx)`

`λ_n=n²π²`.

Cada modo tiene una frecuencia espacial mayor que el anterior y añade nodos internos. Esta estructura discreta aparece porque las condiciones de contorno solo permiten ciertas formas compatibles.