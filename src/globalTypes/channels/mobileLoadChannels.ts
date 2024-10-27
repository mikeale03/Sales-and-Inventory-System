export const MobileLoadChannels = {
  create: 'mobile-loads:create',
  update: 'mobile-loads:update',
  delete: 'mobile-loads:delete',
  get: 'mobile-loads:get',
} as const;

export type MobileLoadChannels =
  (typeof MobileLoadChannels)[keyof typeof MobileLoadChannels];
