# Story 15: Revision responsive mobile y correccion del Design System en Pencil

## Descripcion

El layout del juego presenta un ligero overflow horizontal en dispositivos moviles que impide una experiencia correcta. Ademas, el Design System que se creo en Pencil (story 12) para reutilizar componentes no se implemento correctamente — los componentes no se estan compartiendo de forma consistente entre pantallas.

Esta story aborda dos frentes: corregir el responsive en la UI del proyecto y revisar/corregir el Design System en Pencil para que realmente funcione como fuente de verdad de los componentes reutilizables.

## Requisitos

### UI — Corregir overflow en mobile

- Identificar la causa del overflow horizontal en viewports moviles (375px, 390px, 414px)
- Corregir los estilos para que ninguna pantalla del juego genere scroll horizontal
- Verificar que el tablero se escala correctamente sin desbordar el viewport
- Revisar que los paneles de informacion (turno, fichas, estado) no se desbordan en pantallas pequenas
- Comprobar que los botones y elementos interactivos mantienen un tamano tactil adecuado (minimo 44x44px)
- Validar en las pantallas clave: inicio, sala de espera, tablero (colocacion, movimiento, vuelo), fin de partida

### Pencil — Revisar y corregir el Design System

- Auditar el estado actual del Design System: que componentes existen, cuales se reutilizan realmente y cuales estan duplicados
- Corregir los componentes base (Card, PrimaryButton, SecondaryButton, StatusMessage) para que sean consistentes
- Verificar que las variables de estilo (colores, espaciados, tipografia) estan definidas y se usan en todos los componentes
- Asegurar que cada pantalla utiliza los componentes del Design System en lugar de definiciones inline duplicadas
- Documentar los componentes disponibles y sus variantes dentro del propio archivo Pencil

### Alineacion Pencil — UI

- Comparar los disenos en Pencil con la UI implementada para detectar inconsistencias
- Asegurar que los breakpoints y adaptaciones responsive esten reflejados en los disenos de Pencil
- Si hay discrepancias, actualizar Pencil para que refleje el estado final corregido de la UI

## Criterios de aceptacion

- No hay overflow horizontal en ninguna pantalla del juego en viewports de 375px o superiores
- El Design System en Pencil tiene componentes reutilizables correctamente configurados
- Las pantallas en Pencil usan los componentes del Design System (no hay duplicaciones inline)
- Los disenos en Pencil coinciden con la UI implementada
- Todos los tests existentes siguen pasando

## Fuera de alcance

- Rediseno visual o cambios de branding
- Soporte para tablets o viewports mayores a lo ya existente
- Nuevas funcionalidades o pantallas
- Cambios en la logica de negocio o API