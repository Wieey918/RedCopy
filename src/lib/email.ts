export async function sendVerificationCode(
  email: string,
  code: string,
  purpose: 'register' | 'reset' = 'reset'
) {
  const isRegister = purpose === 'register'
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://scrse.com'

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      to: [{ email }],
      templateId: Number(process.env.BREVO_TEMPLATE_ID),
      params: {
        CODE: code,
        PURPOSE_LABEL: isRegister ? '注册' : '密码重置',
        CTA_URL: isRegister ? `${baseUrl}/tool` : `${baseUrl}/login`,
      },
    }),
  })

  if (!res.ok) {
    console.error('[Brevo 发送失败]', res.status, await res.text())
    throw new Error('email_send_failed')
  }
  return res.json()
}
