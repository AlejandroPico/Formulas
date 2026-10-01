# Fórmula de Herón

**Entrada** · tres longitudes positivas a, b y c, en la misma unidad.

**Preparación** · s = (a+b+c)/2.

**Salida** · A = √[s(s−a)(s−b)(s−c)], raíz no negativa.

**Dominio** · el mayor lado es menor que la suma de los otros dos. La igualdad es degeneración; superar esa suma significa datos imposibles.

**Precisión** · un triángulo casi plano requiere atención al redondeo. El cálculo del simulador usa una factorización ordenada de los lados para reducir pérdida de precisión.

**Control** · (3,4,5) da 6; permutar lados conserva el área; duplicarlos multiplica el área por cuatro.
