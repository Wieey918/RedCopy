'use client'

import { useI18n } from '@/i18n/I18nProvider'
import { CelCard, CelBadge, CelBackButton } from '@/components/cel'

export default function AboutPage() {
  const { t } = useI18n()

  const sections = [
    { title: t('aboutMission'), content: t('aboutMissionContent'), color: 'bg-[#e63946] text-white' },
    { title: t('aboutVision'), content: t('aboutVisionContent'), color: 'bg-[#4ea8de] text-white' },
    { title: t('aboutValues'), content: t('aboutValuesContent'), color: 'bg-[#2ecc71] text-white' },
    { title: t('aboutTeam'), content: t('aboutTeamContent'), color: 'bg-[#f1c40f] text-[#1a1a2e]' },
  ]

  return (
    <div className="flex-1 bg-[#fafaf5] py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <CelBackButton href="/" label={t('backHome')} />
        </div>

        <CelCard color="red" shadow="lg" className="mb-6">
          <CelBadge color="yellow" className="mb-3">ABOUT US</CelBadge>
          <h1 className="font-black uppercase tracking-tight text-3xl md:text-5xl text-white mb-3">
            {t('aboutTitle')}
          </h1>
          <p className="font-bold text-sm md:text-base text-white/90">{t('aboutSubtitle')}</p>
        </CelCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((s, i) => (
            <CelCard key={i} color="white" shadow="md">
              <div className={`inline-flex items-center justify-center w-10 h-10 border-[3px] border-[#1a1a2e] ${s.color} font-black text-lg mb-4`}>
                {i + 1}
              </div>
              <h3 className="font-black uppercase tracking-tight text-xl md:text-2xl mb-3">{s.title}</h3>
              <p className="font-bold text-sm text-[#1a1a2e]/70 leading-relaxed">{s.content}</p>
            </CelCard>
          ))}
        </div>
      </div>
    </div>
  )
}
