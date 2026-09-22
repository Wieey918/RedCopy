'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/I18nProvider'
import { useAuth } from '@/lib/auth-context'
import { CelButton, CelCard, CelBackButton, CelBadge } from '@/components/cel'
import { toast } from 'sonner'

interface HistoryItem {
  id: string
  title: string
  sourceText: string
  result: string
  style: string
  createdAt: string
}

export default function HistoryPage() {
  const { t } = useI18n()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [histories, setHistories] = useState<HistoryItem[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [selected, setSelected] = useState<HistoryItem | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/history')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      fetchHistories()
    }
  }, [user])

  const fetchHistories = async () => {
    setLoadingList(true)
    try {
      const res = await fetch('/api/history/list', { credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        setHistories(data.histories || [])
      }
    } catch {
      toast.error(t('errorNetwork'))
    } finally {
      setLoadingList(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('historyDeleteConfirm'))) return
    try {
      const res = await fetch(`/api/history/delete?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setHistories(histories.filter(h => h.id !== id))
        if (selected?.id === id) setSelected(null)
        toast.success(t('success'))
      } else {
        toast.error(t('errorUnknown'))
      }
    } catch {
      toast.error(t('errorNetwork'))
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(t('copySuccess'))
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error(t('copyFailed'))
    }
  }

  const styleLabels: Record<string, { label: string; color: 'red' | 'blue' | 'green' | 'yellow' }> = {
    viral: { label: t('toolStyleViral'), color: 'red' },
    emotional: { label: t('toolStyleEmotional'), color: 'blue' },
    tutorial: { label: t('toolStyleTutorial'), color: 'green' },
    review: { label: t('toolStyleReview'), color: 'yellow' },
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
        <div className="mb-6">
          <CelBackButton href="/" label={t('backHome')} />
        </div>

        {/* Header */}
        <CelCard color="green" shadow="lg" className="mb-6">
          <CelBadge color="yellow" className="mb-3">HISTORY</CelBadge>
          <h1 className="font-black uppercase tracking-tight text-3xl md:text-5xl text-white mb-2">
            {t('historyTitle')}
          </h1>
          <p className="font-bold text-sm text-white/90">{t('historySubtitle')}</p>
        </CelCard>

        {loadingList ? (
          <div className="flex items-center justify-center py-20">
            <div className="font-black uppercase text-xl text-[#1a1a2e] animate-pulse">{t('loading')}</div>
          </div>
        ) : histories.length === 0 ? (
          <CelCard color="white" shadow="md" className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="font-black uppercase tracking-tight text-xl mb-2">{t('historyEmpty')}</h3>
            <p className="font-bold text-sm text-[#1a1a2e]/60 mb-6">{t('historyEmptyDesc')}</p>
            <CelButton as="a" href="/tool" variant="red" size="lg">
              ✨ {t('historyCreateFirst')}
            </CelButton>
          </CelCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* History List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-black uppercase tracking-tight text-lg">
                  {t('historyList')} ({histories.length})
                </h2>
                <CelButton as="a" href="/tool" variant="green" size="sm">
                  + {t('historyNew')}
                </CelButton>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {histories.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setSelected(h)}
                    className={`w-full text-left border-[3px] border-[#1a1a2e] bg-white p-4 shadow-[3px_3px_0_#1a1a2e] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#1a1a2e] transition-all duration-75 ${
                      selected?.id === h.id ? 'bg-[#f1c40f]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-black uppercase tracking-tight text-sm line-clamp-2 flex-1">
                        {h.title}
                      </h3>
                      <CelBadge color={styleLabels[h.style]?.color || 'yellow'}>
                        {styleLabels[h.style]?.label || h.style}
                      </CelBadge>
                    </div>
                    <p className="font-bold text-[10px] text-[#1a1a2e]/60">
                      {new Date(h.createdAt).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail Panel */}
            <div>
              {selected ? (
                <CelCard color="white" shadow="md">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <h3 className="font-black uppercase tracking-tight text-lg flex-1">{selected.title}</h3>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="shrink-0 border-[3px] border-[#1a1a2e] bg-[#e63946] text-white px-3 py-1 font-black text-xs uppercase hover:bg-[#1a1a2e] transition-colors duration-75"
                    >
                      🗑 {t('delete')}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <CelBadge color={styleLabels[selected.style]?.color || 'yellow'}>
                      {styleLabels[selected.style]?.label || selected.style}
                    </CelBadge>
                    <span className="font-bold text-[10px] text-[#1a1a2e]/60">
                      {new Date(selected.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-black uppercase text-xs tracking-tight mb-2 text-[#1a1a2e]/60">
                      {t('historySource')}
                    </h4>
                    <div className="border-[3px] border-[#1a1a2e] bg-[#fafaf5] p-3 max-h-32 overflow-y-auto font-bold text-xs text-[#1a1a2e]/80 whitespace-pre-wrap">
                      {selected.sourceText}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black uppercase text-xs tracking-tight text-[#1a1a2e]/60">
                        {t('historyResult')}
                      </h4>
                      <CelButton variant="green" size="sm" onClick={() => handleCopy(selected.result)}>
                        {copied ? `✓ ${t('copied')}` : `📋 ${t('copy')}`}
                      </CelButton>
                    </div>
                    <div className="border-[3px] border-[#1a1a2e] bg-[#fafaf5] p-3 max-h-80 overflow-y-auto font-bold text-sm text-[#1a1a2e] whitespace-pre-wrap">
                      {selected.result}
                    </div>
                  </div>
                </CelCard>
              ) : (
                <CelCard color="white" shadow="md" className="text-center py-12">
                  <div className="text-5xl mb-3">👈</div>
                  <p className="font-black uppercase tracking-tight text-sm text-[#1a1a2e]/60">
                    {t('historySelectHint')}
                  </p>
                </CelCard>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
