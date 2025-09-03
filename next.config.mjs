import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  // 配置代理来解决跨域问题
  async rewrites() {
    // 根据环境或请求动态选择后端地址
    const isLocalhost = process.env.NODE_ENV === 'development'
    const backendHost = isLocalhost ? '0.0.0.0' : '54.218.129.238'
    
    return [
      {
        source: '/backend-api/:path*',
        destination: `http://${backendHost}:8089/:path*`,
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
