import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// 定义请求数据类型
interface ScrapingRequest {
  tiktok_influencer_list: string[]
  instagram_influencer_list: string[]
  youtube_influencer_list: string[]
  max_videos_per_user: number
}

// 定义任务状态类型
type TaskStatus = 'pending' | 'running' | 'completed' | 'failed'

interface ScrapingTask {
  id: string
  request_data: ScrapingRequest
  status: TaskStatus
  created_at: string
  updated_at: string
  completed_at?: string
  error?: string
  result?: Record<string, unknown>
  total_influencers: number
}

// 模拟任务存储（实际项目中应该使用数据库）
const tasks: Map<string, ScrapingTask> = new Map()

// 生成任务ID
function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// GET - 获取任务列表
export async function GET(request: NextRequest) {
  try {
    const _payload = await getPayload({ config })
    
    // 从URL参数获取查询条件
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('page_size') || '5')
    const status = searchParams.get('status') as TaskStatus | null

    // 获取所有任务并转换为数组
    let taskList = Array.from(tasks.values())
    
    // 按状态过滤
    if (status) {
      taskList = taskList.filter(task => task.status === status)
    }
    
    // 按创建时间倒序排序
    taskList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    // 分页计算
    const total = taskList.length
    const offset = (page - 1) * pageSize
    const items = taskList.slice(offset, offset + pageSize)
    
    // 转换为后端期望的数据格式
    const backendItems = items.map(task => ({
      task_id: task.id,
      task_name: `爬取任务 - ${getPlatformNames(task)}`,
      task_description: `处理 ${getTaskPlatformCount(task)} 个平台的爬取任务`,
      status: task.status,
      request_params: {
        config: {
          save_to_db: true,
          export_to_file: false,
          save_snapshots: true,
        },
        tiktok: task.request_data.tiktok_influencer_list?.length > 0 ? {
          usernames: task.request_data.tiktok_influencer_list,
          max_videos: task.request_data.max_videos_per_user,
        } : null,
        instagram: task.request_data.instagram_influencer_list?.length > 0 ? {
          usernames: task.request_data.instagram_influencer_list,
          max_videos: task.request_data.max_videos_per_user,
        } : null,
        youtube: task.request_data.youtube_influencer_list?.length > 0 ? {
          channel_urls: task.request_data.youtube_influencer_list,
          max_videos: task.request_data.max_videos_per_user,
        } : null,
      },
      total_platforms: getTaskPlatformCount(task),
      completed_platforms: task.status === 'completed' ? getTaskPlatformCount(task) : 0,
      failed_platforms: task.status === 'failed' ? getTaskPlatformCount(task) : 0,
      tiktok_status: task.request_data.tiktok_influencer_list?.length > 0 ? 
        (task.status === 'completed' ? 'completed' : task.status) : 'not_requested',
      instagram_status: task.request_data.instagram_influencer_list?.length > 0 ? 
        (task.status === 'completed' ? 'completed' : task.status) : 'not_requested',
      youtube_status: task.request_data.youtube_influencer_list?.length > 0 ? 
        (task.status === 'completed' ? 'completed' : task.status) : 'not_requested',
      tiktok_results: task.status === 'completed' && task.request_data.tiktok_influencer_list?.length > 0 ? {
        success: true,
        posts_saved: task.request_data.tiktok_influencer_list.length * task.request_data.max_videos_per_user,
        error_message: null,
        posts_scraped: task.request_data.tiktok_influencer_list.length * task.request_data.max_videos_per_user,
        profiles_saved: task.request_data.tiktok_influencer_list.length,
        processed_items: task.request_data.tiktok_influencer_list,
        snapshots_saved: task.request_data.tiktok_influencer_list.length * (task.request_data.max_videos_per_user + 1),
        profiles_scraped: task.request_data.tiktok_influencer_list.length,
      } : null,
      instagram_results: task.status === 'completed' && task.request_data.instagram_influencer_list?.length > 0 ? {
        success: true,
        posts_saved: task.request_data.instagram_influencer_list.length * task.request_data.max_videos_per_user,
        error_message: null,
        posts_scraped: task.request_data.instagram_influencer_list.length * task.request_data.max_videos_per_user,
        profiles_saved: task.request_data.instagram_influencer_list.length,
        processed_items: task.request_data.instagram_influencer_list,
        snapshots_saved: task.request_data.instagram_influencer_list.length * (task.request_data.max_videos_per_user + 1),
        profiles_scraped: task.request_data.instagram_influencer_list.length,
      } : null,
      youtube_results: task.status === 'completed' && task.request_data.youtube_influencer_list?.length > 0 ? {
        success: true,
        posts_saved: task.request_data.youtube_influencer_list.length * task.request_data.max_videos_per_user,
        error_message: null,
        posts_scraped: task.request_data.youtube_influencer_list.length * task.request_data.max_videos_per_user,
        profiles_saved: task.request_data.youtube_influencer_list.length,
        processed_items: task.request_data.youtube_influencer_list,
        snapshots_saved: task.request_data.youtube_influencer_list.length * (task.request_data.max_videos_per_user + 1),
        profiles_scraped: task.request_data.youtube_influencer_list.length,
      } : null,
      total_profiles_scraped: task.total_influencers,
      total_posts_scraped: task.status === 'completed' ? task.total_influencers * task.request_data.max_videos_per_user : 0,
      total_profiles_saved: task.status === 'completed' ? task.total_influencers : 0,
      total_posts_saved: task.status === 'completed' ? task.total_influencers * task.request_data.max_videos_per_user : 0,
      total_snapshots_saved: task.status === 'completed' ? task.total_influencers * (task.request_data.max_videos_per_user + 1) : 0,
      created_time: task.created_at,
      started_at: task.status !== 'pending' ? task.updated_at : null,
      completed_at: task.completed_at,
      updated_time: task.updated_at,
      duration_seconds: task.completed_at ? 
        Math.floor((new Date(task.completed_at).getTime() - new Date(task.created_at).getTime()) / 1000) : null,
      error_message: task.error,
      error_details: null,
      progress_percentage: task.status === 'completed' ? 100 : (task.status === 'running' ? 50 : 0),
      success_rate: task.status === 'completed' ? 100 : (task.status === 'failed' ? 0 : 100),
    }))
    
    return NextResponse.json({
      page,
      page_size: pageSize,
      total,
      items: backendItems,
    })
  } catch (error) {
    console.error('获取爬取任务失败:', error)
    return NextResponse.json(
      { error: '获取任务列表失败' },
      { status: 500 }
    )
  }
}

