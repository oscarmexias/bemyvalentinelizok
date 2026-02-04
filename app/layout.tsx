import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Will you be my Valentine?',
  description: 'Una pregunta especial para San Valentín',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
