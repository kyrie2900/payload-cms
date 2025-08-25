import type { CollectionConfig } from 'payload'

// 映射到现有表：kol_posts
export const KolPosts: CollectionConfig = {
  slug: 'kol_posts',
  labels: {
    singular: 'KOL Post',
    plural: 'KOL Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['id', 'platform', 'platform_post_id', 'view_count', 'publish_time', 'updated_time'],
  },
  dbName: 'kol_posts',
  // 使用自定义时间字段，禁用 Payload 默认 createdAt/updatedAt
  timestamps: false,
  fields: [
    { name: 'profile_id', type: 'text', required: true },
    { name: 'platform', type: 'number', required: true },
    { name: 'platform_post_id', type: 'text', required: true },

    { name: 'post_type', type: 'number', defaultValue: 1 },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'publish_time', type: 'date' },
    { name: 'post_url', type: 'text' },
    { name: 'thumbnail_url', type: 'text' },
    { name: 'video_url', type: 'text' },

    { name: 'view_count', type: 'number', defaultValue: 0 },
    { name: 'like_count', type: 'number', defaultValue: 0 },
    { name: 'comment_count', type: 'number', defaultValue: 0 },
    { name: 'share_count', type: 'number', defaultValue: 0 },
    { name: 'duration_sec', type: 'number', defaultValue: 0 },

    { name: 'hashtags', type: 'json' },
    { name: 'mentions', type: 'json' },
    { name: 'music_meta', type: 'json' },
    { name: 'child_posts', type: 'json' },
    { name: 'source_file', type: 'text' },

    {
      name: 'created_time',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'updated_time',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}

export default KolPosts


