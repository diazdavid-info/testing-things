import { Link } from 'react-router-dom'

import { VideoPlayer } from '../../components/video-player/VideoPlayer.tsx'
import { CandeDirectoryLab } from './CandeDirectoryLab.tsx'
import { duplicateCode, lessons, sortCode } from './interview-content.ts'
import styles from './GoncyCandePage.module.css'

export function GoncyCandePage() {
  return (
    <div className={styles.page}>
      <nav><Link to="/">&gt;_ tech.interviews</Link><div><a href="#apuntes">Apuntes</a><a href="#laboratorio">Demo</a><a href="#video">Vídeo</a></div></nav>
      <main id="inicio">
        <header className={styles.hero}>
          <div className={styles.meta}><span>ENTREVISTA #002</span><span>REACT · LIVE CODING · 35 MIN</span></div>
          <div className={styles.title}><span aria-hidden="true">02</span><h1>Cande<br /><em>sin atajos.</em></h1></div>
          <div className={styles.intro}><p>Goncy y Cande trabajan sobre un directorio de usuarios: corrigen la recarga y el reset del formulario, validan los datos, evitan emails duplicados y añaden ordenación por nombre.</p><blockquote>“Don’t sync state.<br />Derive it.”<cite>— Goncy, 20:06</cite></blockquote></div>
        </header>

        <section className={styles.manifesto}><span>EL EJERCICIO</span><p>Agregar. Validar.<br />Evitar duplicados.<br /><em>Ordenar.</em></p></section>

        <section className={styles.lessons} id="apuntes"><header><span>05 TAREAS · EN ORDEN</span><h2>Lo que hicieron,<br />paso a paso.</h2></header><div>{lessons.map((lesson) => <article key={lesson.number}><span>{lesson.number}<small>{lesson.time}</small></span><div><h3>{lesson.title}</h3><p>{lesson.text}</p></div></article>)}</div></section>

        <section className={styles.methods}><header><span>PRECISIÓN DE LENGUAJE</span><h2>Tres métodos,<br />tres intenciones.</h2></header><div className={styles.methodGrid}><article><code>some()</code><b>¿existe?</b><p>Devuelve un booleano. Es la elección natural para impedir duplicados.</p></article><article><code>find()</code><b>¿cuál?</b><p>Devuelve el elemento encontrado o <code>undefined</code>.</p></article><article><code>findIndex()</code><b>¿dónde?</b><p>Devuelve la posición o <code>-1</code>. Úsalo cuando necesitas el índice.</p></article></div></section>

        <section className={styles.codeSection}><CodeBlock number="01" title="Comprobar el email antes de agregar" code={duplicateCode} /><CodeBlock number="02" title="Derivar los usuarios ordenados" code={sortCode} /></section>
        <CandeDirectoryLab />
        <section className={styles.memo}><div><span>CIERRE · 34:47</span><h2><code>useMemo</code><br />en contexto.</h2></div><p>En la solución de la entrevista, <code>useMemo</code> calcula los usuarios ordenados cuando cambian <code>users</code> o la dirección. Al final, Goncy comenta que con React Compiler ese memo podría no ser necesario porque el compilador puede encargarse de la memoización.</p></section>
        <section className={styles.video} id="video"><header><div><span>ENTREVISTA COMPLETA · 35:01</span><h2>Observa el razonamiento,<br />no solo el resultado.</h2></div><p>React live coding sin IA: Goncy entrevista a Cande.</p></header><VideoPlayer videoId="Ug9JtyXHujw" label="Reproducir entrevista de Goncy a Cande" windowTitle="youtube — goncy × cande" /></section>
      </main>
      <footer><span>Entrevistador · Goncy</span><span>Entrevistada · Cande</span><a href="#inicio">Volver arriba ↑</a></footer>
    </div>
  )
}

function CodeBlock({ code, number, title }: { code: string; number: string; title: string }) {
  return <article><header><span>{number} / SOLUCIÓN</span><h3>{title}</h3></header><pre>{code}</pre></article>
}
