'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

interface PostIdCellProps {
  cellData: string
  rowData: {
    id: string | number
    [key: string]: any
  }
}

const PostIdCell: React.FC<PostIdCellProps> = ({ cellData, rowData }) => {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // 导航到详情页面
    router.push(`/admin/collections/kol_posts/${rowData.id}`)
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
        fontFamily: 'monospace',
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
      {cellData || '无ID'}
    </button>
  )
}

export default PostIdCell