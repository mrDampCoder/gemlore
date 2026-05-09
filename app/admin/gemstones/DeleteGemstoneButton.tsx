'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function DeleteGemstoneButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      await fetch(`/api/gemstones/${id}`, { method: 'DELETE' })
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
        title={`Delete "${name}"`}
        message="This will permanently delete this gemstone and all associated comments and favorites. This cannot be undone."
        confirmLabel="Delete Gemstone"
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
        loading={loading}
        dangerous
      />
    </>
  )
}
