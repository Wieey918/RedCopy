// src/app/api/auth/register/send-code/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tooFrequent, saveCode } from '@/lib/verification-codes'
import { sendVerificationCode } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }

    // 注册场景：已注册要明确拒绝（和忘记密码相反）
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'email_exists' }, { status: 409 })
    }

    if (tooFrequent(`register:${email}`)) {
      return NextResponse.json({ error: 'send_too_frequent' }, { status: 429 })
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))
    await saveCode(`register:${email}`, code)

    try {
     await sendVerificationCode(email, code, 'register')
   } catch (e) {
     console.error('邮件发送失败:', e)
     return NextResponse.json({ error: 'email_send_failed' }, { status: 502 })
   }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Register send-code error:', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
