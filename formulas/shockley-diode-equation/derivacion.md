# Derivación

Shockley expresa la corriente ideal como diferencia entre transporte exponencial directo y corriente de saturación. El exponente compara voltaje con nVT. En V=0 la diferencia es cero; en inversa suficientemente grande, I tiende a −Is. VT=kBT/q depende de kelvin. Se emplea expm1 para conservar precisión cerca de cero. La curvatura real también depende de cómo cambia Is con temperatura, omitido aquí de forma explícita.

## Hipótesis necesarias

Modelo ideal sin resistencia serie, ruptura inversa ni alta inyección. n se controla entre 1 y 2; Is=0,01 µA se mantiene fijo. La temperatura cambia VT y no el material completo del diodo. V se define ánodo menos cátodo; signo positivo de I corresponde a corriente directa. No hay una discontinuidad física exacta a 0,7 V en esta ecuación.

## Comprueba con números

Diodo ideal Shockley con corriente de saturación Is en µA, n entre 1 y 2 y temperatura kelvin. Sin resistencia serie ni ruptura inversa. Calcula corriente con los datos iniciales en µA. Corriente=0,4685 µA. I=Is[exp(V/(nVT))−1], VT=kBT/q.
