export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteArticleButton from './DeleteArticleButton'
import { Plus, Pencil } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Manage Articles — Admin' }

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: 'desc' } })

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Articles</h1>
          <p className="text-white/50 text-sm">{articles.length} total</p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Article
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-white/40 font-medium">Title</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden md:table-cell">Author</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Published</th>
                <th className="text-right px-4 py-3 text-white/40 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white font-medium">{article.title}</p>
                      <p className="text-xs text-white/30 font-mono">{article.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60 hidden md:table-cell">{article.authorName}</td>
                  <td className="px-4 py-3 text-white/60 hidden lg:table-cell">{formatDate(article.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="p-2 text-white/50 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteArticleButton id={article.id} title={article.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
