'use client'

import * as Headless from '@headlessui/react'
import { clsx } from 'clsx'
import { Link } from './link'

const variants = {
  primary: clsx(
    'inline-flex items-center justify-center px-4 py-[calc(--spacing(2)-1px)]',
    'rounded-full border border-transparent bg-gray-950 dark:bg-white shadow-md',
    'text-base font-medium whitespace-nowrap text-white dark:text-black',
    'data-disabled:bg-gray-950 dark:data-disabled:bg-white data-disabled:opacity-40 data-hover:bg-gray-800 dark:data-hover:bg-gray-200',
  ),
  secondary: clsx(
    'relative inline-flex items-center justify-center px-4 py-[calc(--spacing(2)-1px)]',
    'rounded-full border border-transparent bg-white/15 dark:bg-gray-800/50 shadow-md ring-1 ring-[#D15052]/15 dark:ring-white/20',
    'after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_2px_1px_#ffffff4d]',
    'text-base font-medium whitespace-nowrap text-gray-950 dark:text-gray-50',
    'data-disabled:bg-white/15 dark:data-disabled:bg-gray-800/50 data-disabled:opacity-40 data-hover:bg-white/20 dark:data-hover:bg-gray-800/70',
  ),
  outline: clsx(
    'inline-flex items-center justify-center px-4 py-[calc(--spacing(2)-1px)]',
    'rounded-full border border-transparent shadow-sm ring-1 ring-black/10 dark:ring-white/20',
    'text-base font-medium whitespace-nowrap text-gray-950 dark:text-gray-50',
    'data-disabled:bg-transparent data-disabled:opacity-40 data-hover:bg-gray-50 dark:data-hover:bg-gray-800',
  ),
}

type ButtonProps = {
  variant?: keyof typeof variants
  onClick?: () => void
} & (
  | (React.ComponentPropsWithoutRef<typeof Link> & { href: string })
  | (Headless.ButtonProps & { href?: undefined })
)

export function Button({
  variant = 'primary',
  className,
  onClick,
  ...props
}: ButtonProps) {
  className = clsx(className, variants[variant])

  if (onClick || typeof (props as { href?: string }).href === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, ...buttonProps } = props as Headless.ButtonProps & { href?: string }
    return <Headless.Button {...buttonProps} onClick={onClick} className={className} />
  }

  return <Link {...(props as React.ComponentPropsWithoutRef<typeof Link>)} className={className} />
}
