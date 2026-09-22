import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// Simple session token: base64(userId:random:expires)
// In production, use JWT or NextAuth

const SESSION_COOKIE = 'redcopy_session'
const SESSION_EXPIRES_DAYS = 7

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'redcopy_salt_2026').digest('hex')
}

export function createSessionToken(userId: string): string {
  const random = crypto.randomBytes(16).toString('hex')
  const expires = Date.now() + SESSION_EXPIRES_DAYS * 24 * 60 * 60 * 1000
  const payload = `${userId}:${random}:${expires}`
  return Buffer.from(payload).toString('base64')
}

export function parseSessionToken(token: string): { userId: string; expires: number } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')
    if (parts.length !== 3) return null
    const [userId, , expiresStr] = parts
    const expires = parseInt(expiresStr, 10)
    if (isNaN(expires) || expires < Date.now()) return null
    return { userId, expires }
  } catch {
    return null
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const parsed = parseSessionToken(token)
  if (!parsed) return null

  const user = await db.user.findUnique({
    where: { id: parsed.userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      avatar: true,
      bio: true,
      createdAt: true,
    },
  })

  return user
}

export async function setSessionCookie(userId: string) {
  const token = createSessionToken(userId)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_EXPIRES_DAYS * 24 * 60 * 60,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
