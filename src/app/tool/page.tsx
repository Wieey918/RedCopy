'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/I18nProvider'
import { useAuth } from '@/lib/auth-context'
import { CelButton, CelCard, CelTextarea, CelBadge, CelBackButton } from '@/components/cel'
import { toast } from 'sonner'

type Style = 'viral' | 'emotional' | 'tutorial' | 'review'

export default function ToolPage() {
  const { t } = useI18n()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sourceText, setSourceText] = useState('')
  const [style, setStyle] = useState<Style>('viral')
  const [result, setResult] = useState('')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      toast.error(t('toolLoginRequired'))
      router.push('/login?redirect=/tool')
    }
  }, [loading, user, router, t])

  const styles: { key: Style; label: string; emoji: string; color: string }[] = [
    { key: 'viral', label: t('toolStyleViral'), emoji: '🔥', color: 'bg-[#e63946] text-white' },
    { key: 'emotional', label: t('toolStyleEmotional'), emoji: '💖', color: 'bg-[#4ea8de] text-white' },
    { key: 'tutorial', label: t('toolStyleTutorial'), emoji: '📚', color: 'bg-[#2ecc71] text-white' },
    { key: 'review', label: t('toolStyleReview'), emoji: '⭐', color: 'bg-[#f1c40f] text-[#1a1a2e]' },
  ]

  const handleGenerate = async () => {
    if (!sourceText.trim()) {
      toast.error(t('toolErrorEmpty'))
      return
    }
    if (sourceText.trim().length < 50) {
      toast.error(t('toolErrorShort'))
      return
    }

    setGenerating(true)
    setResult('')
    try {
      const res = await fetch('/api/copywriting/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sourceText, style }),
      })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        toast.success(t('toolSaved'))
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      } else {
        toast.error(data.error === 'unauthorized' ? t('toolLoginRequired') : t('toolErrorFailed'))
        if (data.error === 'unauthorized') {
          router.push('/login?redirect=/tool')
        }
      }
    } catch {
      toast.error(t('errorNetwork'))
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      toast.success(t('copySuccess'))
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error(t('copyFailed'))
    }
  }

  const handleClear = () => {
    setSourceText('')
    setResult('')
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
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <CelBackButton href="/" label={t('backHome')} />
        </div>

        {/* Header */}
        <div className="mb-8 border-[3px] border-[#1a1a2e] bg-[#e63946] text-white shadow-[4px_4px_0_#1a1a2e] p-6 md:p-8">
          <CelBadge color="yellow" className="mb-3">TOOL</CelBadge>
          <h1 className="font-black uppercase tracking-tight text-3xl md:text-5xl mb-2">
            {t('toolTitle')}
          </h1>
          <p className="font-bold text-sm md:text-base text-white/90">{t('toolSubtitle')}</p>
        </div>

        {/* Input Section */}
        <CelCard color="white" shadow="md" className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="font-black uppercase text-sm tracking-tight text-[#1a1a2e]">
              {t('toolInputLabel')}
            </label>
            <span className="font-bold text-xs text-[#1a1a2e]/60">
              {sourceText.length} {t('toolCharCount')}
            </span>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={t('toolInputPlaceholder')}
            className="w-full border-[3px] border-[#1a1a2e] bg-[#fafaf5] text-[#1a1a2e] font-bold px-4 py-3 text-sm focus:outline-none focus:shadow-[3px_3px_0_#1a1a2e] transition-all duration-75 placeholder:text-[#1a1a2e]/40 resize-y min-h-[200px]"
          />

          {/* Style selector */}
          <div className="mt-6">
            <label className="font-black uppercase text-sm tracking-tight text-[#1a1a2e] block mb-3">
              {t('toolStyleLabel')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {styles.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStyle(s.key)}
                  className={`border-[3px] border-[#1a1a2e] p-3 font-black uppercase text-xs tracking-tight transition-all duration-75 ${
                    style === s.key
                      ? `${s.color} shadow-[3px_3px_0_#1a1a2e] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#1a1a2e]`
                      : 'bg-white text-[#1a1a2e] hover:bg-[#fafaf5]'
                  }`}
                >
                  <div className="text-xl mb-1">{s.emoji}</div>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <CelButton
              variant="red"
              size="lg"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? t('toolGenerating') : t('toolGenerate')} {!generating && '✨'}
            </CelButton>
            <CelButton variant="white" size="lg" onClick={handleClear}>
              {t('toolClear')}
            </CelButton>
          </div>
        </CelCard>

        {/* Result Section */}
        <CelCard color="white" shadow="md">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <label className="font-black uppercase text-sm tracking-tight text-[#1a1a2e]">
              {t('toolResultLabel')}
            </label>
            {result && (
              <CelButton variant="green" size="sm" onClick={handleCopy}>
                {copied ? `✓ ${t('copied')}` : `📋 ${t('toolCopy')}`}
              </CelButton>
            )}
          </div>
          <div
            ref={resultRef}
            className="border-[3px] border-[#1a1a2e] bg-[#fafaf5] p-4 min-h-[200px] font-bold text-sm text-[#1a1a2e] whitespace-pre-wrap break-words"
          >
            {generating ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-[3px] border-[#1a1a2e] border-t-transparent animate-spin" />
                <span className="font-black uppercase text-xs">{t('toolGenerating')}</span>
              </div>
            ) : result ? (
              result
            ) : (
              <span className="text-[#1a1a2e]/40">{t('toolResultPlaceholder')}</span>
            )}
          </div>
        </CelCard>
      </div>
    </div>
  )
}
