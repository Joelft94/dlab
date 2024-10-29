import { Providers } from '@/components/providers'
import './globals.css'
import type { Metadata } from 'next'
import { cn } from "@/lib/utils"

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
    <html lang="en" className="dark">
      <body className={cn("min-h-screen bg-background antialiased")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}