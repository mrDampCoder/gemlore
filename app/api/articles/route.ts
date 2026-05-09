import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { articleSchema } from '@/lib/validation'

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { publishedAt: 'desc' },
    })
    return NextResponse.json({ articles })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const result = articleSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.article.findUnique({ where: { slug: result.data.slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'An article with this slug already exists', fieldErrors: { slug: ['Slug already in use'] } },
        { status: 400 }
      )
    }

    const article = await prisma.article.create({ data: result.data })
    return NextResponse.json({ article }, { status: 201 })
  } catch (e) {
    if (e instanceof NextResponse) return e
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
