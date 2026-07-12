import { FormEvent, useMemo, useState } from 'react'

import styles from './CandeDirectoryLab.module.css'

type User = { id: number; name: string; email: string }
type Direction = 'asc' | 'desc'

const initialUsers: User[] = [
  { id: 1, name: 'Sofía Núñez', email: 'sofia@frontend.dev' },
  { id: 2, name: 'Álvaro Díaz', email: 'alvaro@react.dev' },
  { id: 3, name: 'Cande Flores', email: 'cande@web.dev' },
]

export function CandeDirectoryLab() {
  const [users, setUsers] = useState(initialUsers)
  const [direction, setDirection] = useState<Direction>('asc')
  const [error, setError] = useState('')

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name)
      return direction === 'asc' ? comparison : -comparison
    })
  }, [direction, users])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()

    if (users.some((user) => user.email === email)) {
      setError('Ese email ya existe. Prueba con otro.')
      return
    }

    setUsers((current) => [...current, { id: Date.now(), name, email }])
    setError('')
    form.reset()
  }

  return (
    <section className={styles.lab} id="laboratorio" aria-labelledby="cande-lab-title">
      <div className={styles.copy}>
        <span>LABORATORIO · 02</span>
        <h2 id="cande-lab-title">El directorio,<br /><em>bien resuelto.</em></h2>
        <p>Prueba las tareas de la entrevista: agrega un usuario, comprueba que el formulario se limpia, intenta repetir el email y cambia el orden A–Z o Z–A.</p>
        <div className={styles.legend}><i /> users <i /> sort</div>
      </div>

      <div className={styles.window}>
        <header><span>directory.final.tsx</span><b>{users.length.toString().padStart(2, '0')} records</b></header>
        <form onSubmit={handleSubmit}>
          <label>Nombre<input name="name" placeholder="Nombre y apellido" required /></label>
          <label>Email<input name="email" type="email" placeholder="nombre@dominio.com" aria-invalid={Boolean(error)} aria-describedby="email-error" required /></label>
          <button>Agregar <span>↵</span></button>
          <p id="email-error" className={styles.error} aria-live="polite">{error}</p>
        </form>
        <div className={styles.sortBar}>
          <span>USUARIOS / NOMBRE</span>
          <label>Orden
            <select value={direction} onChange={(event) => setDirection(event.currentTarget.value as Direction)}>
              <option value="asc">A → Z</option><option value="desc">Z → A</option>
            </select>
          </label>
        </div>
        <ol>{sortedUsers.map((user, index) => <li key={user.id}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></li>)}</ol>
      </div>
    </section>
  )
}
