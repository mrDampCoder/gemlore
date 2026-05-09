export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import AdminCommentsList from './AdminCommentsList'

export const metadata = { title: 'Manage Comments — Admin' }

export default async function AdminCommentsPage() {
  const [comments, gemstones, articles] = await Promise.all([
    prisma.comment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        gemstone: { select: { id: true, name: true, slug: true } },
        article: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.gemstone.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.article.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
  ])

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Comments</h1>
        <p className="text-white/50 text-sm">{comments.length} total</p>
      </div>
      <AdminCommentsList comments={comments} gemstones={gemstones} articles={articles} />
    </div>
  )
}
