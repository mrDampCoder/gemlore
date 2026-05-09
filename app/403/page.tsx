import Link from 'next/link'
import { ShieldX, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: '403 — Access Denied | GemLore',
}

export default function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in max-w-lg">
        <div className="w-24 h-24 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-12 h-12 text-red-400" />
        </div>
        <h1 className="font-display text-6xl font-bold text-white mb-4">403</h1>
        <h2 className="font-display text-2xl font-semibold text-white/80 mb-4">Access Denied</h2>
        <p className="text-white/60 leading-relaxed mb-8">
          You don&apos;t have permission to access this page. This area is restricted to administrators.
          If you believe this is an error, please contact the site administrator.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/login" className="btn-secondary">
            Log In as Admin
          </Link>
        </div>
      </div>
    </div>
  )
}
