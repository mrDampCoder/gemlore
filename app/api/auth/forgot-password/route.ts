import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { forgotPasswordSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = forgotPasswordSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email } = result.data
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

    if (!user) {
      // Always return success to prevent email enumeration
      return NextResponse.json({ success: true, resetUrl: null })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${appUrl}/reset-password?token=${token}`

    return NextResponse.json({ success: true, resetUrl })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
