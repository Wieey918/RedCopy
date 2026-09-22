import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, setSessionCookie } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email } })
    if (!user || user.password !== hashPassword(password)) {
      return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 })
    }

    await setSessionCookie(user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt.toISOString(),
      },
    })
  } catch (e) {
    console.error('Login error:', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
