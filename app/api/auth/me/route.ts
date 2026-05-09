import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripPasswordHash } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.sub } })
    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'User not found or inactive' }, { status: 401 })
    }

    return NextResponse.json({ user: stripPasswordHash(user) })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
