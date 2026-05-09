'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  gemstoneId: string
  initialFavorited: boolean
  isLoggedIn: boolean
}

export default function FavoriteButton({ gemstoneId, initialFavorited, isLoggedIn }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleToggle() {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/gemstones/${gemstoneId}/favorite`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setFavorited(data.favorited)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 active:scale-95 disabled:opacity-50 ${
        favorited
          ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
          : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10 hover:text-white'
      }`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`w-4 h-4 transition-all ${favorited ? 'fill-current' : ''}`} />
      <span className="text-sm font-medium">
        {favorited ? 'Saved' : 'Save'}
      </span>
    </button>
  )
}
