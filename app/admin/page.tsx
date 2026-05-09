export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { Users, Gem, BookOpen, MessageSquare, UserCheck } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export const metadata = { title: 'Admin Dashboard — GemLore' }

export default async function AdminDashboard() {
  const [totalUsers, activeUsers, totalGemstones, totalArticles, totalComments, recentUsers, recentComments] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.gemstone.count(),
      prisma.article.count(),
      prisma.comment.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: { select: { name: true } },
          gemstone: { select: { name: true, slug: true } },
          article: { select: { title: true, slug: true } },
        },
      }),
    ])

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: <Users className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/15' },
    { label: 'Active Users', value: activeUsers, icon: <UserCheck className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    { label: 'Gemstones', value: totalGemstones, icon: <Gem className="w-5 h-5" />, color: 'text-gold-400', bg: 'bg-gold-500/15' },
    { label: 'Articles', value: totalArticles, icon: <BookOpen className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/15' },
    { label: 'Comments', value: totalComments, icon: <MessageSquare className="w-5 h-5" />, color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
  ]

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-white/50 text-sm">Overview of GemLore activity</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-4 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-white">Recent Signups</h2>
            <Link href="/admin/users" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold text-sm flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{user.name}</p>
                  <p className="text-xs text-white/40 truncate">{user.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'ADMIN' ? 'bg-gold-500/20 text-gold-400' : 'bg-white/10 text-white/50'}`}>
                    {user.role}
                  </span>
                  <p className="text-xs text-white/30 mt-1">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-white">Recent Comments</h2>
            <Link href="/admin/comments" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentComments.map((comment) => (
              <div key={comment.id} className="py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{comment.user.name}</span>
                  <span className="text-xs text-white/30">on</span>
                  <span className="text-xs text-gold-400/80 truncate">
                    {comment.gemstone?.name || comment.article?.title}
                  </span>
                </div>
                <p className="text-xs text-white/50 line-clamp-2">{comment.content}</p>
                <p className="text-xs text-white/25 mt-1">{formatDate(comment.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
