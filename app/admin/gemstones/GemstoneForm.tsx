'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { gemstoneSchema } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface GemstoneFormData {
  slug: string
  name: string
  category: string
  color: string
  hardness: number | string
  origin: string
  description: string
  lore: string
  visualKey: string
}

interface GemstoneFormProps {
  initialData?: GemstoneFormData & { id?: string }
  mode: 'create' | 'edit'
}

const VISUAL_KEYS = ['ruby', 'sapphire', 'emerald', 'diamond', 'amethyst', 'topaz', 'aquamarine', 'garnet', 'opal', 'tourmaline']
const CATEGORIES = ['Precious', 'Semi-precious', 'Organic']

export default function GemstoneForm({ initialData, mode }: GemstoneFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<GemstoneFormData>({
    slug: initialData?.slug || '',
    name: initialData?.name || '',
    category: initialData?.category || 'Precious',
    color: initialData?.color || '',
    hardness: initialData?.hardness || '',
    origin: initialData?.origin || '',
    description: initialData?.description || '',
    lore: initialData?.lore || '',
    visualKey: initialData?.visualKey || 'diamond',
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: [] }))
  }

  function autoSlug() {
    if (!form.slug && form.name) {
      setForm((prev) => ({
        ...prev,
        slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    const data = { ...form, hardness: parseFloat(form.hardness as string) }
    const result = gemstoneSchema.safeParse(data)
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string[]>)
      return
    }

    setSubmitting(true)
    try {
      const url = mode === 'create' ? '/api/gemstones' : `/api/gemstones/${initialData?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const responseData = await res.json()

      if (!res.ok) {
        setFormError(responseData.error || 'Failed to save gemstone')
        if (responseData.fieldErrors) setErrors(responseData.fieldErrors)
        return
      }

      router.push('/admin/gemstones')
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="name"
          name="name"
          label="Name"
          placeholder="e.g. Ruby"
          value={form.name}
          onChange={handleChange}
          onBlur={autoSlug}
          error={errors.name?.[0]}
          required
        />
        <Input
          id="slug"
          name="slug"
          label="Slug"
          placeholder="e.g. ruby"
          value={form.slug}
          onChange={handleChange}
          error={errors.slug?.[0]}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label htmlFor="category" className="block text-sm font-medium text-white/80">
            Category<span className="text-red-400 ml-1">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input-field"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-midnight-900">{c}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category[0]}</p>}
        </div>

        <Input
          id="color"
          name="color"
          label="Color"
          placeholder="e.g. Deep red"
          value={form.color}
          onChange={handleChange}
          error={errors.color?.[0]}
          required
        />

        <Input
          id="hardness"
          name="hardness"
          type="number"
          label="Hardness (Mohs)"
          placeholder="1–10"
          min="1"
          max="10"
          step="0.5"
          value={form.hardness}
          onChange={handleChange}
          error={errors.hardness?.[0]}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="origin"
          name="origin"
          label="Primary Origin"
          placeholder="e.g. Myanmar"
          value={form.origin}
          onChange={handleChange}
          error={errors.origin?.[0]}
          required
        />

        <div className="space-y-1">
          <label htmlFor="visualKey" className="block text-sm font-medium text-white/80">
            Visual Style<span className="text-red-400 ml-1">*</span>
          </label>
          <select
            id="visualKey"
            name="visualKey"
            value={form.visualKey}
            onChange={handleChange}
            className="input-field"
          >
            {VISUAL_KEYS.map((k) => (
              <option key={k} value={k} className="bg-midnight-900">{k}</option>
            ))}
          </select>
          {errors.visualKey && <p className="text-red-500 text-sm mt-1">{errors.visualKey[0]}</p>}
        </div>
      </div>

      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="Detailed description of the gemstone..."
        rows={5}
        value={form.description}
        onChange={handleChange}
        error={errors.description?.[0]}
        required
      />

      <Textarea
        id="lore"
        name="lore"
        label="Mythology & Lore"
        placeholder="Historical and cultural significance..."
        rows={5}
        value={form.lore}
        onChange={handleChange}
        error={errors.lore?.[0]}
        required
      />

      <div className="flex gap-3">
        <Button type="submit" loading={submitting}>
          {mode === 'create' ? 'Create Gemstone' : 'Save Changes'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
