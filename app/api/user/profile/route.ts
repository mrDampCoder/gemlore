import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'
import { updateProfileSchema } from '@/lib/validation'
import { stripPasswordHash } from '@/lib/utils'

export async function PUT(request: NextRequest) {
  try {
    const session = await requireUser(request)
    const body = await request.json()
    const result = updateProfileSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id: session.sub },
      data: { name: result.data.name },
    })

    return NextResponse.json({ user: stripPasswordHash(user) })
  } catch (e) {
    if (e instanceof NextResponse) return e
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
