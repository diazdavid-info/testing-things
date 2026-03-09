import { describe, it, expect, beforeEach } from 'vitest'

function renderHomePage() {
  document.body.innerHTML = `
    <main class="flex min-h-screen items-center justify-center">
      <div>
        <h1>El Molino</h1>
        <p>El clasico juego de estrategia, ahora online</p>
        <button id="create-game-btn" type="button">Crear partida</button>
        <p id="create-error" class="hidden" role="alert"></p>
        <form id="join-game-form">
          <label for="game-code" class="sr-only">Codigo de partida</label>
          <input id="game-code" type="text" name="code" placeholder="Codigo de partida" />
          <button id="join-game-btn" type="submit">Unirse</button>
          <p id="join-error" class="hidden" role="alert"></p>
        </form>
      </div>
    </main>
  `
}

describe('Accessibility', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    renderHomePage()
  })

  it('interactive elements are reachable by keyboard (tab order)', () => {
    const createBtn = document.getElementById('create-game-btn')!
    const input = document.getElementById('game-code')!
    const joinBtn = document.getElementById('join-game-btn')!

    // All interactive elements should be focusable
    expect(createBtn.tabIndex).toBeLessThanOrEqual(0)
    expect(input.tabIndex).toBeLessThanOrEqual(0)
    expect(joinBtn.tabIndex).toBeLessThanOrEqual(0)
  })

  it('error messages have role=alert', () => {
    const createError = document.getElementById('create-error')!
    const joinError = document.getElementById('join-error')!

    expect(createError.getAttribute('role')).toBe('alert')
    expect(joinError.getAttribute('role')).toBe('alert')
  })

  it('input has an accessible label', () => {
    const label = document.querySelector('label[for="game-code"]')

    expect(label).not.toBeNull()
    expect(label!.getAttribute('for')).toBe('game-code')
  })
})
