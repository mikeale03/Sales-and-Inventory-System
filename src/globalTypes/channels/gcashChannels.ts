export const Channels = {
  getTransactions: 'gcash:get-transactions',
  createTransactions: 'gcash:create-transactions',
  deleteTransaction: 'gcash:delete-transaction',
} as const;

export type GcashChannels = (typeof Channels)[keyof typeof Channels];
