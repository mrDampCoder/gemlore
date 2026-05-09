import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'gemlore_session'
const JWT_SECRET_VALUE = process.env.JWT_SECRET || 'fallback-secret-change-in-production'

function getSecret() {
  return new TextEncoder().encode(JWT_SECRET_VALUE)
}

export interface JWTPayload {
  sub: string
  email: string
  role: 'USER' | 'ADMIN'
  iat?: number
  exp?: number
}

export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, rememberMe = false): Promise<string> {
  const expiresIn = rememberMe ? '30d' : '1h'
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getSessionFromCookies(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export function setSessionCookie(response: NextResponse, token: string, rememberMe = false) {
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  })
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
}

export async function getSessionFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireUser(request: NextRequest): Promise<JWTPayload> {
  const session = await getSessionFromRequest(request)
  if (!session) {
    throw NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  return session
}

export async function requireAdmin(request: NextRequest): Promise<JWTPayload> {
  const session = await requireUser(request)
  if (session.role !== 'ADMIN') {
    throw NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }
  return session
}
