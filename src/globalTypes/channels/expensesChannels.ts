export const Channels = {
  create: 'expenses:create',
  getAll: 'expenses:get-all',
} as const;

export type ExpensesChannels = (typeof Channels)[keyof typeof Channels];
