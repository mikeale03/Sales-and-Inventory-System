export const Channels = {
  getTransactions: 'gcash:get-transactions',
  createTransactions: 'gcash:create-transactions',
  deleteTransaction: 'gcash:delete-transaction',
  getGcashBalance: 'gcash:get-balance',
} as const;

export type GcashChannels = (typeof Channels)[keyof typeof Channels];
