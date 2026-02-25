import { useEffect, useRef } from 'react'
import './Example1.css'
import { Html5QrcodeScanner, type QrcodeSuccessCallback } from 'html5-qrcode'
import type { Html5QrcodeScannerConfig } from 'html5-qrcode/html5-qrcode-scanner'

const qrcodeRegionId = 'html5qr-code-full-region'

export function Example1() {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    const config: Html5QrcodeScannerConfig = {
      fps: 10,
      qrbox: 250,
      aspectRatio: 1,
      disableFlip: false,
      rememberLastUsedCamera: true,
    }

    const qrCodeSuccessCallback: QrcodeSuccessCallback = (decodedText, decodedResult) => {
      console.log(`Code matched = ${decodedText}`, decodedResult)
    }

    const scanner = new Html5QrcodeScanner(qrcodeRegionId, config, false)
    scannerRef.current = scanner
    scanner.render(qrCodeSuccessCallback, undefined)

    return () => {
      scanner.clear().catch((error) => {
        console.error('Failed to clear html5QrcodeScanner. ', error)
      })
    }
  }, [])

  return (
    <div className="scanner-page">
      <div className="scanner-header">
        <h1>Html5-QRCode Example</h1>
        <p>
          Using{' '}
          <a href="https://www.npmjs.com/package/html5-qrcode" target="_blank" rel="noopener noreferrer">
            html5-qrcode
          </a>
        </p>
      </div>
      <div className="scanner-container">
        <div id={qrcodeRegionId} />
      </div>
    </div>
  )
}
