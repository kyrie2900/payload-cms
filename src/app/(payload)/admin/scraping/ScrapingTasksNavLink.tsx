'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ScrapingTasksNavLink: React.FC = () => {
  const pathname = usePathname()
  const isActive = pathname?.includes('/custom/scraping')

  return (
    <div style={{ 
      margin: '0 0 calc(var(--base) / 4) 0'
    }}>
      <Link 
        href="/admin/custom/scraping"
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: isActive ? 'var(--theme-text)' : 'var(--theme-text-dim)',
          fontSize: '13px',
          fontFamily: 'var(--font-body)',
          padding: '6px var(--base)',
          borderRadius: 'var(--style-radius-s)',
          margin: '0 var(--base)',
          transition: 'all 150ms ease',
          fontWeight: isActive ? '600' : '400',
          backgroundColor: isActive ? 'var(--theme-elevation-100)' : 'transparent',
          border: '1px solid transparent',
          minHeight: '32px',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)'
            e.currentTarget.style.color = 'var(--theme-text)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--theme-text-dim)'
          }
        }}
      >
        <span style={{ 
          marginRight: '8px', 
          fontSize: '14px',
          opacity: 0.8,
          width: '14px',
          textAlign: 'center'
        }}>🕷️</span>
        爬取任务
      </Link>
    </div>
  )
}

export default ScrapingTasksNavLink