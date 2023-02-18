export const Channels = {
  create: 'products:create',
  update: 'products:update',
  delete: 'products:delete',
  get: 'products:get',
  getAll: 'products:get-all',
  search: 'products:search',
  purchase: 'products:purchase',
} as const;

export type ProductChannels = (typeof Channels)[keyof typeof Channels];
