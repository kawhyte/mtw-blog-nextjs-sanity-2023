import { twMerge } from 'tailwind-merge'

type SpacingVariant = 'standard' | 'tight' | 'loose'

const spacingMap: Record<SpacingVariant, string> = {
  tight: 'py-8 md:py-12',
  standard: 'py-16 md:py-24',
  loose: 'py-24 md:py-32',
}

interface SectionProps {
  children: React.ReactNode
  spacing?: SpacingVariant
  className?: string
  as?: React.ElementType
}

export function Section({
  children,
  spacing = 'standard',
  className,
  as: Tag = 'section',
}: SectionProps) {
  return (
    <Tag className={twMerge(spacingMap[spacing], className)}>{children}</Tag>
  )
}
