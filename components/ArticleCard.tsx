import Link from 'next/link'
import { BookOpen, Calendar, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  authorName: string
  publishedAt: Date | string
}

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <article className="gem-card group h-full flex flex-col">
        <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center mb-4 group-hover:bg-gold-500/30 transition-colors">
          <BookOpen className="w-6 h-6 text-gold-400" />
        </div>

        <h3 className="font-display text-xl font-semibold text-white group-hover:text-gold-400 transition-colors mb-3 leading-tight">
          {article.title}
        </h3>

        <p className="text-sm text-white/60 leading-relaxed line-clamp-3 flex-1 mb-4">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-4 text-xs text-white/40 mt-auto pt-3 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{article.authorName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
