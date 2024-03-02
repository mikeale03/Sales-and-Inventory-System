export const Channels = {
  create: 'tags:create',
  getAll: 'tags:get-all',
  update: 'tags:update',
  delete: 'tags:delete',
} as const;

export type TagsChannels = (typeof Channels)[keyof typeof Channels];
