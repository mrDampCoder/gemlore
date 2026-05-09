export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSessionFromCookies } from '@/lib/auth'
import CommentSection from '@/components/CommentSection'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const article = await prisma.article.findUnique({ where: { slug } })
  if (!article) return {}
  return { title: `${article.title} — GemLore`, description: article.excerpt }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      comments: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!article) notFound()

  const session = await getSessionFromCookies()

  const paragraphs = article.content.split('\n\n').filter(Boolean)

  return (
    <div className="page-container py-16 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-gold-400 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>

        <article>
          <header className="mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xl text-white/70 leading-relaxed italic">{article.excerpt}</p>
            </div>
          </header>

          <div className="prose-custom space-y-5">
            {paragraphs.map((para, i) => {
              if (para.startsWith('**') && para.endsWith('**')) {
                return (
                  <h3 key={i} className="font-display text-2xl font-semibold text-white mt-8 mb-3">
                    {para.replace(/\*\*/g, '')}
                  </h3>
                )
              }
              return (
                <p key={i} className="text-white/70 leading-relaxed">
                  {para}
                </p>
              )
            })}
          </div>
        </article>

        <CommentSection
          comments={article.comments}
          articleId={article.id}
          currentUserId={session?.sub}
          currentUserRole={session?.role}
          isLoggedIn={!!session}
        />
      </div>
    </div>
  )
}
