import { Providers } from '@/components/providers'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'dTalent Dashboard',
  description: 'dTalent user and receipt management dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}