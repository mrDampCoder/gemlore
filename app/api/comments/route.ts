import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'
import { commentSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser(request)
    const body = await request.json()
    const result = commentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { content, gemstoneId, articleId } = result.data

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.sub,
        gemstoneId: gemstoneId || null,
        articleId: articleId || null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (e) {
    if (e instanceof NextResponse) return e
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
