import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import Page2 from './Page2'
import { describe, expect, it, vi } from 'vitest'

const navigateMock = vi.fn()

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

const renderWithRouter = (state = { some: 'TEST' }) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/page-2', state }]}>
      <Routes>
        <Route path="/page-2" element={<Page2 />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Page2', () => {
  it('renders value from location.state', () => {
    renderWithRouter()

    expect(screen.getByText('Page 2 TEST')).toBeInTheDocument()
  })

  it('navigates to home when clicking button', () => {
    renderWithRouter()

    const button = screen.getByText('Go to Page 1')
    fireEvent.click(button)

    expect(navigateMock).toHaveBeenCalledWith('/')
  })
})
