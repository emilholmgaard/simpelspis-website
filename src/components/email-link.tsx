'use client'

import { useEffect, useState } from 'react'

interface EmailLinkProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Email link component that obfuscates the email address to protect it from spam harvesters.
 * The email is constructed client-side using JavaScript, so it won't appear in plain text in the HTML source.
 */
export function EmailLink({ className, children }: EmailLinkProps) {
  const [email, setEmail] = useState<string>('')
  const [href, setHref] = useState<string>('')

  useEffect(() => {
    // Construct email client-side to avoid spam harvesters
    const localPart = 'hej'
    const domain = 'simpelspis.dk'
    const fullEmail = `${localPart}@${domain}`
    setEmail(fullEmail)
    setHref(`mailto:${fullEmail}`)
  }, [])

  if (!email) {
    // Show placeholder while email is being constructed
    return (
      <span className={className}>
        {children || '...'}
      </span>
    )
  }

  return (
    <a
      href={href}
      className={className}
    >
      {children || email}
    </a>
  )
}

