import type { CollectionConfig } from 'payload'

// 映射到现有表：kol_master_profile
export const KolMasterProfiles: CollectionConfig = {
  slug: 'kol_master_profiles',
  labels: {
    singular: 'Influencer Master Profile',
    plural: 'Influencer Master Profiles',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['tiktok_name', 'youtube_name', 'instagram_name', 'email', 'stage', 'updated_time'],
  },
  // 使用现有表名（Payload v3 支持 dbName，于 Postgres 适配器生效）
  dbName: 'kol_master_profile',
  // 使用自定义时间字段，禁用 Payload 默认 createdAt/updatedAt
  timestamps: false,
  // 现有表已经有 bigint 主键 `id`，无需自定义 id 字段
  fields: [
    {
      name: 'tiktok_id',
      type: 'text',
      admin: {
        description: '用户在tiktok上的userId',
      },
    },
    {
      name: 'youtube_id',
      type: 'text',
      admin: {
        description: '用户在youtube上的userId',
      },
    },
    {
      name: 'instagram_id',
      type: 'text',
      admin: {
        description: '用户在ig上的userId',
      },
    },
    {
      name: 'tiktok_name',
      type: 'text',
      admin: {
        description: '用户在tt上用户名',
      },
    },
    {
      name: 'youtube_name',
      type: 'text',
      admin: {
        description: '用户在youtube上用户名',
      },
    },
    {
      name: 'instagram_name',
      type: 'text',
      admin: {
        description: '用户在ig上用户名',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: '邮箱',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      admin: {
        description: '运营人员的评价',
      },
    },
    {
      name: 'model_id',
      type: 'text',
      admin: {
        description: '关联的modelId，默认为空',
      },
    },
    {
      name: 'ops_owner',
      type: 'text',
      admin: {
        description: '运营人邮箱',
      },
    },
    {
      name: 'stage',
      type: 'text',
      admin: {
        description: '运行阶段',
      },
    },

    // 时间字段放在侧栏展示，注意与 DB 触发器兼容
    {
      name: 'created_time',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: '创建时间',
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
        description: '更新时间',
        components: {
          Cell: '#dateCell',
        },
      },
    },
  ],
}

export default KolMasterProfiles