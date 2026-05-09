'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UnfavoriteButton({ gemstoneId }: { gemstoneId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleUnfavorite() {
    setLoading(true)
    try {
      await fetch(`/api/gemstones/${gemstoneId}/favorite`, { method: 'POST' })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUnfavorite}
      disabled={loading}
      className="btn-danger text-sm py-2 px-3 flex items-center gap-1 disabled:opacity-50"
      aria-label="Remove from favorites"
    >
      <Heart className="w-4 h-4 fill-current" />
    </button>
  )
}
