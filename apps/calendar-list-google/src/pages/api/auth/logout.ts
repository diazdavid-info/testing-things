import type { APIRoute } from 'astro'

import { clearSession } from '../../../lib/session.ts'

export const POST: APIRoute = ({ cookies, redirect }) => {
  clearSession(cookies)
  return redirect('/')
}
