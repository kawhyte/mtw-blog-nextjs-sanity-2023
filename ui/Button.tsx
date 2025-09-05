/* eslint-disable @next/next/no-html-link-for-pages */
import { inter } from 'app/fonts'
import Link from 'next/link'
import { ReactNode } from 'react'
import * as LucideReact from 'lucide-react'
import clsx from 'clsx'

interface ButtonProps {
  children?: ReactNode
  link?: string
  text?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  fontSize?: 'sm' | 'md' | 'lg'
  hoverColor?: string
  icon?: any
  iconSize?: number
  noBorder?: boolean
  align?: 'left' | 'center' | 'right'
  className?: string // Allow custom class names
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  xs: 'text-xs py-1 px-3',
  sm: 'text-sm py-1 px-3',
  md: 'text-base py-2 px-5',
  lg: 'text-lg py-3 px-7',
}

const fontSizeClasses: Record<NonNullable<ButtonProps['fontSize']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const alignClasses: Record<NonNullable<ButtonProps['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export default function Button({
  text,
  link,
  children,
  size = 'md',
  fontSize = 'md',
  hoverColor = 'pink-200',
  icon,
  iconSize = 16,
  noBorder = false,
  align = 'center',
  className,
}: ButtonProps) {
  const IconComponent = icon ? LucideReact[icon] : null

  const baseClasses = clsx(
    'flex',
    'items-center',
    'text-gray-700',
    'text-shade-90',
    'after:bg-shine',
    'after:hover:animate-shine',
    'before:bg-gradient-btn',
    'text-t4',
    'relative',
    'z-10',
    'w-full',
    'scale-95',
    'overflow-hidden',
    'whitespace-nowrap',
    'rounded-[36px]',
    'bg-white',
    'font-medium',
    'uppercase',
    'leading-6',
    'tracking-tight',
    'transition-transform',
    'duration-300',
    'before:absolute',
    'before:inset-0',
    'before:-z-10',
    'before:rounded-[36px]',
    'before:opacity-0',
    'before:transition-opacity',
    'before:duration-500',
    'after:absolute',
    'after:inset-0',
    'after:rounded-[36px]',
    'after:bg-position-[-3em]',
    'after:bg-no-repeat',
    'after:bg-size-[auto_100%]',
    'hover:scale-100',
    'hover:before:opacity-100',
    'after:hover:[animation-fill-mode:forwards]',
    'focus:scale-100',
    'focus:before:opacity-100',
    'motion-reduce:hover:scale-95',
    'motion-reduce:after:hover:animate-none',
    'motion-reduce:focus:scale-95',
    sizeClasses[size],
    fontSizeClasses[fontSize],
    `hover:bg-${hoverColor}`,
    !noBorder && 'border-4 border-[#1f1f1f] shadow-[4px_4px_#1f1f1f]',
    className, // Apply custom class names
  )

  const containerClasses = clsx('w-full', 'flex', {
    'justify-start': align === 'left',
    'justify-center': align === 'center',
    'justify-end': align === 'right',
  })

  const buttonContent = (
    <div className={containerClasses}>
      {icon && <span className="mr-2">{icon}</span>}
      <div className={alignClasses[align]}>
        {text}
        {children}
      </div>
    </div>
  )

  if (link) {
    return (
      <Link href={link} passHref legacyBehavior>
        <div className={baseClasses}>{buttonContent}</div>
      </Link>
    )
  } else {
    return (
      <button className={baseClasses} type="button">
        {buttonContent}
      </button>
    )
  }
}
