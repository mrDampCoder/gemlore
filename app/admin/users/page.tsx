export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'
import UserActionsClient from './UserActionsClient'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Manage Users — Admin' }

export default async function AdminUsersPage() {
  const session = await getSessionFromCookies()
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      lastLoginAt: true,
    },
  })

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Users</h1>
        <p className="text-white/50 text-sm">{users.length} total registered</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-white/40 font-medium">User</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden sm:table-cell">Role</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Joined</th>
                <th className="text-right px-4 py-3 text-white/40 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold text-sm flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-xs text-white/40">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-gold-500/20 text-gold-400' : 'bg-white/10 text-white/60'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40 text-xs hidden lg:table-cell">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <UserActionsClient
                      user={user}
                      isSelf={user.id === session?.sub}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
