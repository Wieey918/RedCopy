'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/I18nProvider'
import { useAuth } from '@/lib/auth-context'
import { CelButton, CelCard, CelInput, CelTextarea, CelBackButton, CelBadge } from '@/components/cel'
import { toast } from 'sonner'

const AVATAR_COLORS = ['#e63946', '#4ea8de', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#34495e']
const AVATAR_EMOJIS = ['🦊', '🐼', '🐰', '🐯', '🐨', '🦁', '🐸', '🐵', '🦄', '🐙', '🦋', '🌸']

export default function ProfilePage() {
  const { t } = useI18n()
  const { user, loading, updateUser, logout } = useAuth()
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '')
      setBio(user.bio || '')
      setAvatar(user.avatar || '')
    }
  }, [user])

  const handleSave = async () => {
    if (!nickname.trim()) {
      toast.error(t('profileErrorNickname'))
      return
    }
    setSaving(true)
    const result = await updateUser({ nickname: nickname.trim(), bio: bio.trim(), avatar })
    setSaving(false)
    if (result.ok) {
      toast.success(t('profileSaved'))
    } else {
      toast.error(t('profileErrorSave'))
    }
  }

  const handleLogout = async () => {
  if (!confirm(t('profileLogoutConfirm'))) return  
  await logout()
  toast.success(t('profileLoggedOut'))
  router.push('/')
  }



  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('profileErrorSize'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setAvatar(reader.result as string)
      setShowAvatarPicker(false)
    }
    reader.readAsDataURL(file)
  }

  const pickEmojiAvatar = (emoji: string, color: string) => {
    // Store as data URL with color background and emoji
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="${color}"/><text x="60" y="78" font-size="60" text-anchor="middle">${emoji}</text></svg>`
    setAvatar(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`)
    setShowAvatarPicker(false)
  }

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="font-black uppercase text-2xl text-[#1a1a2e] animate-pulse">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#fafaf5] py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <CelBackButton href="/" label={t('backHome')} />
        </div>

        {/* Profile Header */}
        <CelCard color="blue" shadow="lg" className="mb-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={nickname}
                  className="w-20 h-20 md:w-24 md:h-24 border-[3px] border-[#1a1a2e] object-cover"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 border-[3px] border-[#1a1a2e] bg-white flex items-center justify-center">
                  <span className="font-black text-2xl md:text-3xl text-[#1a1a2e]">
                    {(nickname || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#f1c40f] border-[3px] border-[#1a1a2e] flex items-center justify-center font-black text-sm hover:bg-[#e63946] hover:text-white transition-colors duration-75"
                aria-label="Change avatar"
              >
                ✎
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <CelBadge color="yellow" className="mb-2">PROFILE</CelBadge>
              <h1 className="font-black uppercase tracking-tight text-2xl md:text-3xl text-white mb-1 truncate">
                {user.nickname}
              </h1>
              <p className="font-bold text-xs text-white/80 truncate">{user.email}</p>
              <p className="font-bold text-[10px] text-white/60 mt-1">
                {t('profileJoined')}: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CelCard>

        {/* Avatar Picker */}
        {showAvatarPicker && (
          <CelCard color="white" shadow="md" className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black uppercase text-sm tracking-tight">{t('profileAvatarPick')}</h3>
              <button onClick={() => setShowAvatarPicker(false)} className="font-black text-sm hover:text-[#e63946]">×</button>
            </div>
            <div className="mb-4">
              <p className="font-bold text-xs mb-2 text-[#1a1a2e]/60">{t('profileAvatarUpload')}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <CelButton variant="blue" size="sm" onClick={() => fileInputRef.current?.click()}>
                📁 {t('profileAvatarChoose')}
              </CelButton>
            </div>
            <div>
              <p className="font-bold text-xs mb-2 text-[#1a1a2e]/60">{t('profileAvatarEmoji')}</p>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => pickEmojiAvatar(emoji, AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)])}
                    className="aspect-square border-[3px] border-[#1a1a2e] bg-[#fafaf5] hover:bg-[#f1c40f] text-2xl flex items-center justify-center transition-colors duration-75"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </CelCard>
        )}

        {/* Edit Form */}
        <CelCard color="white" shadow="md" className="mb-6">
          <h2 className="font-black uppercase tracking-tight text-xl md:text-2xl mb-6 border-b-[3px] border-[#1a1a2e] pb-3">
            {t('profileEditTitle')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="font-black uppercase text-xs tracking-tight text-[#1a1a2e] block mb-2">
                {t('profileNickname')}
              </label>
              <CelInput
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t('profileNicknamePlaceholder')}
                maxLength={30}
              />
              <p className="font-bold text-[10px] text-[#1a1a2e]/40 mt-1">
                {nickname.length}/30
              </p>
            </div>
            <div>
              <label className="font-black uppercase text-xs tracking-tight text-[#1a1a2e] block mb-2">
                {t('profileBio')}
              </label>
              <CelTextarea
                value={bio || ''}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t('profileBioPlaceholder')}
                maxLength={200}
                className="min-h-[100px]"
              />
              <p className="font-bold text-[10px] text-[#1a1a2e]/40 mt-1">
                {(bio || '').length}/200
              </p>
            </div>
            <div>
              <label className="font-black uppercase text-xs tracking-tight text-[#1a1a2e] block mb-2">
                {t('profileEmail')}
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border-[3px] border-[#1a1a2e] bg-[#1a1a2e]/5 text-[#1a1a2e]/60 font-bold px-4 py-2.5 text-sm cursor-not-allowed"
              />
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <CelButton variant="green" size="lg" onClick={handleSave} disabled={saving}>
                {saving ? t('loading') : `💾 ${t('save')}`}
              </CelButton>
              <CelButton variant="red" size="lg" onClick={handleLogout}>
                {t('menuLogout')}
              </CelButton>
            </div>
          </div>
        </CelCard>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CelButton as="a" href="/history" variant="yellow" size="lg" className="justify-start">
            📚 {t('menuHistory')} →
          </CelButton>
          <CelButton as="a" href="/tool" variant="blue" size="lg" className="justify-start">
            ✨ {t('navTool')} →
          </CelButton>
        </div>
      </div>
    </div>
  )
}
