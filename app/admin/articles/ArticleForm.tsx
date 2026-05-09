'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { articleSchema } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface ArticleFormData {
  slug: string
  title: string
  excerpt: string
  content: string
  authorName: string
}

interface ArticleFormProps {
  initialData?: ArticleFormData & { id?: string }
  mode: 'create' | 'edit'
}

export default function ArticleForm({ initialData, mode }: ArticleFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<ArticleFormData>({
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    authorName: initialData?.authorName || 'GemLore Editorial',
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: [] }))
  }

  function autoSlug() {
    if (!form.slug && form.title) {
      setForm((prev) => ({
        ...prev,
        slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    const result = articleSchema.safeParse(form)
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string[]>)
      return
    }

    setSubmitting(true)
    try {
      const url = mode === 'create' ? '/api/articles' : `/api/articles/${initialData?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const responseData = await res.json()

      if (!res.ok) {
        setFormError(responseData.error || 'Failed to save article')
        if (responseData.fieldErrors) setErrors(responseData.fieldErrors)
        return
      }

      router.push('/admin/articles')
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
          id="title"
          name="title"
          label="Title"
          placeholder="Article title"
          value={form.title}
          onChange={handleChange}
          onBlur={autoSlug}
          error={errors.title?.[0]}
          required
        />
        <Input
          id="slug"
          name="slug"
          label="Slug"
          placeholder="article-slug"
          value={form.slug}
          onChange={handleChange}
          error={errors.slug?.[0]}
          required
        />
      </div>

      <Input
        id="authorName"
        name="authorName"
        label="Author Name"
        placeholder="GemLore Editorial"
        value={form.authorName}
        onChange={handleChange}
        error={errors.authorName?.[0]}
        required
      />

      <Textarea
        id="excerpt"
        name="excerpt"
        label="Excerpt"
        placeholder="Short summary (~30 words)"
        rows={3}
        value={form.excerpt}
        onChange={handleChange}
        error={errors.excerpt?.[0]}
        required
      />

      <Textarea
        id="content"
        name="content"
        label="Content"
        placeholder="Full article content. Separate paragraphs with blank lines. Use **heading** for sub-headings."
        rows={20}
        value={form.content}
        onChange={handleChange}
        error={errors.content?.[0]}
        required
      />

      <div className="flex gap-3">
        <Button type="submit" loading={submitting}>
          {mode === 'create' ? 'Publish Article' : 'Save Changes'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
