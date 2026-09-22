// src/components/cel/Logo.tsx
// ============================================
// 全站品牌标识唯一来源（引用 /logo.svg）
// 换 logo：直接替换 public/logo.svg 文件，本文件通常无需改动
// ⚠️ 标签页图标不会自动同步，需手动执行：
//    cp public/logo.svg src/app/icon.svg
// ============================================

import { cn } from '@/lib/utils'

interface CelLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string   // 透传使用方定制（如 Navbar 的 hover 效果）
}

const logoSizes = {
  sm: 'w-9 h-9',                    // Footer
  md: 'w-9 h-9 md:w-11 md:h-11',    // Navbar（响应式）
  lg: 'w-16 h-16',                  // 404 页等大场景
}

export function CelLogo({ size = 'md', className }: CelLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt="RedCopy"
      className={cn(
        'object-contain',
        'border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e]',
        logoSizes[size],
        className
      )}
    />
  )
}
