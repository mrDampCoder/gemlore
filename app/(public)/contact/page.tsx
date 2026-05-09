'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { contactSchema } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface FormState {
  name: string
  email: string
  message: string
}

interface FieldErrors {
  name?: string[]
  email?: string[]
  message?: string[]
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    const result = contactSchema.safeParse(form)
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as FieldErrors)
      return
    }

    setSubmitting(true)
    // Simulate submission — contact form is demo only
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)
    setSuccess(true)
  }

  return (
    <div className="page-container py-16 animate-fade-in">
      <div className="text-center mb-14">
        <p className="text-gold-400 text-sm font-medium uppercase tracking-widest mb-3">Get in Touch</p>
        <h1 className="font-display text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-white/60 max-w-xl mx-auto">
          Have a question about a gemstone, a suggestion for our catalog, or just want to say hello?
          We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-display text-xl font-semibold text-white mb-5">Contact Information</h2>
            <div className="space-y-4">
              {[
                { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'hello@gemlore.com' },
                { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+1 (555) 000-GEMS' },
                { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'Online — Worldwide' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center text-gold-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wide mb-0.5">{item.label}</p>
                    <p className="text-white text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-3">Response Time</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              We typically respond to inquiries within 1–2 business days. For urgent gemstone identification
              questions, please include a clear description and any photos you have available.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-white mb-2">Message Sent!</h3>
              <p className="text-white/60">Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="font-display text-xl font-semibold text-white mb-6">Send a Message</h2>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-sm text-red-400">
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name?.[0]}
                  required
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
                />
                <Textarea
                  id="message"
                  name="message"
                  label="Message"
                  placeholder="Tell us what's on your mind..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  error={errors.message?.[0]}
                  required
                />

                <Button type="submit" loading={submitting} className="w-full">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
