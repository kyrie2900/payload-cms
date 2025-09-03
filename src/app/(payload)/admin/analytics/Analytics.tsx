"use client"
import React from 'react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { KolPost, KolProfile } from '@/payload-types'
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

const Pie = dynamic(() => import('react-chartjs-2').then(m => m.Pie), { ssr: false })

type FindResult<T> = { docs: T[]; totalDocs: number }

const Analytics: React.FC = () => {
  const [profilesAgg, setProfilesAgg] = useState<FindResult<KolProfile> | null>(null)
  const [postsAgg, setPostsAgg] = useState<FindResult<KolPost> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        console.log('开始获取数据...')
        const [pRes, psRes] = await Promise.all([
          fetch('/api/kol_profiles?limit=0'),
          fetch('/api/kol_posts?limit=0'),
        ])
        
        console.log('API响应状态:', { 
          profiles: pRes.status, 
          posts: psRes.status 
        })
        
        if (!pRes.ok) {
          console.error('Profiles API错误:', pRes.status, pRes.statusText)
        }
        if (!psRes.ok) {
          console.error('Posts API错误:', psRes.status, psRes.statusText)
        }
        
        const [pJson, psJson]: [FindResult<KolProfile>, FindResult<KolPost>] = await Promise.all([pRes.json(), psRes.json()])
        
        console.log('获取到的数据:', {
          profiles: pJson.totalDocs,
          posts: psJson.totalDocs,
          profilesSample: pJson.docs?.[0],
          postsSample: psJson.docs?.[0]
        })
        
        if (!active) return
        setProfilesAgg(pJson)
        setPostsAgg(psJson)
      } catch (error) {
        console.error('数据获取失败:', error)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  // 平台达人数量统计
  const profilesByPlatform = {
    tiktok: profilesAgg?.docs?.filter((d) => d.platform === 1)?.length ?? 0,
    youtube: profilesAgg?.docs?.filter((d) => d.platform === 2)?.length ?? 0,
    instagram: profilesAgg?.docs?.filter((d) => d.platform === 3)?.length ?? 0,
  }

  // 平台帖子数量统计
  const postsByPlatform = {
    tiktok: postsAgg?.docs?.filter((d) => d.platform === 1)?.length ?? 0,
    youtube: postsAgg?.docs?.filter((d) => d.platform === 2)?.length ?? 0,
    instagram: postsAgg?.docs?.filter((d) => d.platform === 3)?.length ?? 0,
  }

  // 达人数量饼状图数据
  const profilesPieData = {
    labels: ['TikTok', 'YouTube', 'Instagram'],
    datasets: [
      {
        label: '达人数量',
        data: [profilesByPlatform.tiktok, profilesByPlatform.youtube, profilesByPlatform.instagram],
        backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'], // TikTok蓝色, YouTube橙色, Instagram绿色
        borderColor: ['#2563EB', '#D97706', '#059669'],
        borderWidth: 2,
        hoverBackgroundColor: ['#2563EB', '#D97706', '#059669'], // 悬停时颜色稍深
      },
    ],
  }

  // 帖子数量饼状图数据
  const postsPieData = {
    labels: ['TikTok', 'YouTube', 'Instagram'],
    datasets: [
      {
        label: '帖子数量',
        data: [postsByPlatform.tiktok, postsByPlatform.youtube, postsByPlatform.instagram],
        backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'], // TikTok蓝色, YouTube橙色, Instagram绿色
        borderColor: ['#2563EB', '#D97706', '#059669'],
        borderWidth: 2,
        hoverBackgroundColor: ['#2563EB', '#D97706', '#059669'], // 悬停时颜色稍深
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const dataset = context.dataset;
            const total = dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  }

  const totalProfiles = profilesByPlatform.tiktok + profilesByPlatform.youtube + profilesByPlatform.instagram
  const totalPosts = postsByPlatform.tiktok + postsByPlatform.youtube + postsByPlatform.instagram

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 32, fontSize: 28, fontWeight: 'bold', color: '#1F2937' }}>
        数据分析概览
      </h1>
      
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: 40, 
          color: '#6B7280',
          fontSize: 16 
        }}>
          加载中...
        </div>
      )}
      
      {!loading && (
        <>
          {/* 统计概览 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 16, 
            marginBottom: 32 
          }}>
            <div style={{ 
              background: 'white', 
              padding: 24, 
              borderRadius: 12, 
              border: '1px solid #E5E7EB',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#3B82F6', marginBottom: 8 }}>
                {totalProfiles}
              </div>
              <div style={{ fontSize: 14, color: '#6B7280' }}>总达人数</div>
            </div>
            <div style={{ 
              background: 'white', 
              padding: 24, 
              borderRadius: 12, 
              border: '1px solid #E5E7EB',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#10B981', marginBottom: 8 }}>
                {totalPosts}
              </div>
              <div style={{ fontSize: 14, color: '#6B7280' }}>总帖子数</div>
            </div>
          </div>

          {/* 图表区域 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: 24 
          }}>
            {/* 达人数量分布 */}
            <div style={{ 
              background: 'white', 
              padding: 24, 
              borderRadius: 12, 
              border: '1px solid #E5E7EB' 
            }}>
              <h3 style={{ 
                marginBottom: 20, 
                fontSize: 18, 
                fontWeight: '600', 
                color: '#1F2937',
                textAlign: 'center'
              }}>
                各平台达人数量分布
              </h3>
              <div style={{ height: 300 }}>
                <Pie data={profilesPieData} options={chartOptions} />
              </div>
            </div>

            {/* 帖子数量分布 */}
            <div style={{ 
              background: 'white', 
              padding: 24, 
              borderRadius: 12, 
              border: '1px solid #E5E7EB' 
            }}>
              <h3 style={{ 
                marginBottom: 20, 
                fontSize: 18, 
                fontWeight: '600', 
                color: '#1F2937',
                textAlign: 'center'
              }}>
                各平台帖子数量分布
              </h3>
              <div style={{ height: 300 }}>
                <Pie data={postsPieData} options={chartOptions} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Analytics


