export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionFromCookies } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import GemstoneVisual from '@/components/GemstoneVisual'
import UnfavoriteButton from '@/components/UnfavoriteButton'
import { Heart, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'My Favorites — GemLore',
}

export default async function FavoritesPage() {
  const session = await getSessionFromCookies()
  if (!session) redirect('/login?redirect=/favorites')

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.sub },
    include: {
      gemstone: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="page-container py-16 animate-fade-in">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-400" />
          My Favorites
        </h1>
        <p className="text-white/50">Your saved gemstones</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-white mb-3">No favorites yet</h3>
          <p className="text-white/50 mb-6 max-w-sm mx-auto">
            Browse the gemstone catalog and save the ones that captivate you.
          </p>
          <Link href="/gemstones" className="btn-primary inline-flex items-center gap-2">
            Explore Gemstones
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(({ gemstone }) => (
            <div key={gemstone.id} className="gem-card group relative flex flex-col">
              <div className="flex justify-center mb-4">
                <GemstoneVisual visualKey={gemstone.visualKey} size={110} />
              </div>
              <h3 className="font-display text-xl font-semibold text-white group-hover:text-gold-400 transition-colors mb-1">
                {gemstone.name}
              </h3>
              <p className="text-sm text-white/50 mb-1">{gemstone.category}</p>
              <p className="text-sm text-white/40 mb-4">📍 {gemstone.origin}</p>

              <div className="flex gap-2 mt-auto">
                <Link
                  href={`/gemstones/${gemstone.slug}`}
                  className="flex-1 text-center btn-secondary text-sm py-2"
                >
                  View Details
                </Link>
                <UnfavoriteButton gemstoneId={gemstone.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
