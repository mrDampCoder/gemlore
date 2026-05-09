'use client'

import { useState } from 'react'
import { Trash2, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'

interface Comment {
  id: string
  content: string
  createdAt: Date | string
  user: { id: string; name: string; email: string }
  gemstone: { id: string; name: string; slug: string } | null
  article: { id: string; title: string; slug: string } | null
}

interface Props {
  comments: Comment[]
  gemstones: { id: string; name: string }[]
  articles: { id: string; title: string }[]
}

export default function AdminCommentsList({ comments: initialComments, gemstones, articles }: Props) {
  const router = useRouter()
  const [comments, setComments] = useState(initialComments)
  const [filter, setFilter] = useState<{ type: 'all' | 'gemstone' | 'article'; id: string }>({ type: 'all', id: '' })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = comments.filter((c) => {
    if (filter.type === 'gemstone' && filter.id) return c.gemstone?.id === filter.id
    if (filter.type === 'article' && filter.id) return c.article?.id === filter.id
    return true
  })

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      setComments((prev) => prev.filter((c) => c.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <select
          value={filter.type}
          onChange={(e) => setFilter({ type: e.target.value as 'all' | 'gemstone' | 'article', id: '' })}
          className="input-field sm:w-40"
        >
          <option value="all" className="bg-midnight-900">All Comments</option>
          <option value="gemstone" className="bg-midnight-900">By Gemstone</option>
          <option value="article" className="bg-midnight-900">By Article</option>
        </select>

        {filter.type === 'gemstone' && (
          <select
            value={filter.id}
            onChange={(e) => setFilter((p) => ({ ...p, id: e.target.value }))}
            className="input-field flex-1"
          >
            <option value="" className="bg-midnight-900">Select Gemstone</option>
            {gemstones.map((g) => (
              <option key={g.id} value={g.id} className="bg-midnight-900">{g.name}</option>
            ))}
          </select>
        )}

        {filter.type === 'article' && (
          <select
            value={filter.id}
            onChange={(e) => setFilter((p) => ({ ...p, id: e.target.value }))}
            className="input-field flex-1"
          >
            <option value="" className="bg-midnight-900">Select Article</option>
            {articles.map((a) => (
              <option key={a.id} value={a.id} className="bg-midnight-900">{a.title}</option>
            ))}
          </select>
        )}

        <span className="text-sm text-white/40 self-center">{filtered.length} comments</span>
      </div>

      {/* Comments list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-white/40">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No comments found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((comment) => (
            <div key={comment.id} className="glass-card p-4 flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-medium text-white">{comment.user.name}</span>
                  <span className="text-xs text-white/30">on</span>
                  <span className="text-xs text-gold-400/80">
                    {comment.gemstone?.name || comment.article?.title}
                  </span>
                  <span className="text-xs text-white/25 ml-auto">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-white/60 line-clamp-2">{comment.content}</p>
                <p className="text-xs text-white/25 mt-1">{comment.user.email}</p>
              </div>
              <button
                onClick={() => handleDelete(comment.id)}
                disabled={deletingId === comment.id}
                className="text-white/30 hover:text-red-400 transition-colors p-1 self-start flex-shrink-0 disabled:opacity-50"
                aria-label="Delete comment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
