'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Cel Shading Button - 赛璐璐动画风按钮
type ButtonVariant = 'red' | 'blue' | 'green' | 'yellow' | 'white' | 'dark'
type ButtonSize = 'sm' | 'md' | 'lg'

interface CelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  as?: 'button' | 'a' | 'link'   // 新增 link 模式
  href?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  red: 'bg-[#e63946] text-white',
  blue: 'bg-[#4ea8de] text-white',
  green: 'bg-[#2ecc71] text-white',
  yellow: 'bg-[#f1c40f] text-[#1a1a2e]',
  white: 'bg-white text-[#1a1a2e]',
  dark: 'bg-[#1a1a2e] text-white',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export function CelButton({
  variant = 'red',
  size = 'md',
  className,
  children,
  as = 'button',
  href,
  ...props
}: CelButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2',
    'border-[3px] border-[#1a1a2e] rounded-none',
    'font-black uppercase tracking-tight',
    'shadow-[3px_3px_0_#1a1a2e]',
    'transition-all duration-75 ease-linear',
    'hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#1a1a2e]',
    'active:translate-x-1 active:translate-y-1 active:shadow-none',
    'focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1a1a2e]/30',
    'disabled:opacity-50 disabled:pointer-events-none',
    'cel-stripe',
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  if (as === 'link' && href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  if (as === 'a' && href) {
    return (
      <a href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

// Cel Shading Card
interface CelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'white' | 'red' | 'blue' | 'green' | 'yellow' | 'dark'
  shadow?: 'sm' | 'md' | 'lg'
}

const cardColors = {
  white: 'bg-white text-[#1a1a2e]',
  red: 'bg-[#e63946] text-white',
  blue: 'bg-[#4ea8de] text-white',
  green: 'bg-[#2ecc71] text-white',
  yellow: 'bg-[#f1c40f] text-[#1a1a2e]',
  dark: 'bg-[#1a1a2e] text-white',
}

const cardShadows = {
  sm: 'shadow-[2px_2px_0_#1a1a2e]',
  md: 'shadow-[3px_3px_0_#1a1a2e]',
  lg: 'shadow-[4px_4px_0_#1a1a2e]',
}

export function CelCard({
  color = 'white',
  shadow = 'md',
  className,
  children,
  ...props
}: CelCardProps) {
  return (
    <div
      className={cn(
        'border-[3px] border-[#1a1a2e] rounded-none p-6',
        cardColors[color],
        cardShadows[shadow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Cel Shading Input
interface CelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function CelInput({ label, className, id, ...props }: CelInputProps) {
  const inputId = id || label?.replace(/\s+/g, '-').toLowerCase()
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="font-black uppercase text-xs tracking-tight text-[#1a1a2e]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'border-[3px] border-[#1a1a2e] rounded-none',
          'bg-white text-[#1a1a2e] font-bold',
          'px-4 py-3 text-sm',
          'focus:outline-none focus:shadow-[3px_3px_0_#1a1a2e]',
          'transition-all duration-75',
          'placeholder:text-[#1a1a2e]/40',
          className
        )}
        {...props}
      />
    </div>
  )
}

// Cel Shading Textarea
interface CelTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function CelTextarea({ label, className, id, ...props }: CelTextareaProps) {
  const inputId = id || label?.replace(/\s+/g, '-').toLowerCase()
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="font-black uppercase text-xs tracking-tight text-[#1a1a2e]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'border-[3px] border-[#1a1a2e] rounded-none',
          'bg-white text-[#1a1a2e] font-bold',
          'px-4 py-3 text-sm',
          'focus:outline-none focus:shadow-[3px_3px_0_#1a1a2e]',
          'transition-all duration-75',
          'placeholder:text-[#1a1a2e]/40',
          'resize-y min-h-[120px]',
          className
        )}
        {...props}
      />
    </div>
  )
}

// Cel Shading Badge
interface CelBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'white' | 'dark'
}

const badgeColors = {
  red: 'bg-[#e63946] text-white',
  blue: 'bg-[#4ea8de] text-white',
  green: 'bg-[#2ecc71] text-white',
  yellow: 'bg-[#f1c40f] text-[#1a1a2e]',
  white: 'bg-white text-[#1a1a2e]',
  dark: 'bg-[#1a1a2e] text-white',
}

export function CelBadge({ color = 'yellow', className, children, ...props }: CelBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'border-[3px] border-[#1a1a2e] rounded-none',
        'px-2.5 py-1 text-xs font-black uppercase tracking-tight',
        badgeColors[color],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// Back Button - 返回按钮
interface BackButtonProps {
  href?: string
  onClick?: () => void
  label?: string
}

export function CelBackButton({ href, onClick, label }: BackButtonProps) {
  if (href) {
    return (
      <CelButton as="a" href={href} variant="white" size="sm">
        <span aria-hidden>←</span>
        {label || 'Back'}
      </CelButton>
    )
  }
  return (
    <CelButton variant="white" size="sm" onClick={onClick}>
      <span aria-hidden>←</span>
      {label || 'Back'}
    </CelButton>
  )
}
