export const Channels = {
  create: 'gcash-accounts:create',
  getAll: 'gcash-accounts:get-all',
  update: 'gcash-accounts:update',
  delete: 'gcash-accounts:delete',
} as const;

export type GcashAccountChannels = (typeof Channels)[keyof typeof Channels];
