'use client'
import React from 'react'

interface DateCellProps {
  cellData: string
}

const DateCell: React.FC<DateCellProps> = ({ cellData }) => {
  if (!cellData) return <span>-</span>
  
  const date = new Date(cellData)
  if (isNaN(date.getTime())) return <span>-</span>
  
  // 格式化为 YYYY-MM-DD HH:MM:SS
  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  return (
    <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
      {formatDate(date)}
    </span>
  )
}

export default DateCell