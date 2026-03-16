import { describe, it, expect } from 'vitest'
import { JSDOM } from 'happy-dom'
import fs from 'fs'
import path from 'path'

// Since Astro pages need the Astro build pipeline to render,
// we test the structure by reading the source and verifying expectations.
// Integration tests run via build + preview.

describe('Home page structure', () => {
  const indexPath = path.resolve(__dirname, '../pages/index.astro')
  const layoutPath = path.resolve(__dirname, '../layouts/Layout.astro')

  it('index.astro file exists', () => {
    expect(fs.existsSync(indexPath)).toBe(true)
  })

  it('Layout.astro file exists', () => {
    expect(fs.existsSync(layoutPath)).toBe(true)
  })

  it('index.astro contains a single h1', () => {
    const content = fs.readFileSync(indexPath, 'utf-8')
    const h1Matches = content.match(/<h1[\s>]/g)
    expect(h1Matches).toHaveLength(1)
  })

  it('index.astro contains "Nueva partida" link', () => {
    const content = fs.readFileSync(indexPath, 'utf-8')
    expect(content).toContain('Nueva partida')
  })

  it('index.astro contains "Como jugar" link', () => {
    const content = fs.readFileSync(indexPath, 'utf-8')
    expect(content).toContain('Como jugar')
  })

  it('index.astro links to /jugar', () => {
    const content = fs.readFileSync(indexPath, 'utf-8')
    expect(content).toContain('href="/jugar"')
  })

  it('index.astro links to /como-jugar', () => {
    const content = fs.readFileSync(indexPath, 'utf-8')
    expect(content).toContain('href="/como-jugar"')
  })

  it('Layout.astro has lang="es"', () => {
    const content = fs.readFileSync(layoutPath, 'utf-8')
    expect(content).toContain('lang="es"')
  })

  it('Layout.astro has meta description', () => {
    const content = fs.readFileSync(layoutPath, 'utf-8')
    expect(content).toContain('name="description"')
  })

  it('Layout.astro has Open Graph tags', () => {
    const content = fs.readFileSync(layoutPath, 'utf-8')
    expect(content).toContain('og:title')
    expect(content).toContain('og:description')
  })

  it('Layout.astro uses semantic <main> element', () => {
    const content = fs.readFileSync(layoutPath, 'utf-8')
    expect(content).toContain('<main')
  })
})
