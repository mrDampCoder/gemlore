import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { searchParams } = new URL(request.url)
    const gemstoneId = searchParams.get('gemstoneId')
    const articleId = searchParams.get('articleId')

    const comments = await prisma.comment.findMany({
      where: {
        ...(gemstoneId && { gemstoneId }),
        ...(articleId && { articleId }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        gemstone: { select: { id: true, name: true, slug: true } },
        article: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ comments })
  } catch (e) {
    if (e instanceof NextResponse) return e
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
