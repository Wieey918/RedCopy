'use client'

import { useState } from 'react'
import { useI18n } from '@/i18n/I18nProvider'
import { CelCard, CelBadge, CelButton, CelInput, CelTextarea, CelBackButton } from '@/components/cel'
import { toast } from 'sonner'

export default function ContactPage() {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast.error(t('contactErrorFields'))
      return
    }
    setSubmitting(true)
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false)
      toast.success(t('contactSuccess'))
      setName('')
      setEmail('')
      setMessage('')
    }, 800)
  }

  const contactMethods = [
    { icon: '📧', label: t('contactEmail'), value: 'wezhro@outlook.com', color: 'bg-[#e63946] text-white' },
    { icon: '💬', label: t('contactWechat'), value: 'wzr20030918', color: 'bg-[#2ecc71] text-white' },
    { icon: '🐦', label: t('contactTwitter'), value: '@RedCopyAI', color: 'bg-[#4ea8de] text-white' },
    { icon: '📍', label: t('contactAddress'), value: t('contactAddressValue'), color: 'bg-[#f1c40f] text-[#1a1a2e]' },
  ]

  return (
    <div className="flex-1 bg-[#fafaf5] py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <CelBackButton href="/" label={t('backHome')} />
        </div>

        <CelCard color="blue" shadow="lg" className="mb-6">
          <CelBadge color="yellow" className="mb-3">CONTACT</CelBadge>
          <h1 className="font-black uppercase tracking-tight text-3xl md:text-5xl text-white mb-3">
            {t('contactTitle')}
          </h1>
          <p className="font-bold text-sm md:text-base text-white/90">{t('contactSubtitle')}</p>
        </CelCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Methods */}
          <div className="space-y-4">
            <h2 className="font-black uppercase tracking-tight text-xl mb-2">{t('contactMethods')}</h2>
            {contactMethods.map((m, i) => (
              <CelCard key={i} color="white" shadow="sm">
                <div className="flex items-center gap-4">
                  <div className={`shrink-0 w-12 h-12 border-[3px] border-[#1a1a2e] ${m.color} flex items-center justify-center text-xl`}>
                    {m.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black uppercase text-xs tracking-tight text-[#1a1a2e]/60 mb-1">{m.label}</p>
                    <p className="font-bold text-sm text-[#1a1a2e] truncate">{m.value}</p>
                  </div>
                </div>
              </CelCard>
            ))}
          </div>

          {/* Contact Form */}
          <CelCard color="white" shadow="md">
            <h2 className="font-black uppercase tracking-tight text-xl mb-4 border-b-[3px] border-[#1a1a2e] pb-3">
              {t('contactFormTitle')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-black uppercase text-xs tracking-tight text-[#1a1a2e] block mb-2">
                  {t('contactName')}
                </label>
                <CelInput
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('contactNamePlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="font-black uppercase text-xs tracking-tight text-[#1a1a2e] block mb-2">
                  {t('contactEmailLabel')}
                </label>
                <CelInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('contactEmailPlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="font-black uppercase text-xs tracking-tight text-[#1a1a2e] block mb-2">
                  {t('contactMessage')}
                </label>
                <CelTextarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('contactMessagePlaceholder')}
                  className="min-h-[120px]"
                  required
                />
              </div>
              <CelButton type="submit" variant="red" size="lg" className="w-full" disabled={submitting}>
                {submitting ? t('loading') : `📨 ${t('contactSend')}`}
              </CelButton>
            </form>
          </CelCard>
        </div>
      </div>
    </div>
  )
}
