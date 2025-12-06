import { clsx } from 'clsx'

export function Gradient({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'bg-linear-115 from-[#1e3a8a] from-28% via-[#1e40af] via-70% to-[#0f172a] sm:bg-linear-145',
      )}
    />
  )
}

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          'absolute -top-44 -right-60 h-60 w-xl transform-gpu md:right-0',
          'bg-linear-115 from-[#1e3a8a] from-28% via-[#1e40af] via-70% to-[#0f172a]',
          'dark:from-[#1e3a8a] dark:via-[#1e40af] dark:to-[#0f172a]',
          'rotate-[-10deg] rounded-full blur-3xl opacity-100 dark:opacity-40',
        )}
      />
    </div>
  )
}
