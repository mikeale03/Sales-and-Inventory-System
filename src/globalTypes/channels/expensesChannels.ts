export const Channels = {
  create: 'expenses:create',
  getAll: 'expenses:get-all',
  delete: 'expenses:delete',
  update: 'expenses:update',
} as const;

export type ExpensesChannels = (typeof Channels)[keyof typeof Channels];
