# Significado

Diodo ideal Shockley con corriente de saturación Is en µA, n entre 1 y 2 y temperatura kelvin. Sin resistencia serie ni ruptura inversa.

## Qué conserva y qué cambia

Shockley expresa la corriente ideal como diferencia entre transporte exponencial directo y corriente de saturación. El exponente compara voltaje con nVT. En V=0 la diferencia es cero; en inversa suficientemente grande, I tiende a −Is. VT=kBT/q depende de kelvin. Se emplea expm1 para conservar precisión cerca de cero. La curvatura real también depende de cómo cambia Is con temperatura, omitido aquí de forma explícita.

## Primera predicción

Diodo ideal Shockley con corriente de saturación Is en µA, n entre 1 y 2 y temperatura kelvin. Sin resistencia serie ni ruptura inversa. Calcula corriente con los datos iniciales en µA. Corriente=0,4685 µA. I=Is[exp(V/(nVT))−1], VT=kBT/q.
