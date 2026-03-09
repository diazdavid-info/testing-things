# Story 15 — Tareas de UI/UX (Pencil)

## UX-01: Auditar el estado actual del Design System

- Revisar que componentes base existen actualmente (Card, PrimaryButton, SecondaryButton, StatusMessage)
- Identificar cuales se estan reutilizando realmente y cuales estan duplicados o mal configurados
- Documentar el estado actual como punto de partida

## UX-02: Corregir y consolidar los componentes base del Design System

- Corregir el componente "Card": asegurar que tiene las propiedades correctas (bg, border, radius, padding) y esta marcado como reutilizable
- Corregir "PrimaryButton" y "SecondaryButton": estados (default, hover, disabled), tamanos y estilos consistentes
- Corregir "StatusMessage": estructura de icono + titulo + descripcion
- Verificar que las variables de estilo (colores, espaciados, tipografia) estan definidas y vinculadas a los componentes

## UX-03: Refactorizar pantallas para usar el Design System corregido

- Reemplazar todas las instancias duplicadas de cards, botones y mensajes por los componentes del Design System
- Verificar que cada pantalla referencia los componentes base en lugar de tener definiciones inline
- Resultado esperado: cambios en un componente base se propagan a todas las pantallas

## UX-04: Anadir variantes responsive a los disenos

- Crear frames o variantes para viewport mobile (375px) en las pantallas clave
- Reflejar como el tablero se escala y como se apilan los paneles en mobile
- Asegurar que los disenos mobile muestran areas tactiles adecuadas (44x44px minimo)
- Documentar los breakpoints usados en los disenos

## UX-05: Verificacion visual final

- Comparar capturas de la UI implementada con los disenos actualizados en Pencil
- Listar cualquier discrepancia restante para que dev la corrija en DEV-05
