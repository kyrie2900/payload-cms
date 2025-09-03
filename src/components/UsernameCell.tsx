'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

interface UsernameCellProps {
  cellData: string
  rowData: {
    id: string | number
    [key: string]: any
  }
}

const UsernameCell: React.FC<UsernameCellProps> = ({ cellData, rowData }) => {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // 导航到详情页面
    router.push(`/admin/collections/kol_profiles/${rowData.id}`)
  }

  return (
    <button
      onClick={handleClick}
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--theme-success-500)',
        textDecoration: 'underline',
        cursor: 'pointer',
        fontSize: '13px',
        fontFamily: 'inherit',
        padding: 0,
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--theme-success-400)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--theme-success-500)'
      }}
    >
      {cellData || '未命名用户'}
    </button>
  )
}

export default UsernameCell