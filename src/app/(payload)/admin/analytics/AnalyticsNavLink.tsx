'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AnalyticsNavLink: React.FC = () => {
  const pathname = usePathname()
  const isActive = pathname?.includes('/custom/analytics')

  return (
    <Link 
      href="/admin/custom/analytics"
      className="nav-link"
      style={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: isActive ? 'var(--theme-text)' : 'var(--theme-text-dim)',
        fontSize: '13px',
        fontFamily: 'var(--font-body)',
        fontWeight: isActive ? '600' : '400',
        padding: '8px var(--base)',
        margin: '0 var(--base) 4px var(--base)',
        borderRadius: 'var(--style-radius-s)',
        backgroundColor: isActive ? 'var(--theme-elevation-100)' : 'transparent',
        border: isActive ? '1px solid var(--theme-elevation-200)' : '1px solid transparent',
        transition: 'all 150ms ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)'
          e.currentTarget.style.borderColor = 'var(--theme-elevation-150)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.borderColor = 'transparent'
        }
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: '8px', opacity: 0.7 }}
      >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
      数据分析
    </Link>
  )
}

export default AnalyticsNavLink
