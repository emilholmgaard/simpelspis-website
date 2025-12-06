'use client'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { Bars2Icon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { Container } from './container'
import { Link } from './link'
import { Logo } from './logo'

const links = [
  { href: '/opskrifter', label: 'Nemme Opskrifter' },
]

function DesktopNav() {
  return (
    <nav className="relative hidden lg:flex gap-4">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center px-4 py-3 text-base font-medium text-gray-950 dark:text-gray-50 bg-blend-multiply data-hover:bg-black/2.5 dark:data-hover:bg-white/10"
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

function MobileNavButton() {
  return (
    <DisclosureButton
      className="flex size-12 items-center justify-center self-center rounded-lg data-hover:bg-black/5 dark:data-hover:bg-white/10 lg:hidden"
      aria-label="Open main menu"
    >
      <Bars2Icon className="size-6 text-gray-950 dark:text-gray-50" />
    </DisclosureButton>
  )
}

function MobileNav() {
  return (
    <DisclosurePanel className="lg:hidden">
      <div className="flex flex-col gap-6 py-4">
        {links.map(({ href, label }, linkIndex) => (
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.15,
              ease: 'easeInOut',
              rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
            }}
            key={href}
          >
            <Link href={href} className="text-base font-medium text-gray-950 dark:text-gray-50">
              {label}
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="absolute inset-x-0 top-0 border-t border-black/5 dark:border-white/10" />
        <div className="absolute inset-x-0 top-2 border-t border-black/5 dark:border-white/10" />
      </div>
    </DisclosurePanel>
  )
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute left-1/2 w-screen -translate-x-1/2 bottom-0 border-b border-gray-200 dark:border-gray-700" />
      <Container>
        <Disclosure as="header" className="pt-12 sm:pt-16">
          <div className="relative flex justify-between items-center">
            <div className="relative flex gap-6 items-center">
              <Link href="/" title="Home">
                <Logo className="h-9" />
              </Link>
              {banner && (
                <div className="relative hidden items-center py-3 lg:flex">
                  {banner}
                </div>
              )}
            </div>
            <DesktopNav />
            <MobileNavButton />
          </div>
          <MobileNav />
        </Disclosure>
      </Container>
    </div>
  )
}
