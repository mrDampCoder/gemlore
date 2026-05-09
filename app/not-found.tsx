import Link from 'next/link'
import { Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in max-w-lg">
        <div className="w-24 h-24 rounded-2xl bg-gold-500/15 flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-gold-400" />
        </div>
        <h1 className="font-display text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="font-display text-2xl font-semibold text-white/80 mb-4">Page Not Found</h2>
        <p className="text-white/60 leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Perhaps you&apos;re looking for a gemstone or article that&apos;s not in our catalog yet?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/gemstones" className="btn-secondary">
            Browse Gemstones
          </Link>
        </div>
      </div>
    </div>
  )
}
