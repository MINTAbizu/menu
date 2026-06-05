import { useEffect, useState } from 'react'
import QRCodeGenerator from 'qrcode'

type QRCodeProps = {
  data: string
  label: string
  size?: number
}

export function QRCode({ data, label, size = 220 }: QRCodeProps) {
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    let cancelled = false

    QRCodeGenerator.toDataURL(data, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: size,
      color: {
        dark: '#111815',
        light: '#ffffff',
      },
    }).then((url) => {
      if (!cancelled) setImageUrl(url)
    })

    return () => {
      cancelled = true
    }
  }, [data, size])

  return (
    <img
      className="qr-code-image"
      src={imageUrl}
      alt={label}
      width={size}
      height={size}
    />
  )
}
