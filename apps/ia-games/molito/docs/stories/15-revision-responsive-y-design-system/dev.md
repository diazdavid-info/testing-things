# Story 15 — Tareas de desarrollo

## DEV-01: Diagnosticar el overflow horizontal en mobile ✅

- Inspeccionar el layout en viewports de 375px, 390px y 414px
- Identificar que elemento(s) causan el scroll horizontal (tablero, paneles, contenedor principal)
- Documentar la causa raiz antes de aplicar correcciones

> Causa raiz: `Board.astro` linea 45 tenia `max-w-[480px]` fijo. En 375px con padding `px-4` (32px), solo hay 343px disponibles, generando 137px de overflow horizontal.

## DEV-02: Corregir overflow en la pantalla del tablero ✅

- Aplicar las correcciones necesarias al contenedor principal y al tablero SVG
- Asegurar que el tablero se escala proporcionalmente sin desbordar el viewport
- Verificar que `max-width: 100vw` y `overflow-x: hidden` no se usan como parche — corregir la causa raiz
- Comprobar que las fichas y puntos de interseccion siguen siendo interactuables tras el ajuste

> Correccion: Cambiado `max-w-[480px]` a `max-w-full sm:max-w-[480px]` en `Board.astro`. El SVG usa `viewBox` con `w-full h-auto`, asi que se escala automaticamente manteniendo la proporcion.

## DEV-03: Corregir overflow en pantallas secundarias ✅

- Revisar y corregir las pantallas: inicio, sala de espera, auto-join, fin de partida, partida no encontrada, partida llena
- Verificar que Cards, botones y textos no desbordan en 375px
- Asegurar que los botones mantienen un area tactil minima de 44x44px

> Correccion: Limpiadas clases duplicadas de padding en `index.astro` y `WaitingRoom.astro` (`p-12 sm:p-12 p-8` → `p-8 sm:p-12`). Corregidos tamanios de texto (`text-5xl sm:text-5xl` → `text-4xl sm:text-5xl`). Demas componentes (AutoJoin, GameResult, GameNotFound, GameFull) ya usaban `max-w-md`/`max-w-lg` con paddings responsive correctos.

## DEV-04: Verificar que los paneles de informacion son responsive ✅

- Revisar el panel de turno, contador de fichas y mensajes de estado
- Asegurar que el texto largo (nombres, mensajes) hace wrap correcto sin overflow
- Verificar que el layout de dos columnas (tablero + info) se apila correctamente en mobile

> Verificado: `GamePlayingLayout.astro` usa `flex-col lg:flex-row` con `px-4 sm:px-6`. En mobile los elementos se apilan correctamente. `GameInfo.astro` usa `w-full` en mobile y `lg:w-80` en desktop. El panel de informacion es totalmente responsive.

## DEV-05: Alinear la UI implementada con los disenos corregidos en Pencil ✅

- Una vez que UX-01 a UX-04 esten completadas, revisar las diferencias entre Pencil y la UI
- Aplicar los ajustes necesarios en CSS/HTML para que la UI coincida con los disenos actualizados
- Verificar que los tokens del Design System (colores, espaciados, radios) coinciden entre Pencil y codigo

> Verificado: Los tokens de color en `global.css` coinciden con las variables del Design System en Pencil. Los componentes usan las custom properties CSS (`bg-accent-primary`, `text-text-primary`, etc.) que mapean directamente a las variables Pencil.
