# AGENTS.md - Agent Coding Guidelines

## Project Overview

This is a pnpm workspace containing multiple independent apps in the `apps/` directory. Each app is a separate project with its own `package.json`, `tsconfig.json`, and dependencies.

## Build, Lint, and Test Commands

### Root Level Commands

```bash
# Lint all files (uses eslint-config-mytools)
pnpm lint

# Format all files (astro, json, md)
pnpm format

# Update all dependencies to latest
pnpm update-deps
```

### Per-App Commands

Most apps use similar patterns. Check each `apps/*/package.json` for exact scripts.

```bash
# Common test commands (vitest)
cd apps/<app-name>
pnpm test              # Run tests once
pnpm test:watch       # Run tests in watch mode
pnpm test -- <file>   # Run specific test file

# Run a single test (most common pattern)
pnpm test -- converter.test.ts
pnpm test -- "converter.test.ts"
pnpm test -- --run converter.test.ts

# Run tests matching a pattern
pnpm test -- -t "Should generate"

# Build commands
pnpm build            # Build the project
pnpm dev              # Start dev server
pnpm start            # Start production server

# Lint commands (per-app)
pnpm lint             # Run ESLint with --fix
```

### App-Specific Notes

- **kata-vite**: React + Vite + Tailwind. Uses `@/*` path aliases.
- **ts-aliases**: Uses `#app/*`, `#domain/*`, `#shared/*` path aliases with vitest.
- **blog**: Astro project with `astro dev`, `astro build`.
- **stripe**: Node.js with TypeScript, uses `nodemon` for dev.
- **mocking-vitest**: Vitest with axios mocking examples.

## Code Style Guidelines

### TypeScript

- Use `strict: true` in tsconfig (enforced in most apps)
- Avoid `any` - use `unknown` or proper types instead
- Prefer explicit return types for exported functions
- Use `baseUrl` and `paths` for clean imports (e.g., `@/lib/*`)

### ESLint Configuration

The project uses `eslint-config-mytools` which includes:

- Base rules
- TypeScript rules
- Prettier integration
- React rules
- Astro rules

Common custom rules in `.eslint.config.mjs`:

- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/no-empty-object-type`: off

### Formatting

- Use Prettier for all formatting
- Run `pnpm format` at root to format astro, json, md files
- Each app may have its own Prettier config

### Imports

- Use path aliases when available (e.g., `@/lib/...`, `#app/...`)
- Order imports: external libraries → internal modules → relative paths
- Use named exports preferred over default exports
- Include file extensions for relative imports when using TypeScript (`.ts`, `.tsx`)

```typescript
// Good
import { useState } from 'react'
import { Task } from '@/types/task'
import { jiraTasksToTasks } from './converter'

// Avoid
import converter from './converter'
```

### Naming Conventions

- **Files**: kebab-case for most files (`converter.ts`), PascalCase for components (`App.tsx`), camelCase for utilities
- **Functions**: camelCase, descriptive verbs (`jiraTasksToTasks`, `tasksToCommand`)
- **Types/Interfaces**: PascalCase (`Task`, `JiraTask`)
- **Constants**: SCREAMING_SNAKE_CASE for true constants, camelCase for config objects
- **Components**: PascalCase (`App`, `TaskItem`)

### Error Handling

- Use typed error objects when possible
- Prefer explicit error messages
- Use try/catch with specific error handling
- Consider using Result types for operations that can fail

```typescript
// Preferred pattern
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  if (error instanceof SpecificError) {
    handleSpecificError(error)
  }
  throw error
}
```

### Testing

- Use Vitest as the test framework
- Place tests in `__tests__/` directories or alongside source files with `.test.ts` suffix
- Use descriptive test names: `it('Should generate task with title', ...)`
- Use `describe` blocks to group related tests
- Follow AAA pattern: Arrange, Act, Assert

```typescript
describe('converter', () => {
  describe('htmlElementToTasks', () => {
    it('Should generate task with title', () => {
      // Arrange
      const input = fixture

      // Act
      const [firstTask] = jiraTasksToTasks(input)

      // Assert
      expect(firstTask.title).toBe('Expected title')
    })
  })
})
```

### React Patterns

- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused
- Use TypeScript for prop types (not PropTypes)

### Git Conventions

- No specific commit message format enforced
- Avoid committing node_modules, .env files, or build artifacts
- Use sensible, descriptive commit messages

### General Best Practices

- Keep functions small and focused (single responsibility)
- Avoid premature optimization
- Write self-documenting code with clear variable names
- Comment complex business logic, not obvious code
- Remove dead code and unused imports
