/* eslint-disable @next/next/no-html-link-for-pages */
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as LucideReact from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/lib/utils'

// Custom button variants matching the original design exactly
const buttonVariants = cva(
  [
    // Base styles - exactly matching the original
    'relative z-10 flex w-full items-center overflow-hidden whitespace-nowrap',
    'rounded-[36px] bg-white font-medium uppercase leading-6 tracking-tight',
    'text-gray-700 transition-transform duration-300 scale-95',
    // Pseudo elements for the original shine and gradient effects
    'before:absolute before:inset-0 before:-z-10 before:rounded-[36px]',
    'before:bg-gradient-btn before:opacity-0 before:transition-opacity before:duration-500',
    'after:absolute after:inset-0 after:rounded-[36px] after:bg-shine',
    'after:bg-position-[-3em] after:bg-no-repeat after:bg-size-[auto_100%]',
    // Hover states - exactly matching original
    'hover:scale-100 hover:before:opacity-100',
    'after:hover:animate-shine after:hover:[animation-fill-mode:forwards]',
    // Focus states
    'focus:scale-100 focus:before:opacity-100 focus-visible:outline-none',
    // Motion reduce accessibility
    'motion-reduce:hover:scale-95 motion-reduce:after:hover:animate-none',
    'motion-reduce:focus:scale-95',
    // Original custom classes
    'text-shade-90 text-t4',
  ],
  {
    variants: {
      size: {
        xs: 'text-xs py-1 px-3',
        sm: 'text-sm py-1 px-3', 
        md: 'text-base py-2 px-5',
        lg: 'text-lg py-3 px-7',
      },
      fontSize: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      align: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
      },
      bordered: {
        true: 'border-4 border-[#1f1f1f] shadow-[4px_4px_#1f1f1f]',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      fontSize: 'md',
      align: 'center', 
      bordered: true,
    },
  }
)

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode
  text?: string
  link?: string
  icon?: keyof typeof LucideReact | React.ReactNode
  iconSize?: number
  hoverColor?: string
  noBorder?: boolean
  asChild?: boolean
}

const alignTextClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const

export default function Button({
  className,
  children,
  text,
  link,
  icon,
  iconSize = 16,
  size,
  fontSize,
  align = 'center',
  hoverColor = 'pink-200',
  noBorder = false,
  asChild = false,
  ...props
}: ButtonProps) {
  // Handle both string icon names and React elements
  let iconElement: React.ReactNode = null
  if (icon) {
    if (typeof icon === 'string' && LucideReact[icon]) {
      const IconComponent = LucideReact[icon] as React.ComponentType<{size?: number}>
      iconElement = <IconComponent size={iconSize} />
    } else {
      iconElement = icon
    }
  }

  // Create hover color class
  const hoverColorClass = `hover:bg-${hoverColor}`
  
  const buttonContent = (
    <div className="w-full flex">
      {iconElement && (
        <span className="mr-2">
          {iconElement}
        </span>
      )}
      <div className={cn('w-full flex', {
        'justify-start': align === 'left',
        'justify-center': align === 'center', 
        'justify-end': align === 'right',
      })}>
        <div className={alignTextClasses[align]}>
          {text}
          {children}
        </div>
      </div>
    </div>
  )

  const baseClasses = cn(
    buttonVariants({
      size,
      fontSize,
      align,
      bordered: !noBorder,
    }),
    hoverColorClass,
    className
  )

  if (link) {
    if (asChild) {
      return (
        <Slot className={baseClasses}>
          {buttonContent}
        </Slot>
      )
    }
    return (
      <Link 
        href={link} 
        className={cn(baseClasses, 'block')}
        role="button"
        tabIndex={0}
      >
        {buttonContent}
      </Link>
    )
  }

  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={baseClasses} type="button" {...props}>
      {buttonContent}
    </Comp>
  )
}

export { buttonVariants }
export type { ButtonProps }