'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function DeleteArticleButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-white/50 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
        aria-label="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <ConfirmDialog
        isOpen={open}
        title={`Delete article`}
        message={`Delete "${title}"? This will also delete all associated comments.`}
        confirmLabel="Delete Article"
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
        loading={loading}
        dangerous
      />
    </>
  )
}
