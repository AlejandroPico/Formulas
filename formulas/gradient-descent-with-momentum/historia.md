# Historia

El método de momento añade inercia a descenso para amortiguar oscilaciones y acumular dirección. La convención de velocidad cambia entre implementaciones y debe declararse.

## Referencia y alcance

[Material de estudio](https://www.cs.toronto.edu/~hinton/coursera/lecture6/lec6.pdf).

η>0, β y β2 menores que uno, ε=10⁻⁸; operaciones componente a componente. La escala del paso y memoria afectan estabilidad y no garantizan descenso en cada iteración. Parámetros, gradientes y pérdida usan unidades reducidas; en RMSProp el control β de primera memoria no interviene.

La fecha de creación del catálogo procede del archivo original; el año científico y la fecha de revisión tienen funciones diferentes.
