import { Link } from 'react-router-dom'

import { VideoPlayer } from '../../components/video-player/VideoPlayer.tsx'
import { InfiniteUsersLab } from './InfiniteUsersLab.tsx'
import { lessons, observerCode, paginationCode } from './interview-content.ts'
import styles from './GoncyJuanPage.module.css'

export function GoncyJuanPage() {
  return (
    <div className={styles.page}>
      <nav><Link to="/">&gt;_ tech.interviews</Link><div><a href="#apuntes">Apuntes</a><a href="#laboratorio">Demo</a><a href="#video">Vídeo</a></div></nav>
      <main id="inicio">
        <header className={styles.hero}>
          <div className={styles.meta}><span>ENTREVISTA #003</span><span>REACT · ASYNC UI · 38 MIN</span></div>
          <div className={styles.signal} aria-hidden="true"><i /><i /><i /><i /></div>
          <h1>Juan<br /><em>sigue cargando.</em></h1>
          <div className={styles.intro}><p>Goncy y Juan reparan una lista de usuarios que repetía el primer lote. Del contrato de paginación llegan hasta un infinite scroll robusto: acumulación, límites, concurrencia y ciclo de vida.</p><blockquote>“Tenemos que alejarnos<br />un poco y ver qué pasa.”<cite>— Goncy, 08:22</cite></blockquote></div>
        </header>

        <section className={styles.thesis}><span>EL FLUJO</span><div><b>page</b><i>→</i><b>offset</b><i>→</i><b>fetch</b><i>→</i><b>append</b><i>→</i><b>observe</b></div><p>Una sola señal avanza el sistema. Cada pieza tiene una responsabilidad legible.</p></section>

        <section className={styles.lessons} id="apuntes"><header><span>07 HALLAZGOS · EN CONTEXTO</span><h2>Del botón roto<br />al flujo completo.</h2></header><div>{lessons.map((lesson) => <article key={lesson.number}><span>{lesson.number}<small>{lesson.time}</small></span><div><h3>{lesson.title}</h3><p>{lesson.text}</p></div></article>)}</div></section>

        <section className={styles.choice}><header><span>DOS MODELOS VÁLIDOS</span><h2>¿Quién inicia<br />la petición?</h2></header><article><b>imperativo</b><code>onClick → await loadMore()</code><p>Más control local y una secuencia explícita. Útil cuando la petición pertenece inequívocamente a la acción.</p></article><article><b>declarativo</b><code>setPage() → effect → fetch</code><p>Los datos se expresan como consecuencia de la página. Encaja especialmente bien al sumar más disparadores.</p></article></section>

        <section className={styles.code}><CodeCard label="01 · PAGINACIÓN" title="Traducir página a offset" code={paginationCode} /><CodeCard label="02 · CICLO DE VIDA" title="Observar y desconectar" code={observerCode} /></section>
        <InfiniteUsersLab />

        <section className={styles.review}><div><span>REVISIÓN FINAL · 36:31</span><h2>Lo que faltaba<br />para producción.</h2></div><ul><li><b>01</b><p>Declarar <code>users.length</code> y <code>total</code> como dependencias para evitar closures obsoletas.</p></li><li><b>02</b><p>Desconectar el observer en el cleanup y recrearlo cuando cambie el contexto.</p></li><li><b>03</b><p>Agrupar datos estrechamente relacionados —items y total— siguiendo el shape de la respuesta.</p></li><li><b>04</b><p>Representar <code>loading</code> para impedir dobles peticiones mientras una página está en vuelo.</p></li></ul></section>

        <section className={styles.video} id="video"><header><div><span>ENTREVISTA COMPLETA · 38:50</span><h2>Mira las decisiones,<br />incluidos los tropiezos.</h2></div><p>React live coding sin IA: Goncy entrevista a Juan sobre paginación e infinite scroll.</p></header><VideoPlayer videoId="z65YeWvcvDg" label="Reproducir entrevista de Goncy a Juan" windowTitle="youtube — goncy × juan" /></section>
      </main>
      <footer><span>Entrevistador · Goncy</span><span>Entrevistado · Juan</span><a href="#inicio">Volver arriba ↑</a></footer>
    </div>
  )
}

function CodeCard({ code, label, title }: { code: string; label: string; title: string }) {
  return <article><header><span>{label}</span><h3>{title}</h3></header><pre>{code}</pre></article>
}
