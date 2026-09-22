import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendVerificationCode } from '@/lib/email'
import { tooFrequent, saveCode } from '@/lib/verification-codes'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email_required' }, { status: 400 })
    }

    // 60 秒内不允许重复发送（用共享库，错误码和前端 errorMap 对齐）
    if (tooFrequent(`forgot:${email}`)) {
      return NextResponse.json({ error: 'send_too_frequent' }, { status: 429 })
    }

    const user = await db.user.findUnique({ where: { email } })
    // 安全考虑：不存在的邮箱也返回成功，防止被枚举用户
    if (!user) {
      return NextResponse.json({ ok: true })
    }

    // 生成 6 位验证码，存入共享 Map（key 与 reset 端 checkCode 完全一致）
    const code = String(Math.floor(100000 + Math.random() * 900000))
    saveCode(`forgot:${email}`, code)
  try {
     await sendVerificationCode(email, code, 'reset')
   } catch (e) {
     console.error('邮件发送失败:', e)
     return NextResponse.json({ error: 'email_send_failed' }, { status: 502 })
   }
    console.log(`[密码重置验证码] ${email}:${code}`)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Forgot password error:', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
