import { describe, it, expect, vi, beforeEach } from 'vitest'

function renderAutoJoinScreen(code = 'AB3K') {
  document.body.innerHTML = `
    <div id="auto-join-screen" data-code="${code}">
      <div>
        <div class="animate-spin"></div>
        <h1>Uniendose a la partida...</h1>
        <p>Conectando con tu rival</p>
        <span>${code}</span>
      </div>
    </div>
    <div id="join-error-screen" class="hidden">
      <div>
        <span id="error-icon">🚫</span>
        <h1 id="error-title">Error</h1>
        <p id="error-desc"></p>
        <a href="/">Volver al inicio</a>
      </div>
    </div>
    <div id="join-success-screen" class="hidden">
      <div>
        <h1>Conectado!</h1>
        <p>La partida va a comenzar...</p>
      </div>
    </div>
  `

  const autoJoinScreen = document.getElementById('auto-join-screen')!
  const errorScreen = document.getElementById('join-error-screen')!
  const successScreen = document.getElementById('join-success-screen')!

  async function attemptAutoJoin() {
    try {
      const res = await fetch(`/api/games/${code}/join`, { method: 'POST' })

      if (res.ok) {
        autoJoinScreen.classList.add('hidden')
        successScreen.classList.remove('hidden')
        return
      }

      autoJoinScreen.classList.add('hidden')
      errorScreen.classList.remove('hidden')

      const errorTitle = document.getElementById('error-title')!
      const errorDesc = document.getElementById('error-desc')!
      const errorIcon = document.getElementById('error-icon')!

      if (res.status === 409) {
        errorIcon.textContent = '🚫'
        errorTitle.textContent = 'Partida llena'
        errorDesc.textContent = 'Esta partida ya tiene dos jugadores'
      } else if (res.status === 410) {
        errorIcon.textContent = '⏱️'
        errorTitle.textContent = 'Partida terminada'
        errorDesc.textContent = 'Esta partida ya ha finalizado'
      } else {
        errorTitle.textContent = 'Error al unirse'
        errorDesc.textContent = 'No se pudo unir a la partida.'
      }
    } catch {
      autoJoinScreen.classList.add('hidden')
      errorScreen.classList.remove('hidden')
      document.getElementById('error-title')!.textContent = 'Error de conexion'
      document.getElementById('error-desc')!.textContent = 'No se pudo conectar al servidor.'
    }
  }

  return { autoJoinScreen, errorScreen, successScreen, attemptAutoJoin }
}

describe('Auto-join by link', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('calls POST /api/games/{code}/join on auto-join', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          id: '1',
          code: 'AB3K',
          playerId: 'p2',
          status: 'playing',
        }),
      ),
    )

    const { attemptAutoJoin } = renderAutoJoinScreen('AB3K')
    await attemptAutoJoin()

    expect(fetchSpy).toHaveBeenCalledWith('/api/games/AB3K/join', {
      method: 'POST',
    })
  })

  it('shows success screen on 200 response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          id: '1',
          code: 'AB3K',
          playerId: 'p2',
          status: 'playing',
        }),
      ),
    )

    const { autoJoinScreen, successScreen, attemptAutoJoin } = renderAutoJoinScreen()
    await attemptAutoJoin()

    expect(autoJoinScreen.classList.contains('hidden')).toBe(true)
    expect(successScreen.classList.contains('hidden')).toBe(false)
  })

  it("shows 'Partida llena' on 409 response", async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 409 }))

    const { errorScreen, attemptAutoJoin } = renderAutoJoinScreen()
    await attemptAutoJoin()

    expect(errorScreen.classList.contains('hidden')).toBe(false)
    expect(document.getElementById('error-title')!.textContent).toBe('Partida llena')
    expect(document.getElementById('error-desc')!.textContent).toBe('Esta partida ya tiene dos jugadores')
  })

  it("shows 'Partida terminada' on 410 response", async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 410 }))

    const { errorScreen, attemptAutoJoin } = renderAutoJoinScreen()
    await attemptAutoJoin()

    expect(errorScreen.classList.contains('hidden')).toBe(false)
    expect(document.getElementById('error-title')!.textContent).toBe('Partida terminada')
  })

  it('shows connection error on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    const { errorScreen, attemptAutoJoin } = renderAutoJoinScreen()
    await attemptAutoJoin()

    expect(errorScreen.classList.contains('hidden')).toBe(false)
    expect(document.getElementById('error-title')!.textContent).toBe('Error de conexion')
  })

  it('shows generic error on 404 response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 404 }))

    const { errorScreen, attemptAutoJoin } = renderAutoJoinScreen()
    await attemptAutoJoin()

    expect(errorScreen.classList.contains('hidden')).toBe(false)
    expect(document.getElementById('error-title')!.textContent).toBe('Error al unirse')
  })
})
