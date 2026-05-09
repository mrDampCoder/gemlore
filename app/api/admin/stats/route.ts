import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const [totalUsers, activeUsers, totalGemstones, totalArticles, totalComments, recentUsers, recentComments] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.gemstone.count(),
        prisma.article.count(),
        prisma.comment.count(),
        prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, name: true, email: true, role: true, createdAt: true },
        }),
        prisma.comment.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            user: { select: { name: true } },
            gemstone: { select: { name: true } },
            article: { select: { title: true } },
          },
        }),
      ])

    return NextResponse.json({
      stats: { totalUsers, activeUsers, totalGemstones, totalArticles, totalComments },
      recentUsers,
      recentComments,
    })
  } catch (e) {
    if (e instanceof NextResponse) return e
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
