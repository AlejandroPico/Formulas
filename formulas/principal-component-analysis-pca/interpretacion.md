# Interpretación

Datos numéricos, centrados y con varianza total positiva. PCA por covarianza depende de unidades y escala; estandarizar produce otro problema. Varianza alta no implica información útil, causalidad ni independencia. Ejes de un autovalor repetido no son únicos.

Resta las medias de cada variable. Para una dirección unitaria w, la varianza proyectada es wᵀCw. Optimizar con la restricción wᵀw=1 mediante un multiplicador de Lagrange produce Cw=λw; el máximo corresponde al mayor λ. La simetría de C permite ejes ortogonales. Proyectar y reconstruir con el primer eje deja un error cuadrático total normalizado por n−1 igual a λ2+λ3. La nube tiene ocho combinaciones de signos de tres escalas y una rotación; su covarianza se calcula de los puntos, no se dibujan ejes predeterminados.

Datos del laboratorio en unidades comunes arbitrarias; covarianzas y λ en unidades cuadradas; η adimensional, presentada como porcentaje. Se usa divisor 7 para ocho observaciones. Error de reconstrucción normalizado también divide entre 7.
