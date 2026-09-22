import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, setSessionCookie } from '@/lib/session'
import { checkCode } from '@/lib/verification-codes'

export async function POST(req: NextRequest) {
  try {
    const { email, password, nickname, code } = await req.json()

    if (!email || !password || !nickname) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'password_too_short' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'email_exists' }, { status: 409 })
    }
    // 校验注册验证码（一次性，checkCode 成功即消费）
    if (!checkCode(`register:${email}`, code)) {
      return NextResponse.json({ error: 'invalid_code' }, { status: 400 })
    }

    const user = await db.user.create({
      data: {
        email,
        password: hashPassword(password),
        nickname,
      },
    })

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
    console.error('Register error:', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
