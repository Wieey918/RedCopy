'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/I18nProvider'
import { CelLogo } from '@/components/cel/Logo'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="mt-auto bg-white border-t-[3px] border-[#1a1a2e]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <CelLogo size="sm" />
              <span className="font-black uppercase tracking-tight text-xl text-[#1a1a2e]">
                {t('appName')}
              </span>
            </div>
            <p className="font-bold text-xs text-[#1a1a2e]/60">{t('footerTagline')}</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-black uppercase tracking-tight text-sm text-[#1a1a2e] mb-3 border-b-[3px] border-[#1a1a2e] pb-2">
              {t('footerProduct')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tool" className="font-bold text-xs text-[#1a1a2e]/60 hover:text-[#e63946] transition-colors duration-75">
                  {t('navTool')}
                </Link>
              </li>
              <li>
                <Link href="/history" className="font-bold text-xs text-[#1a1a2e]/60 hover:text-[#e63946] transition-colors duration-75">
                  {t('navHistory')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-bold text-xs text-[#1a1a2e]/60 hover:text-[#e63946] transition-colors duration-75">
                  {t('navAbout')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-black uppercase tracking-tight text-sm text-[#1a1a2e] mb-3 border-b-[3px] border-[#1a1a2e] pb-2">
              {t('footerCompany')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="font-bold text-xs text-[#1a1a2e]/60 hover:text-[#e63946] transition-colors duration-75">
                  {t('navAbout')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-bold text-xs text-[#1a1a2e]/60 hover:text-[#e63946] transition-colors duration-75">
                  {t('navContact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-black uppercase tracking-tight text-sm text-[#1a1a2e] mb-3 border-b-[3px] border-[#1a1a2e] pb-2">
              {t('footerLegal')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="font-bold text-xs text-[#1a1a2e]/60 hover:text-[#e63946] transition-colors duration-75">
                  {t('privacyTitle')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="font-bold text-xs text-[#1a1a2e]/60 hover:text-[#e63946] transition-colors duration-75">
                  {t('termsTitle')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t-[3px] border-[#1a1a2e] flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-bold text-xs text-[#1a1a2e]/60">{t('footerCopyright')}</p>
          <p className="font-bold text-xs text-[#1a1a2e]/40">{t('footerICP')}</p>
        </div>
      </div>
    </footer>
  )
}
