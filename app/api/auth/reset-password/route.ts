import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { resetPasswordSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = resetPasswordSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { token, password } = result.data

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
    }

    if (resetToken.used) {
      return NextResponse.json({ error: 'This reset link has already been used' }, { status: 400 })
    }

    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
