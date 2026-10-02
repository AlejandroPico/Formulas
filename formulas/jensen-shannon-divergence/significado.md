# Significado

Jensen-Shannon con pesos iguales y logaritmos base dos. La mezcla m=(p+q)/2 garantiza soporte compatible; su raíz sí es una distancia.

## Qué conserva y qué cambia

La mezcla media m incorpora el soporte de ambas fuentes. Promediar sus divergencias a m con pesos 1/2 genera una cantidad simétrica que se anula para distribuciones iguales. La cota de un bit corresponde a dos fuentes equiprobables con logaritmos base dos. No es el promedio directo de KL entre p y q. La raíz, no la divergencia sin raíz, satisface propiedades de una métrica.

## Primera predicción

Jensen-Shannon con pesos iguales y logaritmos base dos. La mezcla m=(p+q)/2 garantiza soporte compatible; su raíz sí es una distancia. Calcula divergencia js con los datos iniciales en bits. Divergencia JS=0,2781 bits. JS=[DKL(p||m)+DKL(q||m)]/(2ln2).
