import type { DetailedHTMLProps, HTMLAttributes } from 'react'

export type YouTubeCommand = 'pauseVideo' | 'playVideo' | 'stopVideo'

export type LiteYouTubeElement = HTMLElement & {
  addIframe: () => void
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lite-youtube': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        params?: string
        videoid: string
        videotitle?: string
        videoplay?: string
        nocookie?: string
      }
    }
  }
}
