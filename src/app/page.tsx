'use client'

import { useI18n } from '@/i18n/I18nProvider'
import { CelButton, CelCard, CelBadge } from '@/components/cel'

export default function Home() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#e63946] text-white border-b-[3px] border-[#1a1a2e] py-16 md:py-24 px-4 md:px-8 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-8 right-8 w-16 h-16 md:w-24 md:h-24 bg-[#f1c40f] border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] rotate-12 hidden md:block" />
        <div className="absolute bottom-12 left-8 w-12 h-12 md:w-16 md:h-16 bg-[#2ecc71] border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] rounded-full hidden md:block" />
        <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-[#4ea8de] border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_#1a1a2e] hidden lg:block" />

        <div className="max-w-5xl mx-auto relative z-10">
          <CelBadge color="yellow" className="mb-6">
            ✨ AI POWERED
          </CelBadge>
          <h1 className="font-black uppercase tracking-tight text-4xl md:text-6xl lg:text-7xl mb-6 leading-[1.05]">
            {t('heroTitle')}
          </h1>
          <p className="font-bold text-base md:text-xl max-w-2xl mb-8 text-white/90">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-wrap gap-3">
            <CelButton as="link" href="/tool" variant="yellow" size="lg">
              {t('heroCta')} →
            </CelButton>
            <CelButton as="link" href="/tool" variant="white" size="lg">
              {t('heroSecondary')}
            </CelButton>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#1a1a2e] text-white border-b-[3px] border-[#1a1a2e] py-10 md:py-14 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-black uppercase tracking-tight text-center text-2xl md:text-3xl mb-8 text-[#f1c40f]">
            {t('statsTitle')}
          </h2>
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <div className="text-center border-[3px] border-[#1a1a2e] bg-[#e63946] p-4 md:p-6 shadow-[3px_3px_0_#fafaf5]">
              <div className="font-black text-2xl md:text-4xl mb-1">12K+</div>
              <div className="font-bold text-[10px] md:text-xs uppercase tracking-tight opacity-90">{t('statsUsers')}</div>
            </div>
            <div className="text-center border-[3px] border-[#1a1a2e] bg-[#4ea8de] p-4 md:p-6 shadow-[3px_3px_0_#fafaf5]">
              <div className="font-black text-2xl md:text-4xl mb-1">85K+</div>
              <div className="font-bold text-[10px] md:text-xs uppercase tracking-tight opacity-90">{t('statsCopy')}</div>
            </div>
            <div className="text-center border-[3px] border-[#1a1a2e] bg-[#2ecc71] p-4 md:p-6 shadow-[3px_3px_0_#fafaf5]">
              <div className="font-black text-2xl md:text-4xl mb-1">96%</div>
              <div className="font-bold text-[10px] md:text-xs uppercase tracking-tight opacity-90">{t('statsSatisfaction')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#fafaf5] py-16 md:py-24 px-4 md:px-8 border-b-[3px] border-[#1a1a2e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <CelBadge color="red" className="mb-4">FEATURES</CelBadge>
            <h2 className="font-black uppercase tracking-tight text-3xl md:text-5xl mb-3">
              {t('featureTitle')}
            </h2>
            <p className="font-bold text-sm md:text-base text-[#1a1a2e]/60 max-w-xl mx-auto">
              {t('featureSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CelCard color="red" shadow="lg" className="hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#1a1a2e] transition-all duration-75">
              <div className="w-14 h-14 bg-white border-[3px] border-[#1a1a2e] flex items-center justify-center mb-4 text-2xl">
                🎯
              </div>
              <h3 className="font-black uppercase tracking-tight text-xl md:text-2xl mb-3">
                {t('feature1Title')}
              </h3>
              <p className="font-bold text-sm text-white/90">{t('feature1Desc')}</p>
            </CelCard>

            <CelCard color="blue" shadow="lg" className="hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#1a1a2e] transition-all duration-75">
              <div className="w-14 h-14 bg-white border-[3px] border-[#1a1a2e] flex items-center justify-center mb-4 text-2xl">
                🚀
              </div>
              <h3 className="font-black uppercase tracking-tight text-xl md:text-2xl mb-3">
                {t('feature2Title')}
              </h3>
              <p className="font-bold text-sm text-white/90">{t('feature2Desc')}</p>
            </CelCard>

            <CelCard color="green" shadow="lg" className="hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#1a1a2e] transition-all duration-75">
              <div className="w-14 h-14 bg-white border-[3px] border-[#1a1a2e] flex items-center justify-center mb-4 text-2xl">
                💬
              </div>
              <h3 className="font-black uppercase tracking-tight text-xl md:text-2xl mb-3">
                {t('feature3Title')}
              </h3>
              <p className="font-bold text-sm text-white/90">{t('feature3Desc')}</p>
            </CelCard>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#f1c40f] py-16 md:py-24 px-4 md:px-8 border-b-[3px] border-[#1a1a2e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <CelBadge color="dark" className="mb-4">HOW IT WORKS</CelBadge>
            <h2 className="font-black uppercase tracking-tight text-3xl md:text-5xl mb-3">
              {t('howTitle')}
            </h2>
            <p className="font-bold text-sm md:text-base text-[#1a1a2e]/70 max-w-xl mx-auto">
              {t('howSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', title: t('step1Title'), desc: t('step1Desc'), color: 'bg-[#e63946] text-white' },
              { num: '02', title: t('step2Title'), desc: t('step2Desc'), color: 'bg-[#4ea8de] text-white' },
              { num: '03', title: t('step3Title'), desc: t('step3Desc'), color: 'bg-[#2ecc71] text-white' },
            ].map((step) => (
              <div key={step.num} className="border-[3px] border-[#1a1a2e] bg-white shadow-[4px_4px_0_#1a1a2e] p-6">
                <div className={`inline-flex items-center justify-center w-14 h-14 border-[3px] border-[#1a1a2e] ${step.color} font-black text-2xl mb-4`}>
                  {step.num}
                </div>
                <h3 className="font-black uppercase tracking-tight text-xl md:text-2xl mb-3">
                  {step.title}
                </h3>
                <p className="font-bold text-sm text-[#1a1a2e]/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#4ea8de] text-white py-16 md:py-24 px-4 md:px-8 border-b-[3px] border-[#1a1a2e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-black uppercase tracking-tight text-3xl md:text-5xl mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="font-bold text-sm md:text-base mb-8 text-white/90">
            {t('ctaSubtitle')}
          </p>
          <CelButton as="a" href="/tool" variant="red" size="lg">
            {t('ctaButton')} →
          </CelButton>
        </div>
      </section>
    </div>
  )
}
