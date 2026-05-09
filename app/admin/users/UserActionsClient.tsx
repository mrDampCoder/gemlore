'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ShieldOff, UserCheck, UserX } from 'lucide-react'

interface UserData {
  id: string
  role: string
  isActive: boolean
}

export default function UserActionsClient({ user, isSelf }: { user: UserData; isSelf: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function update(data: { role?: string; isActive?: boolean }) {
    setLoading(true)
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (isSelf) {
    return <span className="text-xs text-white/20 px-2">You</span>
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={() => update({ isActive: !user.isActive })}
        disabled={loading}
        title={user.isActive ? 'Deactivate user' : 'Activate user'}
        className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
          user.isActive
            ? 'text-white/40 hover:text-red-400 hover:bg-white/5'
            : 'text-white/40 hover:text-emerald-400 hover:bg-white/5'
        }`}
      >
        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
      </button>

      <button
        onClick={() => update({ role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
        disabled={loading}
        title={user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
        className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
          user.role === 'ADMIN'
            ? 'text-gold-400/70 hover:text-white/50 hover:bg-white/5'
            : 'text-white/40 hover:text-gold-400 hover:bg-white/5'
        }`}
      >
        {user.role === 'ADMIN' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
      </button>
    </div>
  )
}
