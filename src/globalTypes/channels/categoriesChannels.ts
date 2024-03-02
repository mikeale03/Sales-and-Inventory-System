export const Channels = {
  create: 'categories:create',
  getAll: 'categories:get-all',
  update: 'categories:update',
  delete: 'categories:delete',
} as const;

export type CategoriesChannels = (typeof Channels)[keyof typeof Channels];
