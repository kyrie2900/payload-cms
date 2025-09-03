import { NextRequest, NextResponse } from 'next/server'

// 代理路由，转发到真实的后端API，解决CORS问题
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('page_size') || '5'
    
    // 转发请求到真实的后端API
    const backendUrl = `http://54.218.129.238:8089/tasks?page=${page}&page_size=${pageSize}`
    
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
