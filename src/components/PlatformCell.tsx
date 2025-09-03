'use client'
import React from 'react'

interface PlatformCellProps {
  cellData: number
}

const PlatformCell: React.FC<PlatformCellProps> = ({ cellData }) => {
  const platformMap: Record<number, string> = {
    1: 'TikTok',
    2: 'YouTube', 
    3: 'Instagram'
  }

  const platformName = platformMap[cellData] || `未知(${cellData})`

  return (
    <span>
      {platformName}
    </span>
  )
}

export default PlatformCell