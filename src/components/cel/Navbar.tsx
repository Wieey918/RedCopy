'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/I18nProvider'
import { useAuth } from '@/lib/auth-context'
import { CelButton } from '@/components/cel'
import { cn } from '@/lib/utils'
import { CelLogo } from '@/components/cel/Logo'

export function Navbar() {
  const { t, lang, setLang } = useI18n()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    router.push('/')
  }

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/tool', label: t('navTool') },
    { href: '/history', label: t('navHistory') },
    { href: '/about', label: t('navAbout') },
    { href: '/contact', label: t('navContact') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf5] border-b-[3px] border-[#1a1a2e]">
      <nav className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
  <CelLogo
     size="md"
     className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0_#1a1a2e] transition-all duration-75"
   />
      <span className="font-black uppercase tracking-tight text-lg md:text-2xl text-[#1a1a2e] hidden sm:inline">
    {t('appName')}
       </span>
              </Link>


          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 font-black uppercase text-xs md:text-sm tracking-tight text-[#1a1a2e] hover:bg-[#f1c40f] border-[3px] border-transparent hover:border-[#1a1a2e] transition-all duration-75"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Language + Auth + Menu */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="border-[3px] border-[#1a1a2e] bg-white px-2.5 py-1.5 md:px-3 md:py-2 font-black uppercase text-xs shadow-[2px_2px_0_#1a1a2e] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#1a1a2e] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75"
              aria-label="Switch language"
            >
              {lang === 'zh' ? '中' : 'EN'}
            </button>

            {/* Auth area */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 border-[3px] border-[#1a1a2e] bg-[#4ea8de] text-white px-2.5 py-1.5 md:px-3 md:py-2 font-black uppercase text-xs shadow-[2px_2px_0_#1a1a2e] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#1a1a2e] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75"
                >
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt={user.nickname} className="w-5 h-5 md:w-6 md:h-6 border-2 border-[#1a1a2e] object-cover" />
                  ) : (
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-[#f1c40f] border-2 border-[#1a1a2e] flex items-center justify-center text-[#1a1a2e] font-black text-xs">
                      {user.nickname.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline max-w-[80px] truncate">{user.nickname}</span>
                  <span aria-hidden>▾</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_#1a1a2e] z-50">
                    <div className="px-4 py-3 border-b-[3px] border-[#1a1a2e] bg-[#f1c40f]">
                      <p className="font-black uppercase text-xs text-[#1a1a2e] truncate">{user.nickname}</p>
                      <p className="font-bold text-[10px] text-[#1a1a2e]/60 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 font-black uppercase text-xs text-[#1a1a2e] hover:bg-[#f1c40f] border-b-[3px] border-[#1a1a2e] transition-colors duration-75"
                    >
                      {t('menuProfile')}
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 font-black uppercase text-xs text-[#1a1a2e] hover:bg-[#f1c40f] border-b-[3px] border-[#1a1a2e] transition-colors duration-75"
                    >
                      {t('menuHistory')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 font-black uppercase text-xs text-white bg-[#e63946] hover:bg-[#c4232f] transition-colors duration-75"
                    >
                      {t('menuLogout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <CelButton as="a" href="/login" variant="white" size="sm">
                  {t('menuLogin')}
                </CelButton>
                <CelButton as="a" href="/register" variant="red" size="sm">
                  {t('menuRegister')}
                </CelButton>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden border-[3px] border-[#1a1a2e] bg-[#2ecc71] text-white p-2 shadow-[2px_2px_0_#1a1a2e] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center gap-1">
                <span className={cn('block h-0.5 bg-white transition-all duration-75', mobileOpen && 'rotate-45 translate-y-1.5')} />
                <span className={cn('block h-0.5 bg-white transition-all duration-75', mobileOpen && 'opacity-0')} />
                <span className={cn('block h-0.5 bg-white transition-all duration-75', mobileOpen && '-rotate-45 -translate-y-1.5')} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t-[3px] border-[#1a1a2e] bg-[#fafaf5]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 font-black uppercase text-sm text-[#1a1a2e] border-b-[3px] border-[#1a1a2e] hover:bg-[#f1c40f] transition-colors duration-75"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-2 p-4 bg-white">
                <CelButton as="a" href="/login" variant="white" size="sm" className="flex-1" onClick={() => setMobileOpen(false)}>
                  {t('menuLogin')}
                </CelButton>
                <CelButton as="a" href="/register" variant="red" size="sm" className="flex-1" onClick={() => setMobileOpen(false)}>
                  {t('menuRegister')}
                </CelButton>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