// 辅助函数
function getPlatformNames(task: ScrapingTask): string {
  const platforms = []
  if (task.request_data.tiktok_influencer_list?.length > 0) platforms.push('Tiktok')
  if (task.request_data.instagram_influencer_list?.length > 0) platforms.push('Instagram')
  if (task.request_data.youtube_influencer_list?.length > 0) platforms.push('Youtube')
  return platforms.join('+')
}

function getTaskPlatformCount(task: ScrapingTask): number {
  let count = 0
  if (task.request_data.tiktok_influencer_list?.length > 0) count++
  if (task.request_data.instagram_influencer_list?.length > 0) count++
  if (task.request_data.youtube_influencer_list?.length > 0) count++
  return count
}

// POST - 创建新的爬取任务
export async function POST(request: NextRequest) {
  try {
    const _payload = await getPayload({ config })
    const body: ScrapingRequest = await request.json()
    
    // 验证请求数据
    if (!body.tiktok_influencer_list && !body.instagram_influencer_list && !body.youtube_influencer_list) {
      return NextResponse.json(
        { error: '至少需要提供一个平台的影响者列表' },
        { status: 400 }
      )
    }
    
    if (!body.max_videos_per_user || body.max_videos_per_user <= 0) {
      return NextResponse.json(
        { error: 'max_videos_per_user 必须是大于0的整数' },
        { status: 400 }
      )
    }
    
    // 计算总影响者数量
    const totalInfluencers = (body.tiktok_influencer_list?.length || 0) + 
                           (body.instagram_influencer_list?.length || 0) + 
                           (body.youtube_influencer_list?.length || 0)
    
    // 创建新任务
    const taskId = generateTaskId()
    const now = new Date().toISOString()
    
    const newTask: ScrapingTask = {
      id: taskId,
      request_data: body,
      status: 'pending',
      created_at: now,
      updated_at: now,
      total_influencers: totalInfluencers,
    }
    
    // 存储任务
    tasks.set(taskId, newTask)
    
    // 调用后端爬取服务
    callBackendScrapingService(newTask)
    
    return NextResponse.json({
      success: true,
      task: newTask,
      message: `成功创建爬取任务，将处理 ${totalInfluencers} 个影响者`
    }, { status: 201 })
    
  } catch (error) {
    console.error('创建爬取任务失败:', error)
    return NextResponse.json(
      { error: '创建任务失败' },
      { status: 500 }
    )
  }
}

