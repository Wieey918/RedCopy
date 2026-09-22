'use client'

import { useI18n } from '@/i18n/I18nProvider'
import { CelCard, CelBadge, CelBackButton } from '@/components/cel'

export default function TermsPage() {
  const { t } = useI18n()

  const sections = [
    { num: '1', title: t('termsAcceptTitle'), content: t('termsAcceptContent'), color: 'bg-[#e63946] text-white' },
    { num: '2', title: t('termsServiceTitle'), content: t('termsServiceContent'), color: 'bg-[#4ea8de] text-white' },
    { num: '3', title: t('termsUserTitle'), content: t('termsUserContent'), color: 'bg-[#2ecc71] text-white' },
    { num: '4', title: t('termsChangeTitle'), content: t('termsChangeContent'), color: 'bg-[#f1c40f] text-[#1a1a2e]' },
    { num: '5', title: t('termsDisclaimerTitle'), content: t('termsDisclaimerContent'), color: 'bg-[#1a1a2e] text-white' },
    { num: '6', title: t('termsLawTitle'), content: t('termsLawContent'), color: 'bg-[#e63946] text-white' },
  ]

  return (
    <div className="flex-1 bg-[#fafaf5] py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <CelBackButton href="/" label={t('backHome')} />
        </div>

        <CelCard color="yellow" shadow="lg" className="mb-6">
          <CelBadge color="red" className="mb-3">TERMS</CelBadge>
          <h1 className="font-black uppercase tracking-tight text-3xl md:text-5xl text-[#1a1a2e] mb-3">
            {t('termsTitle')}
          </h1>
          <p className="font-bold text-sm text-[#1a1a2e]/80">{t('privacyUpdateDate')}: 2026-09-18</p>
        </CelCard>

        <div className="space-y-4">
          {sections.map((s) => (
            <CelCard key={s.num} color="white" shadow="sm">
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-10 h-10 border-[3px] border-[#1a1a2e] ${s.color} flex items-center justify-center font-black`}>
                  {s.num}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black uppercase tracking-tight text-lg md:text-xl mb-2">{s.title}</h3>
                  <p className="font-bold text-sm text-[#1a1a2e]/70 leading-relaxed">{s.content}</p>
                </div>
              </div>
            </CelCard>
          ))}
        </div>
      </div>
    </div>
  )
}
