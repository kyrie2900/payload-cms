import type { CollectionConfig } from 'payload'

// 映射到现有表：kol_profiles
export const KolProfiles: CollectionConfig = {
  slug: 'kol_profiles',
  labels: {
    singular: 'KOL Profile',
    plural: 'KOL Profiles',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'username',
    defaultColumns: ['platform', 'avatar_url', 'username', 'follower_count', 'updated_time'],
  },
  // 使用现有表名（Payload v3 支持 dbName，于 Postgres 适配器生效）
  dbName: 'kol_profiles',
  // 使用自定义时间字段，禁用 Payload 默认 createdAt/updatedAt
  timestamps: false,
  // 现有表已经有 bigserial 主键 `id`，无需自定义 id 字段
  fields: [
    { 
      name: 'platform', 
      type: 'number',
      required: true,
      admin: {
        description: '平台：1=TikTok, 2=YouTube, 3=Instagram',
        components: {
          Cell: '#platformCell',
        },
      },
    },
    { name: 'platform_user_id', type: 'text', required: true },
    { 
      name: 'username', 
      type: 'text',
      admin: {
        components: {
          Cell: '#usernameCell',
        },
      },
    },
    { name: 'display_name', type: 'text' },
    { name: 'description', type: 'textarea' },
    { 
      name: 'avatar_url', 
      type: 'text',
      admin: {
        components: {
          Cell: '#avatarCell',
        },
      },
    },
    { name: 'email', type: 'email' },

    { name: 'follower_count', type: 'number', defaultValue: 0 },
    { name: 'following_count', type: 'number', defaultValue: 0 },
    { name: 'content_count', type: 'number', defaultValue: 0 },

    { name: 'is_private', type: 'number', defaultValue: 0 },
    { name: 'is_verified', type: 'number', defaultValue: 0 },

    { name: 'total_likes', type: 'number' },
    { name: 'total_views', type: 'number' },

    { name: 'country', type: 'text' },
    { 
      name: 'platform_created_date', 
      type: 'date',
      admin: {
        components: {
          Cell: '#dateCell',
        },
      },
    },
    { name: 'banner_url', type: 'text' },
    { name: 'external_links', type: 'json' },

    { name: 'highlight_reel_count', type: 'number', defaultValue: 0 },
    { name: 'is_business_account', type: 'number', defaultValue: 0 },
    { name: 'business_category_name', type: 'text' },
    { name: 'source_file', type: 'text' },

    { name: 'delete_status', type: 'number', required: true, defaultValue: 0 },

    // 时间字段放在侧栏展示，注意与 DB 触发器兼容
    {
      name: 'created_time',
      type: 'date',
      admin: { 
        position: 'sidebar',
        components: {
          Cell: '#dateCell',
        },
      },
    },
    {
      name: 'updated_time',
      type: 'date',
      admin: { 
        position: 'sidebar',
        components: {
          Cell: '#dateCell',
        },
      },
    },
  ],
}

export default KolProfiles


