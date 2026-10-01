# Coordenadas polares

Una distancia y una dirección sitúan el mismo punto que dos coordenadas cartesianas.

## Magnitudes

| Símbolo | Lectura |
| :-- | :-- |
| x | Coordenada horizontal cartesiana. |
| y | Coordenada vertical cartesiana. |
| r | Radio no negativo: distancia al origen. |
| θ | Ángulo medido desde el eje x positivo, con sentido antihorario positivo. |

## Cuándo se aplica

Plano euclídeo con origen y eje de referencia fijados. r≥0; atan2 describe la dirección solo para r>0. El ángulo es periódico.

## Evita estos errores

Usar arctan(y/x) sin cuadrante; intercambiar los argumentos de atan2; tratar r² como distancia; asignar al origen una dirección única.

## Laboratorio

**Balizas · Explorar · Cuadrantes**

Arrastra la baliza. El radio mide distancia y el ángulo marca dirección desde el eje x positivo.

Compara la coordenada angular elegida con atan2(y,x), que conserva el cuadrante. En el origen la dirección no está definida.
