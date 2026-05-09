import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser, clearSessionCookie } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireUser(request)
    await prisma.user.delete({ where: { id: session.sub } })
    const response = NextResponse.json({ success: true })
    clearSessionCookie(response)
    return response
  } catch (e) {
    if (e instanceof NextResponse) return e
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
