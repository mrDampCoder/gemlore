export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionFromCookies } from '@/lib/auth'
import { LayoutDashboard, Gem, BookOpen, Users, MessageSquare, ChevronRight } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionFromCookies()

  if (!session) redirect('/login?redirect=/admin')
  if (session.role !== 'ADMIN') redirect('/403')

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/admin/gemstones', label: 'Gemstones', icon: <Gem className="w-4 h-4" /> },
    { href: '/admin/articles', label: 'Articles', icon: <BookOpen className="w-4 h-4" /> },
    { href: '/admin/users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { href: '/admin/comments', label: 'Comments', icon: <MessageSquare className="w-4 h-4" /> },
  ]

  return (
    <div className="page-container py-8">
      <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
        <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gold-400">Admin</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-52 flex-shrink-0">
          <nav className="glass-card p-3 space-y-1 md:sticky md:top-24">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 py-2">Admin Panel</p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                <span className="text-gold-400/70">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
