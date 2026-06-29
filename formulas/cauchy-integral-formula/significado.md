# Significado

La Fórmula Integral de Cauchy es uno de los resultados más sorprendentes del análisis complejo. Afirma que, si una función es holomorfa dentro de un contorno cerrado y sobre él, entonces el valor de la función en un punto interior puede recuperarse usando solo los valores de la función sobre la frontera.

La fórmula tiene una interpretación potente: en análisis complejo, la información del interior queda codificada en el borde. Esto no ocurre en el cálculo real ordinario con la misma fuerza. Una función holomorfa no puede comportarse de manera arbitraria dentro de una región si ya se conocen sus valores alrededor.

El denominador `z-z0` introduce un polo simple en el punto que se quiere evaluar. Si `z0` está dentro del contorno, la integral detecta ese punto y devuelve `f(z0)`. Si `z0` queda fuera, el integrando es holomorfo en el interior y la integral se anula.

El simulador muestra exactamente esa diferencia: al arrastrar el punto dentro del contorno, la integral normalizada reproduce el valor de la función elegida. Al moverlo fuera, deja de haber singularidad encerrada y el resultado cae a cero.
