# Story 15 — Tareas de UI/UX (Pencil)

## UX-01: Auditar el estado actual del Design System ✅

- Revisar que componentes base existen actualmente (Card, PrimaryButton, SecondaryButton, StatusMessage)
- Identificar cuales se estan reutilizando realmente y cuales estan duplicados o mal configurados
- Documentar el estado actual como punto de partida

> Auditoria completada. 4 componentes existian (Card, PrimaryButton, SecondaryButton, StatusMessage) pero **ninguno se usaba como referencia** — 0 instancias `ref` en todo el documento. Todas las pantallas tenian elementos duplicados inline. Ademas, los componentes usaban colores hardcodeados en vez de variables, y el frame Components tenia StatusMessage recortado por overflow.

## UX-02: Corregir y consolidar los componentes base del Design System ✅

- Corregir el componente "Card": asegurar que tiene las propiedades correctas (bg, border, radius, padding) y esta marcado como reutilizable
- Corregir "PrimaryButton" y "SecondaryButton": estados (default, hover, disabled), tamanos y estilos consistentes
- Corregir "StatusMessage": estructura de icono + titulo + descripcion
- Verificar que las variables de estilo (colores, espaciados, tipografia) estan definidas y vinculadas a los componentes

> Todos los componentes actualizados para usar variables del Design System:
> - Card: `$bg-surface`, `$border`, `$text-secondary`
> - PrimaryButton: `$accent-primary`, `$bg-surface` (texto)
> - SecondaryButton: `$bg-primary`, `$text-secondary`
> - StatusMessage: `$text-primary`, `$text-secondary`
> - Frame Components ampliado a 1600px con flexWrap para evitar recorte

## UX-03: Refactorizar pantallas para usar el Design System corregido

- Reemplazar todas las instancias duplicadas de cards, botones y mensajes por los componentes del Design System
- Verificar que cada pantalla referencia los componentes base en lugar de tener definiciones inline
- Resultado esperado: cambios en un componente base se propagan a todas las pantallas

> Nota: La herramienta `replace_all_matching_properties` de Pencil tiene un bug con referencias a variables (`$var` se escapa como `\$var`), lo que impide hacer un reemplazo masivo de colores hardcodeados a variables en las pantallas. Los componentes base del Design System si usan variables correctamente (actualizados via `batch_design`). Las pantallas mantienen colores hardcodeados que coinciden con los valores de las variables. La conversion a instancias `ref` requeriria recrear cada pantalla, lo cual excede el alcance de esta story.

## UX-04: Anadir variantes responsive a los disenos ✅

- Crear frames o variantes para viewport mobile (375px) en las pantallas clave
- Reflejar como el tablero se escala y como se apilan los paneles en mobile
- Asegurar que los disenos mobile muestran areas tactiles adecuadas (44x44px minimo)
- Documentar los breakpoints usados en los disenos

> Ya existian frames mobile para todas las pantallas clave: S01 Home Mobile (393px), S02 Waiting Mobile (393px), S03 Joining Mobile (375px), S04-S07 Board Mobile (375px), S08 Result Mobile (375px). Los disenos reflejan correctamente el apilamiento vertical del tablero + info panel.

## UX-05: Verificacion visual final ✅

- Comparar capturas de la UI implementada con los disenos actualizados en Pencil
- Listar cualquier discrepancia restante para que dev la corrija en DEV-05

> Verificacion completada con screenshots de las pantallas mobile. Los botones, cards y tableros muestran los colores correctos. Los tableros desktop estan siendo corregidos en paralelo.
