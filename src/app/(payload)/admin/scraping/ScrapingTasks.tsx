"use client"
import React, { useEffect, useState } from 'react'
import UserListModal from '../../../../components/UserListModal'

interface ScrapingRequest {
  tiktok_influencer_list: string[]
  instagram_influencer_list: string[]
  youtube_influencer_list: string[]
  max_videos_per_user: number
  scrape_time: string
}

// 后端返回的任务数据结构
interface BackendTask {
  task_id: string
  task_name: string
  task_description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  request_params: {
    config: {
      save_to_db: boolean
      export_to_file: boolean
      save_snapshots: boolean
    }
    tiktok?: {
      usernames: string[]
      max_videos: number
    } | null
    youtube?: {
      channel_urls: string[]
      max_videos: number
    } | null
    instagram?: {
      usernames: string[]
      max_videos: number
    } | null
  }
  total_platforms: number
  completed_platforms: number
  failed_platforms: number
  tiktok_status: string
  youtube_status: string
  instagram_status: string
  tiktok_results?: Record<string, unknown>
  youtube_results?: Record<string, unknown>
  instagram_results?: Record<string, unknown>
  total_profiles_scraped: number
  total_posts_scraped: number
  total_profiles_saved: number
  total_posts_saved: number
  total_snapshots_saved: number
  created_time: string
  started_at?: string
  completed_at?: string
  updated_time: string
  duration_seconds?: number
  error_message?: string
  error_details?: string
  progress_percentage: number
  success_rate: number
}

// 后端分页响应结构
interface TaskListResponse {
  page: number
  page_size: number
  total: number
  items: BackendTask[]
}

