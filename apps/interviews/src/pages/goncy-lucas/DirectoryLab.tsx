import { FormEvent, useEffect, useMemo, useState } from 'react'

import styles from './DirectoryLab.module.css'

type User = { id: number; name: string; email: string }

const initialUsers: User[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@analytical.dev' },
  { id: 2, name: 'Grace Hopper', email: 'grace@compiler.dev' },
  { id: 3, name: 'Linus Torvalds', email: 'linus@kernel.dev' },
]

export function DirectoryLab() {
  const [users, setUsers] = useState(initialUsers)
  const [history, setHistory] = useState<User[][]>([])
  const [query, setQuery] = useState('')

  const visibleUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return users
    return users.filter((user) =>
      `${user.name} ${user.email}`.toLowerCase().includes(normalizedQuery),
    )
  }, [query, users])

  const commit = (nextUsers: User[]) => {
    setHistory((previous) => [...previous, users])
    setUsers(nextUsers)
  }

  const undo = () => {
    setHistory((previous) => {
      const lastSnapshot = previous.at(-1)
      if (!lastSnapshot) return previous
      setUsers(lastSnapshot)
      return previous.slice(0, -1)
    })
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isUndoShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z'
      if (!isUndoShortcut) return
      event.preventDefault()
      undo()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [history])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    if (!name || !email) return

    commit([...users, { id: Date.now(), name, email }])
    form.reset()
  }

  return (
    <section className={styles.lab} id="laboratorio" aria-labelledby="lab-title">
      <div className={styles.labCopy}>
        <span className={styles.kicker}>LABORATORIO · 01</span>
        <h2 id="lab-title">Prueba la solución,<br /><em>no solo la leas.</em></h2>
        <p>Agrega, elimina, filtra y deshaz. El contador y la lista filtrada son valores calculados: siempre nacen del estado actual durante el render.</p>
        <div className={styles.shortcut}><kbd>⌘</kbd><span>+</span><kbd>Z</kbd><small>También Ctrl + Z</small></div>
      </div>

      <div className={styles.directory}>
        <div className={styles.windowBar}><span>user-directory.tsx</span><b>{users.length} usuarios · {history.length} cambios</b></div>
        <form onSubmit={handleSubmit}>
          <label>Nombre<input name="name" placeholder="Lucas" required /></label>
          <label>Email<input name="email" type="email" placeholder="lucas@dev.com" required /></label>
          <button type="submit">Agregar ↵</button>
        </form>
        <div className={styles.toolbar}>
          <label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar directorio…" /></label>
          <button onClick={undo} disabled={!history.length}>↶ Deshacer</button>
        </div>
        <ul>
          {visibleUsers.map((user) => (
            <li key={user.id}>
              <div className={styles.avatar}>{user.name.slice(0, 2).toUpperCase()}</div>
              <div><strong>{user.name}</strong><span>{user.email}</span></div>
              <button aria-label={`Eliminar a ${user.name}`} onClick={() => commit(users.filter((item) => item.id !== user.id))}>×</button>
            </li>
          ))}
        </ul>
        {!visibleUsers.length && <p className={styles.noResults}>Sin coincidencias. El estado original sigue intacto.</p>}
      </div>
    </section>
  )
}
