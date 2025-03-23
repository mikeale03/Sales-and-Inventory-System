export const Channels = {
  create: 'expenses:create',
  getAll: 'expenses:get-all',
  delete: 'expenses:delete',
  update: 'expenses:update',
  updateMany: 'expenses:update-many',
} as const;

export type ExpensesChannels = (typeof Channels)[keyof typeof Channels];
