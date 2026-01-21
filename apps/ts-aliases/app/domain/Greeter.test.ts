import { describe, it, expect } from 'vitest'
import Greeter from '#domain/Greeter.js'

describe('Greeter', () => {
  it('greets with prefix', () => {
    const greeter = new Greeter('Hola')
    expect(greeter.greet('Juan')).toBe('Hola Juan')
  })
})
