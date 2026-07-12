import { VideoPlayer } from '../../components/video-player/VideoPlayer.tsx'
import styles from './InterviewVideo.module.css'

const VIDEO_ID = 'aSdAZHansJU'

export function InterviewVideo() {
  return (
    <section className={styles.videoSection} id="video" aria-labelledby="video-title">
      <header>
        <div>
          <span>ENTREVISTA COMPLETA · 48:17</span>
          <h2 id="video-title">Mira el proceso<br />de principio a fin.</h2>
        </div>
        <p>Goncy entrevista a Lucas en un live coding de React sin IA.</p>
      </header>

      <VideoPlayer
        videoId={VIDEO_ID}
        label="Reproducir entrevista de Goncy a Lucas"
        windowTitle="youtube — goncy × lucas"
      />
    </section>
  )
}
