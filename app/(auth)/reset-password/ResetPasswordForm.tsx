'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Gem, CheckCircle, AlertCircle } from 'lucide-react'
import { resetPasswordSchema } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface FieldErrors {
  password?: string[]
  confirmPassword?: string[]
}

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (formError) setFormError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    const result = resetPasswordSchema.safeParse({ token: token || '', ...form })
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as FieldErrors)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password, confirmPassword: form.confirmPassword }),
      })
      const data = await res.json()

      if (!res.ok) {
        setFormError(data.error || 'Failed to reset password.')
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors mb-6">
            <Gem className="w-7 h-7" />
            <span className="font-display text-2xl font-bold">GemLore</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">Set New Password</h1>
        </div>

        <div className="glass-card p-8">
          {!token && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2">Invalid Reset Link</h3>
              <p className="text-white/60 text-sm mb-6">This reset link is invalid or missing. Please request a new one.</p>
              <Link href="/forgot-password" className="btn-primary inline-block">Request New Link</Link>
            </div>
          )}

          {token && success && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-2">Password Updated!</h3>
              <p className="text-white/60 text-sm">Your password has been changed. Redirecting to login...</p>
            </div>
          )}

          {token && !success && (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <p className="text-sm text-white/60 mb-4">Enter your new password below.</p>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                  {formError}
                  {formError.includes('expired') && (
                    <Link href="/forgot-password" className="block mt-2 text-gold-400 hover:text-gold-300">
                      Request a new reset link →
                    </Link>
                  )}
                </div>
              )}

              <Input
                id="password"
                name="password"
                type="password"
                label="New Password"
                placeholder="Min 8 chars, include letter and number"
                value={form.password}
                onChange={handleChange}
                error={errors.password?.[0]}
                required
                autoComplete="new-password"
              />

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm New Password"
                placeholder="Repeat your new password"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword?.[0]}
                required
                autoComplete="new-password"
              />

              <Button type="submit" loading={submitting} className="w-full">
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
