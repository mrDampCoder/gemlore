import Link from 'next/link'
import GemstoneVisual from './GemstoneVisual'
import { Star } from 'lucide-react'

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

interface GemstoneCardProps {
  gemstone: Gemstone
}

const categoryColors: Record<string, string> = {
  Precious: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  'Semi-precious': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Organic: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
}

export default function GemstoneCard({ gemstone }: GemstoneCardProps) {
  return (
    <Link href={`/gemstones/${gemstone.slug}`}>
      <article className="gem-card group h-full flex flex-col">
        <div className="flex justify-center mb-4">
          <GemstoneVisual visualKey={gemstone.visualKey} size={120} />
        </div>

        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-xl font-semibold text-white group-hover:text-gold-400 transition-colors">
            {gemstone.name}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${categoryColors[gemstone.category] || 'bg-white/10 text-white/60 border-white/20'}`}>
            {gemstone.category}
          </span>
        </div>

        <div className="space-y-1.5 mt-auto">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span className="w-2 h-2 rounded-full bg-current flex-shrink-0" style={{ backgroundColor: getColorDot(gemstone.color) }} />
            <span>{gemstone.color}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Star className="w-3.5 h-3.5 text-gold-400/70 flex-shrink-0" />
            <span>Hardness: {gemstone.hardness}</span>
          </div>
          <div className="text-sm text-white/50 truncate">
            📍 {gemstone.origin}
          </div>
        </div>
      </article>
    </Link>
  )
}

function getColorDot(color: string): string {
  const map: Record<string, string> = {
    'Deep red': '#e0115f',
    'Royal blue': '#0f52ba',
    'Vivid green': '#50c878',
    Colorless: '#e0e8f0',
    Violet: '#9966cc',
    'Golden yellow': '#ffc87c',
    'Sky blue': '#87ceeb',
    'Wine red': '#6b1a2e',
    Iridescent: '#b0c8e8',
    'Multi-color': '#50c878',
  }
  return map[color] || '#888'
}
