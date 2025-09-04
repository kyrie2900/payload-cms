import { NextRequest, NextResponse } from 'next/server'

// 代理路由，转发到真实的后端API，解决CORS问题
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('page_size') || '5'
    
    // 后端服务配置 - 与前端保持一致
    const BACKEND_HOST = '44.250.41.129'
    const BACKEND_PORT = '8089'
    const backendUrl = `http://${BACKEND_HOST}:${BACKEND_PORT}/tasks?page=${page}&page_size=${pageSize}`
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: '后端API调用失败', status: response.status },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    
    // 返回数据，自动处理CORS
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('代理API错误:', error)
    return NextResponse.json(
      { error: '无法连接到后端服务', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}
