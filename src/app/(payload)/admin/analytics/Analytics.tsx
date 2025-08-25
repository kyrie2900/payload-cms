"use client"
import React from 'react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { KolPost, KolProfile } from '@/payload-types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

const Bar = dynamic(() => import('react-chartjs-2').then(m => m.Bar), { ssr: false })
const Line = dynamic(() => import('react-chartjs-2').then(m => m.Line), { ssr: false })
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
        const [pRes, psRes] = await Promise.all([
          fetch('/api/kol_profiles?limit=0'),
          fetch('/api/kol_posts?limit=0'),
        ])
        const [pJson, psJson]: [FindResult<KolProfile>, FindResult<KolPost>] = await Promise.all([pRes.json(), psRes.json()])
        if (!active) return
        setProfilesAgg(pJson)
        setPostsAgg(psJson)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const totalProfiles = profilesAgg?.totalDocs ?? 0
  const totalPosts = postsAgg?.totalDocs ?? 0

  const barData = {
    labels: ['Profiles', 'Posts'],
    datasets: [
      {
        label: 'Totals',
        data: [totalProfiles, totalPosts],
        backgroundColor: ['#4F46E5', '#22C55E'],
      },
    ],
  }

  const lineData = {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        label: 'Views (mock)',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79,70,229,0.2)',
        tension: 0.3,
      },
    ],
  }

  const pieData = {
    labels: ['TikTok', 'YouTube', 'Instagram'],
    datasets: [
      {
        data: [
          profilesAgg?.docs?.filter((d) => d.platform === 1)?.length ?? 0,
          profilesAgg?.docs?.filter((d) => d.platform === 2)?.length ?? 0,
          profilesAgg?.docs?.filter((d) => d.platform === 3)?.length ?? 0,
        ],
        backgroundColor: ['#06B6D4', '#F59E0B', '#EF4444'],
      },
    ],
  }

  return (
    <div style={{ padding: 24 }}>
      {loading && <div style={{ marginBottom: 12 }}>Loading...</div>}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <span style={{ background: '#eef2ff', padding: '6px 10px', borderRadius: 999 }}>Profiles: {totalProfiles}</span>
        <span style={{ background: '#ecfdf5', padding: '6px 10px', borderRadius: 999 }}>Posts: {totalPosts}</span>
      </div>
      <div style={{ background: 'white', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <Bar data={barData} />
      </div>
      <div style={{ background: 'white', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <Line data={lineData} />
      </div>
      <div style={{ background: 'white', padding: 16, borderRadius: 8 }}>
        <Pie data={pieData} />
      </div>
    </div>
  )
}

export default Analytics


