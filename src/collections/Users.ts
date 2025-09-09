import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    // 只对@apob.io用户显示Users菜单项
    hidden: ({ user }) => {
      return !user?.email || !user.email.endsWith('@apob.io')
    },
  },
  auth: true,
  access: {
    // 所有认证用户都可以访问admin面板
    admin: ({ req: { user } }) => Boolean(user),
    // 读取权限：用户可以读取自己的信息，只有@apob.io用户可以读取所有用户信息
    read: ({ req: { user } }) => {
      // 如果没有用户信息，拒绝访问
      if (!user) return false
      
      // 如果是@apob.io用户，可以访问所有用户信息
      if (user.email && user.email.endsWith('@apob.io')) {
        return true
      }
      
      // 普通用户只能访问自己的信息
      return { id: { equals: user.id } }
    },
    create: ({ req: { user } }) => {
      return user?.email ? user.email.endsWith('@apob.io') : false
    },
    update: ({ req: { user } }) => {
      return user?.email ? user.email.endsWith('@apob.io') : false
    },
    delete: ({ req: { user } }) => {
      return user?.email ? user.email.endsWith('@apob.io') : false
    },
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
