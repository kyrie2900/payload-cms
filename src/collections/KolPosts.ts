import type { CollectionConfig } from 'payload'

// 映射到现有表：kol_posts
export const KolPosts: CollectionConfig = {
  slug: 'kol_posts',
  labels: {
    singular: 'KOL Post',
    plural: 'KOL Posts',
  },
  access: {
    // 所有用户都可以访问KOL Posts
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['platform', 'thumbnail_url', 'platform_post_id', 'title', 'view_count', 'publish_time', 'updated_time'],
  },
  dbName: 'kol_posts',
  // 使用自定义时间字段，禁用 Payload 默认 createdAt/updatedAt
  timestamps: false,
  fields: [
    { name: 'profile_id', type: 'text', required: true },
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
    { 
      name: 'platform_post_id', 
      type: 'text', 
      required: true,
      admin: {
        components: {
          Cell: '#postIdCell',
        },
      },
    },

    { name: 'post_type', type: 'number', defaultValue: 1 },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    { 
      name: 'publish_time', 
      type: 'date',
      admin: {
        components: {
          Cell: '#dateCell',
        },
      },
    },
    { name: 'post_url', type: 'text' },
    { 
      name: 'thumbnail_url', 
      type: 'text',
      admin: {
        components: {
          Cell: '#thumbnailCell',
        },
      },
    },
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

export default KolPosts


