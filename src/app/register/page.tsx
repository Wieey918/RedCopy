'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/I18nProvider'
import { useAuth } from '@/lib/auth-context'
import { CelButton, CelCard, CelInput, CelBackButton, CelBadge } from '@/components/cel'
import { toast } from 'sonner'

export default function RegisterPage() {
  const { t } = useI18n()
  const { register, user, loading } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sending, setSending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (!loading && user) {
      router.push('/tool')
    }
  }, [user, loading, router])

  // 60 秒重发倒计时
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  // 第一步：发送验证码
  async function sendCode() {
    if (!email) {
      toast.error(t('registerErrorEmail'))
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/auth/register/send-code', {
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
          email_exists: t('registerErrorExists'),
          send_too_frequent: t('send_too_frequent'),
          invalid_email: t('registerErrorEmail'),
          email_send_failed: t('emailSendFailed'),
        }
        toast.error(errorMap[data.error || ''] || t('errorUnknown'))
      }
    } catch {
      toast.error(t('error500'))
    } finally {
      setSending(false)
    }
  }

  // 第二步：提交注册（带验证码）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !nickname || !password) {
      toast.error(t('registerErrorMissing'))
      return
    }
    if (password.length < 6) {
      toast.error(t('registerErrorShort'))
      return
    }
    if (password !== confirmPassword) {
      toast.error(t('registerErrorMatch'))
      return
    }
    setSubmitting(true)
    const result = await register(email, password, nickname)
    setSubmitting(false)
    if (result.ok) {
      toast.success(t('success'))
      router.push('/tool')
    } else {
      const errorMap: Record<string, string> = {
        email_exists: t('registerErrorExists'),
        invalid_email: t('registerErrorEmail'),
        password_too_short: t('registerErrorShort'),
        missing_fields: t('registerErrorMissing'),
        invalid_code: t('invalid_code'),
      }
      toast.error(errorMap[result.error || ''] || t('errorUnknown'))
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="font-black uppercase text-2xl text-[#1a1a2e] animate-pulse">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#fafaf5] py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <CelBackButton href="/" label={t('backHome')} />
        </div>

        <CelCard color="white" shadow="lg">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2ecc71] border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] mb-4">
              <span className="text-white font-black text-2xl">+</span>
            </div>
            <CelBadge color="green" className="mb-3">REGISTER</CelBadge>
            <h1 className="font-black uppercase tracking-tight text-2xl md:text-3xl mb-2">
              {t('registerTitle')}
            </h1>
            <p className="font-bold text-xs text-[#1a1a2e]/60">{t('registerSubtitle')}</p>
          </div>

          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); sendCode() }} className="space-y-4">
              <div>
                <label className="font-black uppercase text-xs tracking-tight text-[#1a1a2e] block mb-2">
                  {t('registerEmail')}
                </label>
                <CelInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('registerEmailPlaceholder')}
                  autoComplete="email"
                  required
                />
              </div>
              <CelButton type="submit" variant="green" size="lg" className="w-full" disabled={sending || countdown > 0}>
                {sending
                  ? t('loading')
                  : countdown > 0
                    ? `${t('resendCodeBtn')}(${countdown}s)`
                    : t('sendCodeBtn')}
              </CelButton>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="font-bold text-xs text-[#1a1a2e]/60">
                {t('codeSentTo')} <span className="text-[#2ecc71] font-black">{email}</span>
                {' · '}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#e63946] font-black underline underline-offset-2 hover:no-underline"
                >
                  {t('changeEmail')}
                </button>
              </p>
              <div>
                <label className="font-black uppercase text-xs tracking-tight text-[#1a1a2e] block mb-2">
                  {t('codeLabel')}
                </label>
                <CelInput
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t('codePlaceholder')}
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="button"
                onClick={sendCode}
                disabled={countdown > 0}
                className="w-full border-[3px] border-[#1a1a2e] py-2.5 font-black uppercase text-xs tracking-tight text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-colors duration-75 disabled:opacity-40 disabled:pointer-events-none"
              >
                {countdown > 0 ? `${t('resendCodeBtn')}(${countdown}s)` : t('resendCodeBtn')}
              </button>
              <div>
                <label className="font-black uppercase text-xs tracking-tight text-[#1a1a2e] block mb-2">
                  {t('registerNickname')}
                </label>
                <CelInput
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t('registerNicknamePlaceholder')}
                  maxLength={30}
                  required
                />
              </div>
              <div>
                <label className="font-black uppercase text-xs tracking-tight text-[#1a1a2e] block mb-2">
                  {t('registerPassword')}
                </label>
                <CelInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('registerPasswordPlaceholder')}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div>
                <label className="font-black uppercase text-xs tracking-tight text-[#1a1a2e] block mb-2">
                  {t('registerConfirm')}
                </label>
                <CelInput
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('registerConfirmPlaceholder')}
                  autoComplete="new-password"
                  required
                />
              </div>
              <CelButton type="submit" variant="green" size="lg" className="w-full" disabled={submitting}>
                {submitting ? t('loading') : t('registerSubmit')}
              </CelButton>
            </form>
          )}

          <div className="mt-6 text-center pt-6 border-t-[3px] border-[#1a1a2e]">
            <p className="font-bold text-xs text-[#1a1a2e]/60">
              {t('registerHasAccount')}{' '}
              <a href="/login" className="text-[#e63946] font-black uppercase hover:underline">
                {t('loginSubmit')}
              </a>
            </p>
          </div>
        </CelCard>
      </div>
    </div>
  )
}
