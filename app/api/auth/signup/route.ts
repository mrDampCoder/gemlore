import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, setSessionCookie } from '@/lib/auth'
import { signupSchema } from '@/lib/validation'
import { stripPasswordHash } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = signupSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, password, name } = result.data

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists', fieldErrors: { email: ['Email already in use'] } },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email: email.toLowerCase(), passwordHash, name },
    })

    const token = await signToken({ sub: user.id, email: user.email, role: user.role })
    const response = NextResponse.json({ user: stripPasswordHash(user) }, { status: 201 })
    setSessionCookie(response, token)
    return response
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
