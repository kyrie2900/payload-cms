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
    return [
      {
        source: '/backend-api/:path*',
        destination: 'http://54.218.129.238:8089/:path*',
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
