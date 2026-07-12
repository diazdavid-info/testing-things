import '@justinribeiro/lite-youtube'
import { useRef } from 'react'

import styles from './VideoPlayer.module.css'
import type { LiteYouTubeElement, YouTubeCommand } from './lite-youtube.d.ts'

type VideoPlayerProps = {
  label: string
  videoId: string
  windowTitle?: string
  youtubeParams?: string
}

export function VideoPlayer({
  label,
  videoId,
  windowTitle = 'youtube',
  youtubeParams = 'controls=1&rel=0&enablejsapi=1',
}: VideoPlayerProps) {
  const playerElement = useRef<LiteYouTubeElement>(null)

  const controlPlayer = (command: YouTubeCommand) => {
    const element = playerElement.current
    if (!element) return

    if (command === 'playVideo') element.addIframe()
    const iframe = element.shadowRoot?.querySelector('iframe')
    iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: command, args: '' }), '*')
  }

  return (
    <div className={styles.playerFrame}>
      <div className={styles.windowBar} aria-hidden="true">
        <span /><span /><span />
        <p>{windowTitle}</p>
      </div>
      <lite-youtube
        ref={playerElement}
        videoid={videoId}
        videotitle={label}
        videoplay="Reproducir"
        params={youtubeParams}
        nocookie=""
      />
      <div className={styles.playerControls} aria-label="Controles del vídeo">
        <button type="button" onClick={() => controlPlayer('playVideo')}>
          <span aria-hidden="true">▶</span> Reproducir
        </button>
        <button type="button" onClick={() => controlPlayer('pauseVideo')}>
          <span aria-hidden="true">Ⅱ</span> Pausar
        </button>
        <button type="button" onClick={() => controlPlayer('stopVideo')}>
          <span aria-hidden="true">■</span> Detener
        </button>
      </div>
    </div>
  )
}
