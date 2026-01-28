import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import Page2 from './Page2'
import { expect, it } from 'vitest'

const Page1 = () => <h1>Page 1</h1>

const renderWithRouter = (state = { some: 'TEST' }) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: '/page-2', state }]}>
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/page-2" element={<Page2 />} />
      </Routes>
    </MemoryRouter>,
  )

it('navigates to home when clicking button', () => {
  renderWithRouter()

  fireEvent.click(screen.getByText('Go to Page 1'))

  expect(screen.getByText('Page 1')).toBeInTheDocument()
})
