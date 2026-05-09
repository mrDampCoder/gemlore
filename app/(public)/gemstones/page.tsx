'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import GemstoneCard from '@/components/GemstoneCard'

interface Gemstone {
  id: string
  slug: string
  name: string
  category: string
  color: string
  hardness: number
  origin: string
  visualKey: string
}

export default function GemstonesPage() {
  const [gemstones, setGemstones] = useState<Gemstone[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [color, setColor] = useState('All')

  const categories = ['All', 'Precious', 'Semi-precious', 'Organic']
  const colors = ['All', 'Deep red', 'Royal blue', 'Vivid green', 'Colorless', 'Violet', 'Golden yellow', 'Sky blue', 'Wine red', 'Iridescent', 'Multi-color']

  useEffect(() => {
    async function fetchGemstones() {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category !== 'All') params.set('category', category)
      if (color !== 'All') params.set('color', color)

      const res = await fetch(`/api/gemstones?${params}`)
      if (res.ok) {
        const data = await res.json()
        setGemstones(data.gemstones)
      }
      setLoading(false)
    }

    const timer = setTimeout(fetchGemstones, 300)
    return () => clearTimeout(timer)
  }, [search, category, color])

  return (
    <div className="page-container py-16 animate-fade-in">
      <div className="mb-12 text-center">
        <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-3">The Collection</p>
        <h1 className="font-display text-5xl font-bold text-white mb-4">Gemstone Catalog</h1>
        <p className="text-white/60 max-w-xl mx-auto">
          Explore Earth&apos;s most captivating minerals — from precious rubies and sapphires to iridescent opals and colorful tourmalines.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search gemstones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-white/40 flex-shrink-0" />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field md:w-44"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-midnight-900">{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="input-field md:w-44"
          >
            {colors.map((c) => (
              <option key={c} value={c} className="bg-midnight-900">{c === 'All' ? 'All Colors' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-2xl" />
          ))}
        </div>
      ) : gemstones.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No gemstones found matching your filters.</p>
          <button
            onClick={() => { setSearch(''); setCategory('All'); setColor('All') }}
            className="mt-4 text-gold-400 hover:text-gold-300 text-sm transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-white/40 mb-4">{gemstones.length} gemstone{gemstones.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gemstones.map((gem) => (
              <GemstoneCard key={gem.id} gemstone={gem} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
