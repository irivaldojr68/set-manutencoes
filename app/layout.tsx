import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SET Manutenções — Controle de Efetivo',
  description: 'Sistema de controle de horas extras e efetivo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
