'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gem, ArrowLeft, Copy, CheckCircle } from 'lucide-react'
import { forgotPasswordSchema } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resetUrl, setResetUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const result = forgotPasswordSchema.safeParse({ email })
    if (!result.success) {
      setError(result.error.flatten().fieldErrors.email?.[0] || 'Invalid email')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setResetUrl(data.resetUrl)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCopy() {
    if (resetUrl) {
      await navigator.clipboard.writeText(resetUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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
          <h1 className="font-display text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-white/50 mt-2">Enter your email to get a reset link</p>
        </div>

        <div className="glass-card p-8">
          {resetUrl !== undefined ? (
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <h3 className="font-display text-xl font-semibold text-white text-center mb-2">Request Processed</h3>

              {resetUrl ? (
                <div className="mt-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4 text-sm text-amber-300">
                    <strong>Demo Mode:</strong> In production, this link would be sent to your email.
                    For demonstration purposes, it is shown below:
                  </div>
                  <div className="glass-card p-3 flex items-center gap-2">
                    <p className="text-xs text-white/60 flex-1 break-all font-mono">{resetUrl}</p>
                    <button
                      onClick={handleCopy}
                      className="flex-shrink-0 text-white/40 hover:text-gold-400 transition-colors p-1"
                      aria-label="Copy link"
                    >
                      {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <Link
                    href={resetUrl}
                    className="btn-primary text-center block mt-4"
                  >
                    Go to Reset Page
                  </Link>
                </div>
              ) : (
                <p className="text-center text-white/60 text-sm mt-2">
                  If that email is registered, a reset link has been sent. Check your inbox.
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <p className="text-sm text-white/60 mb-4">
                Enter your account email and we&apos;ll provide you with a password reset link.
              </p>

              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                error={error}
                required
                autoComplete="email"
              />

              <Button type="submit" loading={submitting} className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-gold-400 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
