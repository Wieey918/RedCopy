'use client'

import { useI18n } from '@/i18n/I18nProvider'
import { CelButton, CelBadge } from '@/components/cel'

export default function NotFound() {
  const { t } = useI18n()

  return (
    <div className="flex-1 flex items-center justify-center bg-[#fafaf5] py-20 px-4">
      <div className="text-center max-w-md">
        <CelBadge color="red" className="mb-6">404 ERROR</CelBadge>
        <h1 className="font-black uppercase tracking-tight text-7xl md:text-9xl text-[#e63946] mb-4" style={{ textShadow: '4px 4px 0 #1a1a2e' }}>
          404
        </h1>
        <h2 className="font-black uppercase tracking-tight text-xl md:text-2xl mb-3">{t('notFoundTitle')}</h2>
        <p className="font-bold text-sm text-[#1a1a2e]/60 mb-8">{t('notFoundDesc')}</p>
        <CelButton as="a" href="/" variant="red" size="lg">
          🏠 {t('notFoundBack')}
        </CelButton>
      </div>
    </div>
  )
}