const ScrapingTasks: React.FC = () => {
  const [tasks, setTasks] = useState<BackendTask[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  // Form states
  const [tiktokUsers, setTiktokUsers] = useState('')
  const [instagramUsers, setInstagramUsers] = useState('')
  const [youtubeUsers, setYoutubeUsers] = useState('')
  const [maxVideosPerUser, setMaxVideosPerUser] = useState(5)
  
  // Modal states
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    users: [] as string[]
  })

  // 使用 Next.js 代理，避免跨域问题
  const BACKEND_URL = '/backend-api'

  const loadTasks = async (page: number = currentPage) => {
    setLoading(true)
    try {
      // 直接调用后端服务
      const response = await fetch(`${BACKEND_URL}/tasks?page=${page}&page_size=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data: TaskListResponse = await response.json()
        setTasks(data.items || [])
        setTotal(data.total)
        setCurrentPage(data.page)
        setTotalPages(Math.ceil(data.total / data.page_size))
      }
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  // 页面初次加载时查询任务列表
  useEffect(() => {
    loadTasks(1) // 加载第1页的任务列表
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const submitScrapingTask = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Parse user lists
    const tiktokList = tiktokUsers.split('\n').map(u => u.trim()).filter(u => u)
    const instagramList = instagramUsers.split('\n').map(u => u.trim()).filter(u => u)
    const youtubeList = youtubeUsers.split('\n').map(u => u.trim()).filter(u => u)
    
    if (tiktokList.length === 0 && instagramList.length === 0 && youtubeList.length === 0) {
      alert('请至少输入一个平台的用户名')
      return
    }

    setSubmitting(true)
    try {
      const requestData: ScrapingRequest = {
        tiktok_influencer_list: tiktokList,
        instagram_influencer_list: instagramList,
        youtube_influencer_list: youtubeList,
        max_videos_per_user: maxVideosPerUser,
        scrape_time: new Date().toISOString(),
      }
      
      // 直接调用后端服务
      const response = await fetch(`${BACKEND_URL}/influencer/scrape-process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        // Clear form
        setTiktokUsers('')
        setInstagramUsers('')
        setYoutubeUsers('')
        setMaxVideosPerUser(5)
        // 延迟一下再刷新任务列表，让用户看到任务创建过程
        setTimeout(() => {
          loadTasks(1) // 刷新到第1页
          setCurrentPage(1)
        }, 1000)
      } else {
        const error = await response.json()
        alert(`Failed to submit scraping task: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to submit task:', error)
      alert('Failed to submit scraping task')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status: BackendTask['status']) => {
    switch (status) {
      case 'pending':
        return '#F59E0B'
      case 'running':
        return '#06B6D4'
      case 'completed':
        return '#22C55E'
      case 'failed':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  const getStatusText = (status: BackendTask['status']) => {
    switch (status) {
      case 'pending':
        return '等待中'
      case 'running':
        return '运行中'
      case 'completed':
        return '已完成'
      case 'failed':
        return '失败'
      default:
        return '未知'
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadTasks(page)
  }

  const showUserList = (platform: string, users: string[]) => {
    setModalState({
      isOpen: true,
      title: `${platform} 完整用户列表`,
      users: users
    })
  }

  const closeModal = () => {
    setModalState({
      isOpen: false,
      title: '',
      users: []
    })
  }

  // 分页组件
  const PaginationComponent = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 16 }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          style={{
            padding: '6px 12px',
            borderRadius: 4,
            border: '1px solid #D1D5DB',
            background: currentPage <= 1 ? '#F3F4F6' : '#FFFFFF',
            color: currentPage <= 1 ? '#9CA3AF' : '#374151',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            fontSize: 14,
          }}
        >
          上一页
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                border: '1px solid #D1D5DB',
                background: '#FFFFFF',
                color: '#374151',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              1
            </button>
            {startPage > 2 && <span style={{ color: '#6B7280' }}>...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid #D1D5DB',
              background: page === currentPage ? '#4F46E5' : '#FFFFFF',
              color: page === currentPage ? '#FFFFFF' : '#374151',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: page === currentPage ? 'medium' : 'normal',
            }}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span style={{ color: '#6B7280' }}>...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                border: '1px solid #D1D5DB',
                background: '#FFFFFF',
                color: '#374151',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={{
            padding: '6px 12px',
            borderRadius: 4,
            border: '1px solid #D1D5DB',
            background: currentPage >= totalPages ? '#F3F4F6' : '#FFFFFF',
            color: currentPage >= totalPages ? '#9CA3AF' : '#374151',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            fontSize: 14,
          }}
        >
          下一页
        </button>
        
        <span style={{ marginLeft: 16, color: '#6B7280', fontSize: 14 }}>
          共 {total} 个任务，第 {currentPage} / {totalPages} 页
        </span>
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 'bold' }}>爬取任务管理</h1>
      
      {/* Submit new task form */}
      <div style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 24 }}>
        <h2 style={{ marginBottom: 16, fontSize: 18, fontWeight: 'semibold' }}>创建新的爬取任务</h2>
        <form onSubmit={submitScrapingTask}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'medium' }}>
                TikTok用户名 (每行一个):
              </label>
              <textarea
                value={tiktokUsers}
                onChange={(e) => setTiktokUsers(e.target.value)}
                placeholder="username1&#10;username2&#10;username3"
                rows={6}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: 4,
                  fontSize: 14,
                  resize: 'vertical',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'medium' }}>
                Instagram用户名 (每行一个):
              </label>
              <textarea
                value={instagramUsers}
                onChange={(e) => setInstagramUsers(e.target.value)}
                placeholder="username1&#10;username2&#10;username3"
                rows={6}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: 4,
                  fontSize: 14,
                  resize: 'vertical',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'medium' }}>
                YouTube用户名 (每行一个):
              </label>
              <textarea
                value={youtubeUsers}
                onChange={(e) => setYoutubeUsers(e.target.value)}
                placeholder="channel1&#10;channel2&#10;channel3"
                rows={6}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: 4,
                  fontSize: 14,
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'medium' }}>
                每个用户最大视频数:
              </label>
              <input
                type="number"
                value={maxVideosPerUser}
                onChange={(e) => setMaxVideosPerUser(parseInt(e.target.value) || 1)}
                min="1"
                max="100"
                style={{
                  width: '300px',
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: 4,
                  fontSize: 14,
                }}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: submitting ? '#9CA3AF' : '#4F46E5',
              color: 'white',
              padding: '10px 20px',
              borderRadius: 4,
              border: 'none',
              fontSize: 14,
              fontWeight: 'medium',
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? '提交中...' : '开始爬取任务'}
          </button>
        </form>
      </div>

      {/* Tasks list */}
      <div style={{ background: 'white', padding: 20, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 'semibold' }}>爬取任务列表</h2>
          <button
            onClick={() => loadTasks(currentPage)}
            disabled={loading}
            style={{
              background: loading ? '#9CA3AF' : '#6B7280',
              color: 'white',
              padding: '6px 12px',
              borderRadius: 4,
              border: 'none',
              fontSize: 12,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '刷新中...' : '刷新'}
          </button>
        </div>
        
        {loading && tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>
            加载中...
          </div>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>
            暂无爬取任务
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 'medium' }}>任务ID</th>
                  <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 'medium' }}>平台统计</th>
                  <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 'medium' }}>请求参数</th>
                  <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 'medium' }}>状态</th>
                  <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 'medium' }}>进度</th>
                  <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 'medium' }}>结果统计</th>
                  <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 'medium' }}>时间</th>
                  <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 'medium' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.task_id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 4px', fontSize: 14 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#374151', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.task_id}
                      </div>
                    </td>
                    <td style={{ padding: '12px 4px', fontSize: 14 }}>
                      <div>
                        {task.request_params.tiktok && (
                          <div style={{ fontSize: 12, color: '#3B82F6', marginBottom: 2 }}>
                            TikTok: {task.request_params.tiktok.usernames.length}人
                            <span style={{ color: '#6B7280' }}> ({task.tiktok_status})</span>
                          </div>
                        )}
                        {task.request_params.instagram && (
                          <div style={{ fontSize: 12, color: '#6366F1', marginBottom: 2 }}>
                            Instagram: {task.request_params.instagram.usernames.length}人
                            <span style={{ color: '#6B7280' }}> ({task.instagram_status})</span>
                          </div>
                        )}
                        {task.request_params.youtube && (
                          <div style={{ fontSize: 12, color: '#8B5CF6', marginBottom: 2 }}>
                            YouTube: {task.request_params.youtube.channel_urls.length}人
                            <span style={{ color: '#6B7280' }}> ({task.youtube_status})</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 4px', fontSize: 14 }}>
                      <div style={{ maxWidth: 250, fontSize: 11 }}>
                        {task.request_params.tiktok && (
                          <div style={{ marginBottom: 6 }}>
                            <div style={{ fontWeight: 'medium', color: '#3B82F6', fontSize: 11, marginBottom: 2 }}>
                              TikTok ({task.request_params.tiktok.max_videos}个视频/用户):
                            </div>
                            <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.3, paddingLeft: 8 }}>
                              {task.request_params.tiktok.usernames.slice(0, 3).map((username, index) => (
                                <div key={index} style={{ fontFamily: 'monospace' }}>• {username}</div>
                              ))}
                              {task.request_params.tiktok.usernames.length > 3 && (
                                <div style={{ color: '#9CA3AF', fontSize: 9, marginTop: 1 }}>
                                  ...还有 {task.request_params.tiktok.usernames.length - 3} 个
                                  <button
                                    onClick={() => {
                                      showUserList('TikTok', task.request_params.tiktok!.usernames)
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#3B82F6',
                                      textDecoration: 'underline',
                                      cursor: 'pointer',
                                      fontSize: 9,
                                      marginLeft: 4,
                                    }}
                                  >
                                    查看全部
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {task.request_params.instagram && (
                          <div style={{ marginBottom: 6 }}>
                            <div style={{ fontWeight: 'medium', color: '#6366F1', fontSize: 11, marginBottom: 2 }}>
                              Instagram ({task.request_params.instagram.max_videos}个视频/用户):
                            </div>
                            <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.3, paddingLeft: 8 }}>
                              {task.request_params.instagram.usernames.slice(0, 3).map((username, index) => (
                                <div key={index} style={{ fontFamily: 'monospace' }}>• {username}</div>
                              ))}
                              {task.request_params.instagram.usernames.length > 3 && (
                                <div style={{ color: '#9CA3AF', fontSize: 9, marginTop: 1 }}>
                                  ...还有 {task.request_params.instagram.usernames.length - 3} 个
                                  <button
                                    onClick={() => {
                                      showUserList('Instagram', task.request_params.instagram!.usernames)
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#6366F1',
                                      textDecoration: 'underline',
                                      cursor: 'pointer',
                                      fontSize: 9,
                                      marginLeft: 4,
                                    }}
                                  >
                                    查看全部
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {task.request_params.youtube && (
                          <div style={{ marginBottom: 6 }}>
                            <div style={{ fontWeight: 'medium', color: '#8B5CF6', fontSize: 11, marginBottom: 2 }}>
                              YouTube ({task.request_params.youtube.max_videos}个视频/用户):
                            </div>
                            <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.3, paddingLeft: 8 }}>
                              {task.request_params.youtube.channel_urls.slice(0, 3).map((channel, index) => (
                                <div key={index} style={{ fontFamily: 'monospace' }}>• {channel}</div>
                              ))}
                              {task.request_params.youtube.channel_urls.length > 3 && (
                                <div style={{ color: '#9CA3AF', fontSize: 9, marginTop: 1 }}>
                                  ...还有 {task.request_params.youtube.channel_urls.length - 3} 个
                                  <button
                                    onClick={() => {
                                      showUserList('YouTube', task.request_params.youtube!.channel_urls)
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#8B5CF6',
                                      textDecoration: 'underline',
                                      cursor: 'pointer',
                                      fontSize: 9,
                                      marginLeft: 4,
                                    }}
                                  >
                                    查看全部
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 4px', fontSize: 14 }}>
                      <span
                        style={{
                          background: `${getStatusColor(task.status)}20`,
                          color: getStatusColor(task.status),
                          padding: '4px 8px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 'medium',
                        }}
                      >
                        {getStatusText(task.status)}
                      </span>
                    </td>
                    <td style={{ padding: '12px 4px', fontSize: 14 }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>
                          {task.completed_platforms}/{task.total_platforms} 平台完成
                        </div>
                        <div style={{ fontSize: 12, color: '#22C55E', fontWeight: 'medium' }}>
                          {task.progress_percentage}% (成功率: {task.success_rate}%)
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 4px', fontSize: 14 }}>
                      <div style={{ fontSize: 12 }}>
                        <div style={{ color: '#6B7280' }}>档案: {task.total_profiles_saved}</div>
                        <div style={{ color: '#6B7280' }}>帖子: {task.total_posts_saved}</div>
                        <div style={{ color: '#6B7280' }}>快照: {task.total_snapshots_saved}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 4px', fontSize: 14, color: '#6B7280' }}>
                      <div style={{ fontSize: 12 }}>
                        <div>创建: {new Date(task.created_time).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                        {task.completed_at && (
                          <div>完成: {new Date(task.completed_at).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 4px', fontSize: 14 }}>
                      {task.status === 'completed' && (
                        <button
                          onClick={() => {
                            const results = {
                              tiktok: task.tiktok_results,
                              instagram: task.instagram_results,
                              youtube: task.youtube_results,
                            }
                            alert(`任务结果:\n${JSON.stringify(results, null, 2)}`)
                          }}
                          style={{
                            background: '#22C55E',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: 4,
                            border: 'none',
                            fontSize: 12,
                            cursor: 'pointer',
                            marginRight: 4,
                          }}
                        >
                          查看结果
                        </button>
                      )}
                      {task.status === 'failed' && task.error_message && (
                        <button
                          onClick={() => alert(`错误信息: ${task.error_message}\n${task.error_details || ''}`)}
                          style={{
                            background: '#EF4444',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: 4,
                            border: 'none',
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          查看错误
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* 分页组件 */}
        {totalPages > 1 && <PaginationComponent />}
      </div>

      {/* 用户列表弹窗 */}
      <UserListModal
        title={modalState.title}
        users={modalState.users}
        isOpen={modalState.isOpen}
        onClose={closeModal}
      />
    </div>
  )
}

export default ScrapingTasks