import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'
import { changePasswordSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser(request)
    const body = await request.json()
    const result = changePasswordSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = result.data

    const user = await prisma.user.findUnique({ where: { id: session.sub } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { error: 'Current password is incorrect', fieldErrors: { currentPassword: ['Incorrect password'] } },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof NextResponse) return e
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
