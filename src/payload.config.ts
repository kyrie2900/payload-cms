// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { KolProfiles } from './collections/KolProfiles'
import { KolPosts } from './collections/KolPosts'
// 自定义 Admin 组件通过 importMap 提供，配置里使用别名字符串

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      autoGenerate: false,
    },
    components: {
      views: {
        analytics: {
          path: '/custom/analytics',
          Component: '#analytics',
        },
        scraping: {
          path: '/custom/scraping',
          Component: '#scrapingTasks',
        },
      },
      afterNavLinks: ['#analyticsNav', '#scrapingTasksNav'],
    },
  },
  collections: [Users, Media, KolProfiles, KolPosts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // 启用 TLS：当满足任意条件时开启，并放宽证书校验以快速联通
      // 1) DATABASE_SSL=true
      // 2) 连接串中包含 sslmode=require 或 ssl=true（node-postgres 不识别，但我们用它作启用信号）
      // 3) 常见云厂商域名（RDS/Neon/Supabase），默认开启
      ssl: (() => {
        const uri = process.env.DATABASE_URI || ''
        const hasSSLFlag = /[?&]sslmode=require/i.test(uri) || /[?&]ssl=true/i.test(uri)
        const cloudHost = /rds\.amazonaws\.com|neon\.tech|supabase\.co/i.test(uri)
        const envFlag = process.env.DATABASE_SSL === 'true'
        return envFlag || hasSSLFlag || cloudHost ? { rejectUnauthorized: false } : undefined
      })(),
    },
    // 可选：指定自定义 schema（如非 public）
    schemaName: process.env.DATABASE_SCHEMA,
    // 仅允许 Payload 自身表进行 schema push，避免改动现有 kol_* 表
    tablesFilter: [
      'users',
      'users_sessions',
      'payload_locked_documents',
      'payload_locked_documents_rels',
      'payload_preferences',
      'payload_preferences_rels',
      'payload_migrations',
    ],
    // 临时开启 push 以创建缺失的 Payload 自身表（不会影响 kol_*），完成后可改回 false
    push: false,
    prodMigrations: [],
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
