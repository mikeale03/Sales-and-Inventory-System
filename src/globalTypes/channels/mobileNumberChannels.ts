export const Channels = {
  create: 'mobile-numbers:create',
  getAll: 'mobile-numbers:get-all',
  update: 'mobile-numbers:update',
  delete: 'mobile-numbers:delete',
} as const;

export type MobileNumberChannels = (typeof Channels)[keyof typeof Channels];
