import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireUser(request)
    const { id: gemstoneId } = await params

    const gemstone = await prisma.gemstone.findUnique({ where: { id: gemstoneId } })
    if (!gemstone) return NextResponse.json({ error: 'Gemstone not found' }, { status: 404 })

    const existing = await prisma.favorite.findUnique({
      where: { userId_gemstoneId: { userId: session.sub, gemstoneId } },
    })

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } })
      return NextResponse.json({ favorited: false })
    } else {
      await prisma.favorite.create({ data: { userId: session.sub, gemstoneId } })
      return NextResponse.json({ favorited: true })
    }
  } catch (e) {
    if (e instanceof NextResponse) return e
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
