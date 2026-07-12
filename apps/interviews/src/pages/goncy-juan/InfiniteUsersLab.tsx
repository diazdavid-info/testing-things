import { useEffect, useRef, useState } from 'react'

import styles from './InfiniteUsersLab.module.css'

const PAGE_SIZE = 6
const TOTAL = 24
const names = ['Ada Lovelace', 'Linus Torvalds', 'Margaret Hamilton', 'Guido van Rossum', 'Grace Hopper', 'Brendan Eich', 'Radia Perlman', 'Tim Berners-Lee', 'Barbara Liskov', 'James Gosling', 'Hedy Lamarr', 'Ken Thompson', 'Annie Easley', 'Donald Knuth', 'Mary Jackson', 'Alan Kay', 'Evelyn Boyd', 'John Carmack', 'Frances Allen', 'Dennis Ritchie', 'Katie Bouman', 'Edsger Dijkstra', 'Karen Spärck', 'Alan Turing']

export function InfiniteUsersLab() {
  const [users, setUsers] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const hasMore = users.length < TOTAL

  useEffect(() => {
    let active = true
    setLoading(true)
    const timer = window.setTimeout(() => {
      if (!active) return
      const offset = page * PAGE_SIZE
      setUsers((current) => [...current, ...names.slice(offset, offset + PAGE_SIZE)])
      setLoading(false)
    }, 650)
    return () => { active = false; window.clearTimeout(timer) }
  }, [page])

  useEffect(() => {
    const target = sentinelRef.current
    if (!target || loading || !hasMore) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setPage((current) => current + 1)
    }, { rootMargin: '120px' })
    observer.observe(target)
    return () => observer.disconnect()
  }, [hasMore, loading])

  return (
    <section className={styles.lab} id="laboratorio">
      <div className={styles.copy}><span>LABORATORIO · 03</span><h2>Haz scroll.<br /><em>El resto ocurre.</em></h2><p>Dentro de la ventana, baja hasta el sentinel. El observador anticipa el siguiente lote, evita peticiones paralelas y se desconecta al llegar al total.</p><button type="button" onClick={() => { setUsers([]); setPage(0) }}>Reiniciar experimento ↻</button></div>
      <div className={styles.window}><header><span>users.stream.tsx</span><b>{users.length}/{TOTAL} loaded</b></header><div className={styles.viewport}><ol>{users.map((name, index) => <li key={name}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{name}</strong><small>user_{String(index + 1).padStart(3, '0')}@servel.dev</small></div></li>)}</ol><div ref={sentinelRef} className={styles.sentinel}>{loading ? <><i /> solicitando lote {page + 1}</> : hasMore ? '↓ continúa para cargar' : '✓ fin del dataset · observer disconnected'}</div></div></div>
    </section>
  )
}
