export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ArticleForm from '../../ArticleForm'

export const metadata = { title: 'Edit Article — Admin' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params
  const article = await prisma.article.findUnique({ where: { id } })

  if (!article) notFound()

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Edit Article</h1>
        <p className="text-white/50 text-sm">Editing: {article.title}</p>
      </div>
      <div className="glass-card p-6">
        <ArticleForm
          mode="edit"
          initialData={article}
        />
      </div>
    </div>
  )
}
