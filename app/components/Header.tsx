'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'ニュース', href: '/' },
  { label: '用語集', href: '/glossary' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
        <nav className="flex gap-6">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors ${
                  isActive
                    ? 'font-bold text-gray-900 underline underline-offset-4'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
