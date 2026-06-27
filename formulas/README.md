# Arquitectura de fichas por fórmula

Esta carpeta será la base de la siguiente reorganización del proyecto.

## Objetivo

Cada fórmula debe poder vivir en su propia carpeta, con archivos separados para sus pestañas y recursos. La interfaz no debería depender de múltiples parches sueltos sobre arrays globales, sino de una estructura clara y predecible.

## Estructura propuesta

```text
formulas/
├── manifest.js
├── pythagorean-theorem/
│   ├── meta.json
│   ├── formula.tex
│   ├── significado.md
│   ├── historia.md
│   ├── derivacion.md
│   ├── usos.md
│   ├── ficha.md
│   └── simulacion/
│       ├── index.js
│       └── styles.css
├── euler-identity/
│   ├── meta.json
│   ├── formula.tex
│   ├── significado.md
│   ├── historia.md
│   ├── derivacion.md
│   ├── usos.md
│   └── simulacion/
│       └── index.js
└── wave-equation/
    ├── meta.json
    ├── formula.tex
    ├── significado.md
    ├── historia.md
    ├── derivacion.md
    ├── usos.md
    └── simulacion/
        └── index.js
```

## Regla de funcionamiento

En GitHub Pages el navegador no puede listar carpetas del repositorio de forma automática como si estuviera leyendo un disco local. Por eso hace falta un manifiesto estático.

`manifest.js` será el índice que diga qué fórmulas existen y qué pestañas tiene cada una.

Si una fórmula no tiene carpeta `simulacion/`, la pestaña Simulación no debe aparecer.

Si una fórmula añade una carpeta o archivo nuevo para una pestaña futura, el manifiesto deberá incluirlo para que el front lo cargue.

## Modelo de ficha

`meta.json` contendrá datos de catálogo:

```json
{
  "id": "pythagorean-theorem",
  "name": "Teorema de Pitágoras",
  "author": "Tradición pitagórica",
  "year": -500,
  "field": "Geometría",
  "level": "ESO",
  "color": "#5d5af6"
}
```

Los archivos de texto serán contenido de pestaña:

- `formula.tex`: fórmulas LaTeX principales.
- `significado.md`: interpretación conceptual.
- `historia.md`: contexto histórico.
- `derivacion.md`: deducción paso a paso.
- `usos.md`: aplicaciones y ejemplos.
- `ficha.md`: datos técnicos complementarios.

La simulación será código independiente:

- `simulacion/index.js`: monta el plugin.
- `simulacion/styles.css`: estilos específicos si hicieran falta.

## Ventaja

Con esta arquitectura se evita que varias capas distintas modifiquen el mismo modal. Cada ficha declara sus pestañas, y el render solo muestra lo que exista en el manifiesto.

## Fase recomendada de migración

1. Mantener el catálogo actual funcionando.
2. Crear `formulas/manifest.js` como índice paralelo.
3. Migrar primero las fórmulas con simulador específico.
4. Cambiar el modal para leer pestañas desde el manifiesto.
5. Eliminar progresivamente archivos agregadores antiguos cuando todo esté migrado.
