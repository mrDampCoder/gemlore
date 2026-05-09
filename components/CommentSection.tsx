'use client'

import { useState } from 'react'
import { MessageSquare, Trash2, Send } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Button from './ui/Button'

interface Comment {
  id: string
  content: string
  createdAt: Date | string
  user: { id: string; name: string }
}

interface CommentSectionProps {
  comments: Comment[]
  gemstoneId?: string
  articleId?: string
  currentUserId?: string
  currentUserRole?: string
  isLoggedIn: boolean
}

export default function CommentSection({
  comments: initialComments,
  gemstoneId,
  articleId,
  currentUserId,
  currentUserRole,
  isLoggedIn,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      setError('Comment cannot be empty')
      return
    }
    if (content.trim().length > 2000) {
      setError('Comment is too long (max 2000 characters)')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), gemstoneId, articleId }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to post comment')
        return
      }

      const data = await res.json()
      setComments([data.comment, ...comments])
      setContent('')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(commentId: string) {
    setDeletingId(commentId)
    try {
      await fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
      setComments(comments.filter((c) => c.id !== commentId))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-semibold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-gold-400" />
        Discussion
        <span className="text-sm font-sans text-white/40 font-normal">({comments.length})</span>
      </h2>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="glass-card p-4 mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts about this gemstone..."
            rows={3}
            className="input-field resize-none mb-3"
            maxLength={2000}
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30">{content.length}/2000</span>
            <Button type="submit" size="sm" loading={submitting}>
              <Send className="w-4 h-4" />
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="glass-card p-4 mb-8 text-center text-white/50 text-sm">
          <a href="/login" className="text-gold-400 hover:text-gold-300 transition-colors">Log in</a> to join the discussion.
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-center text-white/40 py-8">No comments yet. Be the first to share your thoughts!</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="glass-card p-4 flex gap-4">
            <div className="w-9 h-9 rounded-full bg-midnight-500 flex items-center justify-center text-gold-400 font-bold text-sm flex-shrink-0">
              {comment.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-medium text-white text-sm">{comment.user.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/30">{formatDate(comment.createdAt)}</span>
                  {(comment.user.id === currentUserId || currentUserRole === 'ADMIN') && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
                      className="text-white/30 hover:text-red-400 transition-colors p-1"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
