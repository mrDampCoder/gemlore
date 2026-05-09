import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { gemstoneSchema } from '@/lib/validation'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const gemstone = await prisma.gemstone.findUnique({ where: { id } })
    if (!gemstone) return NextResponse.json({ error: 'Gemstone not found' }, { status: 404 })
    return NextResponse.json({ gemstone })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request)
    const { id } = await params
    const body = await request.json()
    const result = gemstoneSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.gemstone.findFirst({
      where: { slug: result.data.slug, NOT: { id } },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Slug already in use by another gemstone', fieldErrors: { slug: ['Slug already in use'] } },
        { status: 400 }
      )
    }

    const gemstone = await prisma.gemstone.update({ where: { id }, data: result.data })
    return NextResponse.json({ gemstone })
  } catch (e) {
    if (e instanceof NextResponse) return e
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request)
    const { id } = await params
    await prisma.gemstone.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof NextResponse) return e
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
