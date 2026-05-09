export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSessionFromCookies } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripPasswordHash } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GemLore — Gemstone Discovery & Learning',
  description: 'Explore the world of gemstones through stunning visuals, rich geology, and centuries of folklore. GemLore is your educational guide to the Earth\'s most beautiful minerals.',
  keywords: 'gemstones, minerals, geology, crystals, ruby, sapphire, emerald, diamond, amethyst',
}

async function getCurrentUser() {
  try {
    const session = await getSessionFromCookies()
    if (!session) return null
    const user = await prisma.user.findUnique({ where: { id: session.sub } })
    if (!user || !user.isActive) return null
    return stripPasswordHash(user)
  } catch {
    return null
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Navbar user={user} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
