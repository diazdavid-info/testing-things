import { describe, it, expect } from 'vitest'
import { trackEvent } from '../lib/analytics-events'

describe('Analytics events', () => {
  it('trackEvent is a function', () => {
    expect(typeof trackEvent).toBe('function')
  })

  it('trackEvent does not throw', () => {
    expect(() => trackEvent('page_view')).not.toThrow()
    expect(() => trackEvent('click_new_game', { source: 'home' })).not.toThrow()
  })

  it('trackEvent returns undefined (stub)', () => {
    const result = trackEvent('click_how_to_play')
    expect(result).toBeUndefined()
  })
})
