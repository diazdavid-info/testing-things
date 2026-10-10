# Turnos

Calendario anual de custodia compartida con semanas, rotaciones y vacaciones configurables. La configuración se guarda
únicamente en el navegador.

## Desarrollo

```bash
pnpm install
pnpm --filter calendar-custody dev
```

La app Astro se abre en `http://localhost:4322`. Para compilarla y ejecutarla como servidor Node:

```bash
pnpm --filter calendar-custody build
PORT=4322 pnpm --filter calendar-custody start
```
