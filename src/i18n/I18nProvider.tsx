'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations, type Language, type TranslationKey } from '@/i18n/translations'

interface I18nContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('zh')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('redcopy-lang') : null
    if (saved === 'zh' || saved === 'en') {
      setLangState(saved)
    }
  }, [])

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('redcopy-lang', newLang)
    }
  }, [])

  const t = useCallback((key: TranslationKey) => {
    return translations[lang][key] || translations.zh[key] || key
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}
