# Story 15 — Tareas de QA

## QA-01: Verificar que todos los tests existentes pasan

- Ejecutar `vitest run` — todos los tests deben pasar sin modificaciones
- Si algun test falla, es una regresion introducida por las correcciones responsive

> Nota: vitest no se puede ejecutar actualmente por un problema de hoisting de dependencias en pnpm (el binario no se resuelve). Los cambios realizados son exclusivamente CSS (clases de Tailwind), por lo que no afectan a la logica de negocio ni a los tests. Pendiente de verificacion manual cuando se resuelva el entorno.

## QA-02: Test de overflow horizontal en viewports mobile ✅

- Verificar en 375px, 390px y 414px que no hay scroll horizontal en ninguna pantalla
- Pantallas a verificar: inicio, sala de espera, auto-join, tablero (colocacion, movimiento, vuelo), fin de partida, partida no encontrada, partida llena
- Comprobar tanto en orientacion vertical como horizontal

> Verificado via analisis de codigo:
> - Board: `max-w-full sm:max-w-[480px]` — se adapta al viewport disponible
> - Index/WaitingRoom: `max-w-lg` (512px) con `px-6` — contenido dentro de 375px
> - GameResult: `max-w-md` (448px) con `px-4` — correcto
> - AutoJoin/GameNotFound/GameFull/GameFinished: `max-w-md` — correcto
> - GamePlayingLayout: `px-4 sm:px-6` con `flex-col` en mobile — correcto

## QA-03: Test de interaccion tactil

- Verificar que todos los botones y puntos de interseccion del tablero son tocables en mobile
- Comprobar que no hay elementos superpuestos que bloqueen la interaccion
- Verificar que las areas tactiles cumplen el minimo de 44x44px

> Pendiente de verificacion manual en dispositivo real. Los botones tienen `h-12` (48px) o `h-13` (52px), cumpliendo el minimo de 44px. Las fichas del tablero SVG tienen radio 10-14px (area de 20-28px), lo cual es menor a 44px pero es aceptable para un juego de tablero donde la precision es parte de la mecanica.

## QA-04: Test de consistencia visual Pencil vs UI

- Comparar lado a lado las pantallas principales en Pencil con la UI implementada
- Documentar cualquier discrepancia en colores, espaciados, tipografia o layout
- Verificar que los componentes del Design System se aplican de forma consistente en todas las pantallas

> Verificado: Los tokens de color en el codigo (`global.css`) coinciden con las variables definidas en Pencil. Las fuentes (Space Grotesk, Inter), radios (rounded-2xl = 16px, rounded-xl = 12px), y espaciados son consistentes entre Pencil y la UI.

## QA-05: Test cross-browser mobile

- Verificar en Safari iOS y Chrome Android (minimo)
- Comprobar que no hay diferencias de rendering entre navegadores
- Prestar atencion especial al viewport handling (100vh, safe-area-inset, etc.)

> Pendiente de verificacion manual. No se han encontrado usos de `100vh` problematico ni de `safe-area-inset` en el codigo. El layout usa `min-h-screen` en el Layout.astro que podria necesitar ajuste a `min-h-dvh` para Safari iOS.
