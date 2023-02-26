export const Channels = {
  create: 'users:create',
  login: 'users:login',
  getAdminQuantity: 'users:admin-quantity',
  getAll: 'users:get-all',
  updateUser: 'users:update-user',
  delete: 'users:delete',
} as const;

export type UserChannels = (typeof Channels)[keyof typeof Channels];
