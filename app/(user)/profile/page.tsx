'use client'

import { useState, useEffect } from 'react'
import { User, Lock, Trash2, CheckCircle } from 'lucide-react'
import { updateProfileSchema, changePasswordSchema } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useRouter } from 'next/navigation'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Profile form
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileSubmitting, setProfileSubmitting] = useState(false)

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwErrors, setPwErrors] = useState<Record<string, string[]>>({})
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwSubmitting, setPwSubmitting] = useState(false)

  // Account deletion
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user)
        setName(data.user?.name || '')
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault()
    setNameError('')
    setProfileSuccess(false)

    const result = updateProfileSchema.safeParse({ name })
    if (!result.success) {
      setNameError(result.error.flatten().fieldErrors.name?.[0] || 'Invalid name')
      return
    }

    setProfileSubmitting(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setProfileSuccess(true)
        setTimeout(() => { setProfileSuccess(false); router.refresh() }, 2000)
      }
    } finally {
      setProfileSubmitting(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPwErrors({})
    setPwError('')
    setPwSuccess(false)

    const result = changePasswordSchema.safeParse(pwForm)
    if (!result.success) {
      setPwErrors(result.error.flatten().fieldErrors as Record<string, string[]>)
      return
    }

    setPwSubmitting(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pwForm),
      })
      const data = await res.json()

      if (!res.ok) {
        setPwError(data.error || 'Failed to change password')
        if (data.fieldErrors) setPwErrors(data.fieldErrors)
        return
      }

      setPwSuccess(true)
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPwSuccess(false), 3000)
    } finally {
      setPwSubmitting(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      await fetch('/api/user/account', { method: 'DELETE' })
      router.push('/')
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container py-16 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-white/50">Manage your account settings and security</p>
        </div>

        {/* Account Info */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center text-midnight-900 font-bold text-2xl flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{user?.name}</p>
              <p className="text-white/50 text-sm">{user?.email}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${user?.role === 'ADMIN' ? 'bg-gold-500/20 text-gold-400' : 'bg-white/10 text-white/60'}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-gold-400" /> Edit Profile
            </h2>

            {profileSuccess && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle className="w-4 h-4" /> Profile updated successfully!
              </div>
            )}

            <Input
              id="name"
              name="name"
              label="Display Name"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError('') }}
              error={nameError}
              required
            />
            <p className="text-xs text-white/30">Email address cannot be changed.</p>

            <Button type="submit" loading={profileSubmitting} size="sm">
              Save Changes
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-gold-400" /> Change Password
          </h2>

          {pwSuccess && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm mb-4">
              <CheckCircle className="w-4 h-4" /> Password changed successfully!
            </div>
          )}

          {pwError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-sm text-red-400">
              {pwError}
            </div>
          )}

          <form onSubmit={handlePasswordChange} noValidate className="space-y-4">
            <p className="text-sm text-white/50">
              For security, enter your current password before setting a new one.
            </p>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              label="Current Password"
              placeholder="Your current password"
              value={pwForm.currentPassword}
              onChange={(e) => { setPwForm((p) => ({ ...p, currentPassword: e.target.value })); setPwErrors((p) => ({ ...p, currentPassword: [] })) }}
              error={pwErrors.currentPassword?.[0]}
              required
              autoComplete="current-password"
            />
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Min 8 chars, include letter and number"
              value={pwForm.newPassword}
              onChange={(e) => { setPwForm((p) => ({ ...p, newPassword: e.target.value })); setPwErrors((p) => ({ ...p, newPassword: [] })) }}
              error={pwErrors.newPassword?.[0]}
              required
              autoComplete="new-password"
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Repeat new password"
              value={pwForm.confirmPassword}
              onChange={(e) => { setPwForm((p) => ({ ...p, confirmPassword: e.target.value })); setPwErrors((p) => ({ ...p, confirmPassword: [] })) }}
              error={pwErrors.confirmPassword?.[0]}
              required
              autoComplete="new-password"
            />
            <Button type="submit" loading={pwSubmitting} size="sm">
              Change Password
            </Button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="glass-card p-6 border-red-500/20">
          <h2 className="font-display text-lg font-semibold text-red-400 flex items-center gap-2 mb-3">
            <Trash2 className="w-5 h-5" /> Delete Account
          </h2>
          <p className="text-sm text-white/50 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete My Account
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Account"
        message="This will permanently delete your account, comments, and all favorites. This action cannot be undone."
        confirmLabel="Yes, Delete My Account"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteDialog(false)}
        loading={deleting}
        dangerous
      />
    </div>
  )
}
