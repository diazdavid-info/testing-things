# Story 15 — Tareas de desarrollo

## DEV-01: Diagnosticar el overflow horizontal en mobile

- Inspeccionar el layout en viewports de 375px, 390px y 414px
- Identificar que elemento(s) causan el scroll horizontal (tablero, paneles, contenedor principal)
- Documentar la causa raiz antes de aplicar correcciones

## DEV-02: Corregir overflow en la pantalla del tablero

- Aplicar las correcciones necesarias al contenedor principal y al tablero SVG
- Asegurar que el tablero se escala proporcionalmente sin desbordar el viewport
- Verificar que `max-width: 100vw` y `overflow-x: hidden` no se usan como parche — corregir la causa raiz
- Comprobar que las fichas y puntos de interseccion siguen siendo interactuables tras el ajuste

## DEV-03: Corregir overflow en pantallas secundarias

- Revisar y corregir las pantallas: inicio, sala de espera, auto-join, fin de partida, partida no encontrada, partida llena
- Verificar que Cards, botones y textos no desbordan en 375px
- Asegurar que los botones mantienen un area tactil minima de 44x44px

## DEV-04: Verificar que los paneles de informacion son responsive

- Revisar el panel de turno, contador de fichas y mensajes de estado
- Asegurar que el texto largo (nombres, mensajes) hace wrap correcto sin overflow
- Verificar que el layout de dos columnas (tablero + info) se apila correctamente en mobile

## DEV-05: Alinear la UI implementada con los disenos corregidos en Pencil

- Una vez que UX-01 a UX-04 esten completadas, revisar las diferencias entre Pencil y la UI
- Aplicar los ajustes necesarios en CSS/HTML para que la UI coincida con los disenos actualizados
- Verificar que los tokens del Design System (colores, espaciados, radios) coinciden entre Pencil y codigo
