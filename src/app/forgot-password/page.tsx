'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CelButton, CelInput, CelCard, CelBackButton, CelBadge } from '@/components/cel'
import { useI18n } from '@/i18n/I18nProvider'

export default function ForgotPasswordPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // 60 秒重发倒计时
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  async function sendCode() {
    if (!email) {
      toast.error(t('forgotErrorEmail'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStep(2)
        setCountdown(60)
        toast.success(t('codeSent'))
      } else {
        const data = await res.json()
        const errorMap: Record<string, string> = {
          send_too_frequent: t('send_too_frequent'),
          email_send_failed: t('emailSendFailed'),
        }
        toast.error(errorMap[data.error || ''] || t('errorUnknown'))
      }
    } catch {
      toast.error(t('error500'))
    } finally {
      setLoading(false)
    }
  }

  async function resetPassword() {
    if (!code || !newPassword) {
      toast.error(t('forgotErrorMissing'))
      return
    }
    if (newPassword.length < 6) {
      toast.error(t('registerErrorShort'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      })
      if (res.ok) {
        toast.success(t('resetSuccess'))
        router.push('/login')
      } else {
        const data = await res.json()
        const errorMap: Record<string, string> = {
          invalid_code: t('invalid_code'),
          password_too_short: t('registerErrorShort'),
          missing_fields: t('forgotErrorMissing'),
        }
        toast.error(errorMap[data.error || ''] || t('errorUnknown'))
      }
    } catch {
      toast.error(t('error500'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 bg-[#fafaf5] py-8 md:py-16 px-4 md:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <CelBackButton href="/" label={t('backHome')} />
        </div>

        <CelCard color="red" shadow="lg">
          <CelBadge color="yellow" className="mb-4">RESET</CelBadge>
          <h1 className="font-black uppercase tracking-tight text-3xl md:text-4xl text-white mb-2">
            {t('forgotTitle')}
          </h1>
          <p className="font-bold text-sm text-white/80 mb-6">{t('forgotSubtitle')}</p>

          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); sendCode() }} className="space-y-4">
              <div>
                <label className="font-black uppercase text-xs tracking-tight text-white block mb-2">
                  {t('loginEmail')}
                </label>
                <CelInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('loginEmailPlaceholder')}
                  autoComplete="email"
                  required
                />
              </div>
              <CelButton
                type="submit"
                variant="yellow"
                size="lg"
                className="w-full"
                disabled={loading || countdown > 0}
              >
                {loading
                  ? t('loading')
                  : countdown > 0
                    ? `${t('resendCodeBtn')}(${countdown}s)`
                    : t('sendCodeBtn')}
              </CelButton>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); resetPassword() }} className="space-y-4">
              <p className="font-bold text-xs text-white/80">
                {t('codeSentTo')} <span className="text-[#f1c40f]">{email}</span>
              </p>
              <div>
                <label className="font-black uppercase text-xs tracking-tight text-white block mb-2">
                  {t('codeLabel')}
                </label>
                <CelInput
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>
              <div>
                <label className="font-black uppercase text-xs tracking-tight text-white block mb-2">
                  {t('newPasswordLabel')}
                </label>
                <CelInput
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('registerPasswordPlaceholder')}
                  autoComplete="new-password"
                  required
                />
              </div>
              <CelButton type="submit" variant="yellow" size="lg" className="w-full" disabled={loading}>
                {loading ? t('loading') : t('resetBtn')}
              </CelButton>
               <button
                type="button"
                onClick={sendCode}
                disabled={countdown > 0}
                className="w-full border-[3px] border-white/70 py-2.5 font-black uppercase text-xs tracking-tight text-white hover:bg-white hover:text-[#e63946] transition-colors duration-75 disabled:opacity-40 disabled:pointer-events-none"
              >
   {countdown > 0 ? `${t('resendCodeBtn')}(${countdown}s)` : t('resendCodeBtn')}
               </button>
            </form>
          )}

          <div className="mt-6 text-center pt-6 border-t-[3px] border-[#1a1a2e]">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-xs font-bold text-white/80 hover:text-white underline underline-offset-2 transition-colors duration-75"
            >
              {t('backToLogin')}
            </button>
          </div>
        </CelCard>
      </div>
    </div>
  )
}
