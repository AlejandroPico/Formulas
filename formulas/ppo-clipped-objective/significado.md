# Significado

Un término de PPO con probabilidad antigua 0,5 y nueva 0,5r. La razón r cambia entre 0,2 y 1,8; ventaja firmada y ε positivo.

## Qué conserva y qué cambia

La razón compara probabilidad nueva y antigua de la misma acción. Multiplica por ventaja y compara con la razón recortada; el mínimo penaliza mejora excesiva del objetivo sustituto. Para ventaja positiva se aplana arriba; para negativa se aplana abajo. El laboratorio evalúa un término muestral, con probabilidad antigua 0,5 y nueva 0,5r, ambas válidas en el rango.

## Primera predicción

Un término de PPO con probabilidad antigua 0,5 y nueva 0,5r. La razón r cambia entre 0,2 y 1,8; ventaja firmada y ε positivo. Calcula término del objetivo ppo con los datos iniciales. Término del objetivo PPO=2,4 . L=min(rA,clip(r,1−ε,1+ε)A); se maximiza su promedio.
