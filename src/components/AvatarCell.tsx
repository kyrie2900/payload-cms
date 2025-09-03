'use client'
import React from 'react'

interface AvatarCellProps {
  cellData: string
}

const AvatarCell: React.FC<AvatarCellProps> = ({ cellData }) => {
  if (!cellData) {
    return (
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        backgroundColor: '#F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#9CA3AF'
      }}>
        N/A
      </div>
    )
  }

  // URL转换逻辑
  const convertAvatarUrl = (originalUrl: string): string => {
    const newPrefix = 'https://pub-1a0fb58cf6644207878fb74d0241e9a1.r2.dev/'
    
    // 查找平台名称开始的位置（instagram、tiktok、youtube等）
    const platformMatches = originalUrl.match(/(instagram|tiktok|youtube)\/.*/)
    
    if (platformMatches && platformMatches[1]) {
      // 提取从平台名称开始的部分
      let pathFromPlatform = platformMatches[0]
      
      // 检查是否为不支持的图片格式并转换
      if (pathFromPlatform.endsWith('.heic') || pathFromPlatform.endsWith('.HEIC')) {
        pathFromPlatform = pathFromPlatform.replace(/\.heic$/i, '.jpg')
      }
      
      return newPrefix + pathFromPlatform
    }
    
    // 如果没有找到平台名称，检查原URL的格式
    let processedUrl = originalUrl
    if (originalUrl.endsWith('.heic') || originalUrl.endsWith('.HEIC')) {
      processedUrl = originalUrl.replace(/\.heic$/i, '.jpg')
    }
    
    return processedUrl
  }

  // 检查是否为不支持的格式
  const isUnsupportedFormat = (url: string): boolean => {
    return /\.(heic|webp|avif)$/i.test(url)
  }

  const imageUrl = convertAvatarUrl(cellData)
  const originalIsUnsupported = isUnsupportedFormat(cellData)

  // 如果原始URL是不支持的格式，显示特殊提示
  if (originalIsUnsupported) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '50px'
      }}>
        {/* 尝试显示转换后的图片 */}
        <img
          src={imageUrl}
          alt="Avatar"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            objectFit: 'cover',
            border: '1px solid #FCD34D'
          }}
          onError={(e) => {
            // 如果转换后的图片也加载失败，显示格式不支持的占位符
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const placeholder = target.nextElementSibling as HTMLElement
            if (placeholder) {
              placeholder.style.display = 'flex'
            }
          }}
        />
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '20px',
          backgroundColor: '#FEF3C7',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: '#92400E',
          border: '1px solid #FCD34D',
          textAlign: 'center'
        }}>
          HEIC
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: '50px'
    }}>
      <img
        src={imageUrl}
        alt="Avatar"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '20px',
          objectFit: 'cover',
          border: '1px solid #E5E7EB'
        }}
        onError={(e) => {
          // 如果图片加载失败，显示默认占位符
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const placeholder = target.nextElementSibling as HTMLElement
          if (placeholder) {
            placeholder.style.display = 'flex'
          }
        }}
      />
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        backgroundColor: '#F3F4F6',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#9CA3AF',
        border: '1px solid #E5E7EB'
      }}>
        ?
      </div>
    </div>
  )
}

export default AvatarCell