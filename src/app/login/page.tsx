'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useI18n } from '@/i18n/I18nProvider'
import { useAuth } from '@/lib/auth-context'
import { CelButton, CelCard, CelInput, CelBackButton, CelBadge } from '@/components/cel'
import { toast } from 'sonner'
import Link from 'next/link'

function LoginForm() {
  const { t } = useI18n()
  const { login, user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)


  const rawRedirect = searchParams.get('redirect') || '/tool'
  // 只允许站内相对路径，防开放重定向
  const redirect = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/tool'

  useEffect(() => {
    if (!loading && user) {
      router.push(redirect)
    }
  }, [user, loading, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error(t('loginErrorMissing'))
      return
    }
    setSubmitting(true)
    const result = await login(email, password)
    setSubmitting(false)
    if (result.ok) {
      toast.success(t('success'))
      router.push(redirect)
    } else {
      const errorMap: Record<string, string> = {
        invalid_credentials: t('loginErrorCreds'),
        missing_fields: t('loginErrorMissing'),
      }
      toast.error(errorMap[result.error || ''] || t('errorUnknown'))
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#fafaf5] py-20">
        <div className="w-8 h-8 border-[3px] border-[#1a1a2e] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#fafaf5] py-8 md:py-16 px-4 md:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <CelBackButton href="/" label={t('backHome')} />
        </div>

        <CelCard color="red" shadow="lg">
          <CelBadge color="yellow" className="mb-4">LOGIN</CelBadge>
          <h1 className="font-black uppercase tracking-tight text-3xl md:text-4xl text-white mb-2">
            {t('loginTitle')}
          </h1>
          <p className="font-bold text-sm text-white/80 mb-6">{t('loginSubtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label className="font-black uppercase text-xs tracking-tight text-white block mb-2">
                {t('loginPassword')}
              </label>
              <CelInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('loginPasswordPlaceholder')}
                autoComplete="current-password"
                required
              />
            </div>

            {/* 密码输入框之后、登录按钮之前 */}
            <div className="flex justify-end -mt-1 mb-3">
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-white/80 hover:text-white underline underline-offset-2 transition-colors duration-75"
              >
                {t('forgotPassword')}
              </Link>
            </div>

            <CelButton type="submit" variant="yellow" size="lg" className="w-full" disabled={submitting}>
              {submitting ? t('loading') : t('loginSubmit')}
            </CelButton>
          </form>

          <div className="mt-6 text-center pt-6 border-t-[3px] border-[#1a1a2e]">
            <p className="font-bold text-xs text-white/80">
              {t('loginNoAccount')}{' '}
              <Link href="/register" className="text-[#f1c40f] font-black uppercase hover:underline">
              {t('loginRegister')}
              </Link>
            </p>
          </div>
        </CelCard>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-[#fafaf5] py-20">
        <div className="w-8 h-8 border-[3px] border-[#1a1a2e] border-t-transparent animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
