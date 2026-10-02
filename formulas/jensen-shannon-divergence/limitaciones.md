# Limitaciones

Dos distribuciones normalizadas del mismo espacio, pesos iguales y base dos. Cambiar pesos o número de fuentes cambia la cota y la interpretación. El ejemplo binario evita singularidades de soporte con controles interiores, pero la mezcla permite en general probabilidades cero mediante límites correctos.

La mezcla media m incorpora el soporte de ambas fuentes. Promediar sus divergencias a m con pesos 1/2 genera una cantidad simétrica que se anula para distribuciones iguales. La cota de un bit corresponde a dos fuentes equiprobables con logaritmos base dos. No es el promedio directo de KL entre p y q. La raíz, no la divergencia sin raíz, satisface propiedades de una métrica.

JS se informa en bits por base dos; las KL internas con log natural se dividen por ln2. La raíz tiene escala raíz de bit en esta convención, por lo que no debe rotularse como otra cantidad de divergencia en bits. Ambos resultados son adimensionales matemáticamente.
