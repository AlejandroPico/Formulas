# Aprendizaje

## Primero predice

La aceleración que experimenta una partícula combina cambios temporales y cambios de velocidad al atravesar posiciones. Euler equilibra esa aceleración con presión y fuerzas de volumen, omitiendo viscosidad.

En una instantánea u(x,t)=a·x+b·t, separa aceleración local y convectiva. La presión necesaria se calcula en t=0; este campo 1D no es un flujo incompresible salvo a=0.

## Tres formas de aprender

**Gradientes · Explorar · Aceleración material**

Separar observación en un punto y seguimiento de una partícula; interpretar aceleración convectiva; comparar modelo inviscido con Navier–Stokes. El laboratorio representa una instantánea: no afirma que densidad y velocidad constantes en el tiempo satisfagan continuidad para a≠0.

## Cuatro misiones

1. **Predice el resultado.** u=x+t en unidades SI. En x=1 y t=0, ¿cuánto vale Du/Dt?

2. **Diseña una solución.** Ajusta b para cancelar la aceleración material en x=1.

3. **Piensa antes de cambiar.** ¿Euler incluye la difusión viscosa μ∇²u?

4. **Un paso más.** Con ρ=1000 y aceleración material 2, calcula ∂p/∂x.

Hay pistas, comprobación y reintentos. Después de acertar, explica qué cambió y qué se mantuvo. Los controles tienen etiquetas y admiten teclado; las vistas 3D admiten giro con ratón, tacto o flechas. Fluido continuo sin tensiones viscosas. Presión y densidad requieren además conservación de masa y cierre termodinámico cuando se busca la evolución completa.
