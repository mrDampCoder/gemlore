'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Gem, Eye, EyeOff } from 'lucide-react'
import { signupSchema } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface FieldErrors {
  name?: string[]
  email?: string[]
  password?: string[]
  confirmPassword?: string[]
}

function getPasswordStrength(password: string): { level: 'weak' | 'medium' | 'strong'; label: string; color: string } {
  if (password.length === 0) return { level: 'weak', label: '', color: '' }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { level: 'weak', label: 'Weak', color: 'bg-red-500' }
  if (score <= 3) return { level: 'medium', label: 'Medium', color: 'bg-yellow-500' }
  return { level: 'strong', label: 'Strong', color: 'bg-emerald-500' }
}

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const strength = getPasswordStrength(form.password)

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

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: ['Passwords do not match'] })
      return
    }

    const result = signupSchema.safeParse(form)
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as FieldErrors)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, name: form.name }),
      })
      const data = await res.json()

      if (!res.ok) {
        setFormError(data.error || 'Signup failed. Please try again.')
        if (data.fieldErrors) setErrors(data.fieldErrors)
        return
      }

      router.push('/')
      router.refresh()
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
          <h1 className="font-display text-3xl font-bold text-white">Create your account</h1>
          <p className="text-white/50 mt-2">Join the GemLore community</p>
        </div>

        <div className="glass-card p-8">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 text-sm text-red-400">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              id="name"
              name="name"
              label="Full Name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              error={errors.name?.[0]}
              required
              autoComplete="name"
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email?.[0]}
              required
              autoComplete="email"
            />

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-white/80">
                Password<span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, include letter and number"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`input-field pr-12 ${errors.password ? 'border-red-500/50' : ''}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}

              {/* Password strength indicator */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {['weak', 'medium', 'strong'].map((level, i) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          (strength.level === 'weak' && i === 0) ||
                          (strength.level === 'medium' && i <= 1) ||
                          (strength.level === 'strong' && i <= 2)
                            ? strength.color
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    strength.level === 'weak' ? 'text-red-400' :
                    strength.level === 'medium' ? 'text-yellow-400' :
                    'text-emerald-400'
                  }`}>
                    Password strength: {strength.label}
                  </p>
                </div>
              )}
            </div>

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword?.[0]}
              required
              autoComplete="new-password"
            />

            <Button type="submit" loading={submitting} className="w-full mt-6">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-gold-400 hover:text-gold-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