// 调用后端爬取服务
async function callBackendScrapingService(task: ScrapingTask) {
  try {
    // 延迟一下，让前端能看到pending状态
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 更新状态为运行中
    task.status = 'running'
    task.updated_at = new Date().toISOString()
    tasks.set(task.id, task)
    
    // 后端服务配置 - 与前端保持一致
    const BACKEND_HOST = '54.218.129.238'
    const BACKEND_PORT = '8089'
    const BACKEND_SCRAPING_API = `http://${BACKEND_HOST}:${BACKEND_PORT}/influencer/scrape-process`
    
    console.log(`🚀 调用后端爬取服务: ${BACKEND_SCRAPING_API}`)
    console.log('请求数据:', JSON.stringify(task.request_data, null, 2))
    
    // 调用你的后端爬取服务
    const response = await fetch(BACKEND_SCRAPING_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '123'
        // 可以添加认证头
        // 'Authorization': `Bearer ${process.env.BACKEND_API_TOKEN}`,
      },
      body: JSON.stringify(task.request_data),
      // 设置较长的超时时间，因为爬取可能需要很久
      signal: AbortSignal.timeout(300000), // 5分钟超时
    })
    
    if (response.ok) {
      const result = await response.json()
      
      // 成功完成
      task.status = 'completed'
      task.completed_at = new Date().toISOString()
      task.result = result
      task.updated_at = new Date().toISOString()
      
      console.log(`✅ 任务 ${task.id} 完成:`, result)
      
    } else {
      // 后端服务返回错误
      const errorText = await response.text()
      task.status = 'failed'
      task.error = `后端服务错误 (${response.status}): ${errorText}`
      task.updated_at = new Date().toISOString()
      
      console.error(`❌ 任务 ${task.id} 失败:`, task.error)
    }
    
    tasks.set(task.id, task)
    
  } catch (error) {
    // 网络或其他异常
    task.status = 'failed'
    task.error = `调用后端服务异常: ${error instanceof Error ? error.message : '未知错误'}`
    task.updated_at = new Date().toISOString()
    tasks.set(task.id, task)
    
    console.error(`❌ 任务 ${task.id} 异常:`, error)
  }
}

// PUT - 更新任务状态（可选，用于手动控制）
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('id')
    const body = await request.json()
    
    if (!taskId) {
      return NextResponse.json(
        { error: '缺少任务ID' },
        { status: 400 }
      )
    }
    
    const task = tasks.get(taskId)
    if (!task) {
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      )
    }
    
    // 更新任务状态
    if (body.status) {
      task.status = body.status
      task.updated_at = new Date().toISOString()
      
      if (body.status === 'completed' && body.result) {
        task.result = body.result
        task.completed_at = new Date().toISOString()
      }
      
      if (body.status === 'failed' && body.error) {
        task.error = body.error
      }
      
      tasks.set(taskId, task)
    }
    
    return NextResponse.json({
      success: true,
      task
    })
    
  } catch (error) {
    console.error('更新任务失败:', error)
    return NextResponse.json(
      { error: '更新任务失败' },
      { status: 500 }
    )
  }
}

// DELETE - 删除任务
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('id')
    
    if (!taskId) {
      return NextResponse.json(
        { error: '缺少任务ID' },
        { status: 400 }
      )
    }
    
    const deleted = tasks.delete(taskId)
    
    if (!deleted) {
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: '任务删除成功'
    })
    
  } catch (error) {
    console.error('删除任务失败:', error)
    return NextResponse.json(
      { error: '删除任务失败' },
      { status: 500 }
    )
  }
}