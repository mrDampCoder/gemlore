export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import ArticleCard from '@/components/ArticleCard'
import { BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Articles — GemLore',
  description: 'In-depth articles on gemstone geology, folklore, care, and history.',
}

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="page-container py-16 animate-fade-in">
      <div className="mb-12 text-center">
        <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-3">Knowledge Base</p>
        <h1 className="font-display text-5xl font-bold text-white mb-4">Articles &amp; Guides</h1>
        <p className="text-white/60 max-w-xl mx-auto">
          From the geology of gem formation to the mythology of precious stones — explore our library of in-depth articles.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No articles yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
