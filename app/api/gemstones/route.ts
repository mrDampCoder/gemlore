import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { gemstoneSchema } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim()
    const category = searchParams.get('category')?.trim()
    const color = searchParams.get('color')?.trim()

    const gemstones = await prisma.gemstone.findMany({
      where: {
        ...(search && {
          name: { contains: search, mode: 'insensitive' },
        }),
        ...(category && category !== 'All' && { category }),
        ...(color && color !== 'All' && {
          color: { contains: color, mode: 'insensitive' },
        }),
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ gemstones })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const result = gemstoneSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.gemstone.findUnique({ where: { slug: result.data.slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'A gemstone with this slug already exists', fieldErrors: { slug: ['Slug already in use'] } },
        { status: 400 }
      )
    }

    const gemstone = await prisma.gemstone.create({ data: result.data })
    return NextResponse.json({ gemstone }, { status: 201 })
  } catch (e) {
    if (e instanceof NextResponse) return e
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
