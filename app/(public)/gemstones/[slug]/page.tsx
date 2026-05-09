export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'
import GemstoneVisual from '@/components/GemstoneVisual'
import CommentSection from '@/components/CommentSection'
import FavoriteButton from '@/components/FavoriteButton'
import { ArrowLeft, Gem } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const gemstone = await prisma.gemstone.findUnique({ where: { slug } })
  if (!gemstone) return {}
  return {
    title: `${gemstone.name} — GemLore`,
    description: gemstone.description.substring(0, 160),
  }
}

export default async function GemstoneDetailPage({ params }: PageProps) {
  const { slug } = await params

  const gemstone = await prisma.gemstone.findUnique({
    where: { slug },
    include: {
      comments: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!gemstone) notFound()

  const session = await getSessionFromCookies()
  let isFavorited = false

  if (session) {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_gemstoneId: { userId: session.sub, gemstoneId: gemstone.id } },
    })
    isFavorited = !!favorite
  }

  const colorMap: Record<string, string> = {
    ruby: 'from-red-900/30',
    sapphire: 'from-blue-900/30',
    emerald: 'from-emerald-900/30',
    diamond: 'from-slate-700/30',
    amethyst: 'from-purple-900/30',
    topaz: 'from-yellow-900/30',
    aquamarine: 'from-cyan-900/30',
    garnet: 'from-rose-900/30',
    opal: 'from-indigo-900/30',
    tourmaline: 'from-green-900/30',
  }

  const heroBg = colorMap[gemstone.visualKey] || 'from-midnight-700/30'

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className={`bg-gradient-to-b ${heroBg} to-transparent py-16`}>
        <div className="page-container">
          <Link href="/gemstones" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-gold-400 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Gemstones
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
            {/* Illustration */}
            <div className="flex-shrink-0">
              <div className="w-56 h-56 lg:w-72 lg:h-72 relative">
                <GemstoneVisual visualKey={gemstone.visualKey} size={288} className="drop-shadow-2xl" />
              </div>
            </div>

            {/* Header info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-2">
                <span className="mt-1 text-xs px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400">
                  {gemstone.category}
                </span>
              </div>
              <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-4">{gemstone.name}</h1>
              <p className="text-white/60 max-w-xl leading-relaxed mb-6">{gemstone.description.substring(0, 200)}...</p>

              <div className="flex items-center gap-3 flex-wrap">
                <FavoriteButton
                  gemstoneId={gemstone.id}
                  initialFavorited={isFavorited}
                  isLoggedIn={!!session}
                />
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Gem className="w-4 h-4 text-gold-400/60" />
                  <span>Mohs {gemstone.hardness}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-gold-400">✦</span> About this Gem
              </h2>
              <p className="text-white/70 leading-relaxed">{gemstone.description}</p>
            </section>

            {/* Lore */}
            <section className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full" />
              <h2 className="font-display text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-gold-400">✦</span> Mythology &amp; Lore
              </h2>
              <p className="text-white/70 leading-relaxed relative">{gemstone.lore}</p>
            </section>

            {/* Comments */}
            <CommentSection
              comments={gemstone.comments}
              gemstoneId={gemstone.id}
              currentUserId={session?.sub}
              currentUserRole={session?.role}
              isLoggedIn={!!session}
            />
          </div>

          {/* Sidebar: properties */}
          <aside className="space-y-6">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="font-display text-lg font-semibold text-white mb-4">Properties</h3>
              <dl className="space-y-3">
                {[
                  { label: 'Category', value: gemstone.category },
                  { label: 'Color', value: gemstone.color },
                  { label: 'Hardness (Mohs)', value: gemstone.hardness.toString() },
                  { label: 'Primary Origin', value: gemstone.origin },
                ].map((prop) => (
                  <div key={prop.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <dt className="text-sm text-white/40">{prop.label}</dt>
                    <dd className="text-sm font-medium text-white">{prop.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Hardness scale visual */}
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-4">Mohs Scale</h3>
              <div className="relative">
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-1000"
                    style={{ width: `${(gemstone.hardness / 10) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-white/30">1 (soft)</span>
                  <span className="text-xs text-gold-400 font-medium">{gemstone.hardness}</span>
                  <span className="text-xs text-white/30">10 (diamond)</span>
                </div>
              </div>
              <p className="text-xs text-white/40 mt-3">
                {gemstone.hardness >= 8
                  ? 'Excellent hardness — ideal for everyday wear.'
                  : gemstone.hardness >= 6.5
                  ? 'Good hardness — suitable for most jewelry with care.'
                  : 'Moderate hardness — best for protected settings.'}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
