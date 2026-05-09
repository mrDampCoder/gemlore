export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { ArrowRight, Sparkles, BookOpen, Users } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import GemstoneCard from '@/components/GemstoneCard'
import ArticleCard from '@/components/ArticleCard'

async function getFeaturedData() {
  const [gemstones, articles] = await Promise.all([
    prisma.gemstone.findMany({ take: 4, orderBy: { name: 'asc' } }),
    prisma.article.findMany({ take: 3, orderBy: { publishedAt: 'desc' } }),
  ])
  return { gemstones, articles }
}

export default async function HomePage() {
  const { gemstones, articles } = await getFeaturedData()

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-midnight-900 via-midnight-700/80 to-midnight-900 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gem-amethyst/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gem-sapphire/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl" />
        </div>

        <div className="page-container relative z-10 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-500/30 rounded-full px-4 py-2 mb-8 text-sm text-gold-400">
            <Sparkles className="w-4 h-4" />
            <span>Discover the Earth&apos;s Hidden Treasures</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Where Science Meets
            <span className="block text-gradient">Myth &amp; Beauty</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore the geology, history, and folklore behind Earth&apos;s most extraordinary minerals.
            From ancient legends to crystalline science — GemLore illuminates it all.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/gemstones" className="btn-primary flex items-center gap-2 justify-center">
              Explore Gemstones
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/articles" className="btn-secondary flex items-center gap-2 justify-center">
              Read Articles
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: '10+', label: 'Gemstones' },
              { value: '5', label: 'Articles' },
              { value: '∞', label: 'Wonder' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl font-bold text-gold-400">{stat.value}</div>
                <div className="text-sm text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gemstones */}
      <section className="page-container py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-2">The Collection</p>
            <h2 className="section-title">Featured Gemstones</h2>
          </div>
          <Link href="/gemstones" className="text-sm text-white/50 hover:text-gold-400 transition-colors flex items-center gap-1 group">
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gemstones.map((gem) => (
            <GemstoneCard key={gem.id} gemstone={gem} />
          ))}
        </div>
      </section>

      {/* Why GemLore */}
      <section className="py-20 bg-white/3 border-y border-white/5">
        <div className="page-container">
          <div className="text-center mb-14">
            <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-2">Why GemLore</p>
            <h2 className="section-title">More Than a Catalog</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'Deep Science',
                description: 'Explore the geological processes that create gemstones over millions of years — from volcanic kimberlites to metamorphic mountain ranges.',
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: 'Rich Folklore',
                description: 'Discover the myths, legends, and cultural traditions that have surrounded precious stones across civilizations for thousands of years.',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Community',
                description: 'Share your thoughts, save your favorites, and engage with a community of gem enthusiasts, collectors, and geology lovers.',
              },
            ].map((feature) => (
              <div key={feature.title} className="glass-card p-8 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/15 flex items-center justify-center text-gold-400 mx-auto mb-5">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="page-container py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-2">Knowledge</p>
            <h2 className="section-title">Latest Articles</h2>
          </div>
          <Link href="/articles" className="text-sm text-white/50 hover:text-gold-400 transition-colors flex items-center gap-1 group">
            All articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="page-container pb-24">
        <div className="glass-card p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-gem-amethyst/10 pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Begin Your Journey
            </h2>
            <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">
              Create a free account to save your favorite gemstones, join the discussion, and track your collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary">
                Create Free Account
              </Link>
              <Link href="/about" className="btn-secondary">
                Learn About GemLore
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
