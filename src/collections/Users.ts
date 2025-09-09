import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    // 所有认证用户都可以访问admin面板
    admin: ({ req: { user } }) => Boolean(user),
    // 只有@apob.io用户可以看到和操作Users collection
    read: ({ req: { user } }) => {
      return user?.email ? user.email.endsWith('@apob.io') : false
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
