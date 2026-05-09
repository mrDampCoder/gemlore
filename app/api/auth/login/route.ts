import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, setSessionCookie } from '@/lib/auth'
import { loginSchema } from '@/lib/validation'
import { stripPasswordHash } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, password, rememberMe } = result.data

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Your account has been deactivated. Please contact support.' }, { status: 403 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const token = await signToken({ sub: user.id, email: user.email, role: user.role }, rememberMe)
    const response = NextResponse.json({ user: stripPasswordHash(user) })
    setSessionCookie(response, token, rememberMe)
    return response
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
