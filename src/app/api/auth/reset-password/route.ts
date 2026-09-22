import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/session'
import { checkCode } from '@/lib/verification-codes'

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json()

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'password_too_short' }, { status: 400 })
    }

    // 校验验证码（一次性，成功即消费）
    if (!checkCode(`forgot:${email}`, code)) {
      return NextResponse.json({ error: 'invalid_code' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      // 不暴露“未注册”，统一按验证码无效处理
      return NextResponse.json({ error: 'invalid_code' }, { status: 400 })
    }

    await db.user.update({
      where: { email },
      data: { password: hashPassword(newPassword) },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Reset password error:', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
